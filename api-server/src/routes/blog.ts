import { Router } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "../src/data/blog-posts.json");
const RATING_FILE = path.join(__dirname, "../src/data/rating.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "GaQue@Admin2025";

interface RatingData {
  google_rating: number;
  google_count: number;
  show_tripadvisor: boolean;
  tripadvisor_rating: number;
  tripadvisor_count: number;
}

function readRating(): RatingData {
  try {
    return JSON.parse(fs.readFileSync(RATING_FILE, "utf-8")) as RatingData;
  } catch {
    return { google_rating: 4.9, google_count: 17, show_tripadvisor: false, tripadvisor_rating: 4.5, tripadvisor_count: 1 };
  }
}

function writeRating(data: RatingData) {
  fs.writeFileSync(RATING_FILE, JSON.stringify(data, null, 2), "utf-8");
}

const router = Router();

const SESSION_TTL = 24 * 60 * 60 * 1000;
const sessions = new Map<string, number>();

const RATE_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getIp(req: import("express").Request): string {
  return (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.socket.remoteAddress ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function resetRateLimit(ip: string) {
  attempts.delete(ip);
}

function createSession(): string {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_TTL);
  return token;
}

function isValidSession(token: string): boolean {
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) { sessions.delete(token); return false; }
  return true;
}

function requireAuth(req: import("express").Request, res: import("express").Response): string | null {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !isValidSession(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return token;
}

function readPosts() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as BlogPost[];
}

function writePosts(posts: BlogPost[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

interface BlogPost {
  id: number;
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imageUrl?: string;
  content?: string;
}

router.post("/auth", (req, res) => {
  if (!ADMIN_PASSWORD) {
    res.status(500).json({ error: "ADMIN_PASSWORD chưa được cấu hình" });
    return;
  }
  const ip = getIp(req);
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Quá nhiều lần thử. Vui lòng đợi 15 phút." });
    return;
  }
  const { password } = req.body as { password?: string };
  if (password === ADMIN_PASSWORD) {
    resetRateLimit(ip);
    const token = createSession();
    res.json({ token });
  } else {
    res.status(401).json({ error: "Sai mật khẩu" });
  }
});

router.get("/auth", (req, res) => {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token && isValidSession(token)) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: "Phiên đăng nhập đã hết hạn" });
  }
});

router.delete("/auth", (req, res) => {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

router.get("/rating", (_req, res) => {
  res.json(readRating());
});

router.put("/rating", (req, res) => {
  if (!requireAuth(req, res)) return;
  const { google_rating, google_count, show_tripadvisor, tripadvisor_rating, tripadvisor_count } = req.body as Partial<RatingData>;
  const current = readRating();
  const updated: RatingData = {
    google_rating: typeof google_rating === "number" ? google_rating : current.google_rating,
    google_count: typeof google_count === "number" ? google_count : current.google_count,
    show_tripadvisor: typeof show_tripadvisor === "boolean" ? show_tripadvisor : current.show_tripadvisor,
    tripadvisor_rating: typeof tripadvisor_rating === "number" ? tripadvisor_rating : current.tripadvisor_rating,
    tripadvisor_count: typeof tripadvisor_count === "number" ? tripadvisor_count : current.tripadvisor_count,
  };
  writeRating(updated);
  res.json(updated);
});

router.get("/blog", (_req, res) => {
  const posts = readPosts();
  res.json(posts.sort((a, b) => {
    const parse = (d: string) => {
      const [day, month, year] = d.split("/");
      return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    };
    return parse(b.date) - parse(a.date);
  }));
});

router.get("/blog/:slug", (req, res) => {
  const posts = readPosts();
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) { res.status(404).json({ error: "Không tìm thấy bài viết" }); return; }
  res.json(post);
});

router.post("/blog", (req, res) => {
  if (!requireAuth(req, res)) return;
  const { title, date, category, excerpt, image, imageUrl, content } = req.body as Partial<BlogPost>;
  if (!title || !date || !category || !excerpt) {
    res.status(400).json({ error: "Thiếu thông tin bắt buộc" }); return;
  }
  const posts = readPosts();
  const newPost: BlogPost = {
    id: Date.now(),
    slug: slugify(title),
    date, category, title, excerpt,
    image: image ?? "hero",
    ...(imageUrl ? { imageUrl } : {}),
    ...(content ? { content } : {}),
  };
  posts.unshift(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

router.put("/blog/:id", (req, res) => {
  if (!requireAuth(req, res)) return;
  const id = Number(req.params.id);
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) { res.status(404).json({ error: "Không tìm thấy bài viết" }); return; }

  const { title, date, category, excerpt, image, imageUrl, content } = req.body as Partial<BlogPost>;
  if (!title || !date || !category || !excerpt) {
    res.status(400).json({ error: "Thiếu thông tin bắt buộc" }); return;
  }
  const updated: BlogPost = {
    ...posts[idx], title, date, category, excerpt,
    image: image ?? posts[idx].image,
    slug: slugify(title),
    imageUrl: imageUrl || undefined,
    content: content || undefined,
  };
  posts[idx] = updated;
  writePosts(posts);
  res.json(updated);
});

router.delete("/blog/:id", (req, res) => {
  if (!requireAuth(req, res)) return;
  const id = Number(req.params.id);
  const posts = readPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) {
    res.status(404).json({ error: "Không tìm thấy bài viết" }); return;
  }
  writePosts(filtered);
  res.json({ ok: true });
});


interface RssItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  externalUrl: string;
  category: string;
  source: string;
}

let rssCache: { items: RssItem[]; fetchedAt: number } | null = null;
const RSS_TTL = 30 * 60 * 1000;

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GaQueBot/1.0)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
      timeout: 8000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) { fetchUrl(loc).then(resolve).catch(reject); return; }
      }
      if (!res.statusCode || res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode}`)); return;
      }
      let data = "";
      res.setEncoding("utf-8");
      res.on("data", (chunk: string) => { data += chunk; });
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
  });
}

const BASE_BKH = "https://baokhanhhoa.vn";

function parseBaoKhanhHoa(html: string): RssItem[] {
  const items: RssItem[] = [];
  const seen = new Set<string>();

  // Match avatar (image+link) blocks: <a href="..." class="avatar..."><img src="..." alt="..."></a>
  const avatarRe = /<a\s[^>]*href="([^"]+)"[^>]*class="avatar[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[\s\S]*?<\/a>/g;
  const avatarMatches = [...html.matchAll(avatarRe)];

  for (const m of avatarMatches) {
    const relLink = m[1];
    const relImg = m[2];
    if (!relLink || seen.has(relLink)) continue;
    // Only include food/travel articles
    if (!/\/(du-lich|am-thuc|doi-song|van-hoa)/.test(relLink)) continue;
    seen.add(relLink);

    const link = relLink.startsWith("http") ? relLink : BASE_BKH + relLink;
    const imageUrl = relImg.startsWith("http") ? relImg : BASE_BKH + relImg;
    // alt attribute often contains the title
    const altTitle = m[3]?.trim() ?? "";

    // Slice of HTML after this avatar block to find title/date/desc
    const pos = (m.index ?? 0) + m[0].length;
    const nearby = html.slice(pos, pos + 600);

    const title = nearby.match(/class="title[^"]*"[^>]*>([^<]{5,150})<\/a>/)?.[1]?.trim()
      ?? altTitle;
    const date = nearby.match(/class="date"[^>]*>([^<]+)<\/div>/)?.[1]?.trim() ?? "";
    const excerpt = nearby.match(/class="des[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1]
      ?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 200) ?? "";

    // Format date: "14:23, 07/05/2026" → "07/05/2026"
    const dateFmt = date.replace(/^\d{1,2}:\d{2},\s*/, "").trim();

    if (title) {
      items.push({
        id: relLink,
        title,
        excerpt,
        imageUrl,
        date: dateFmt,
        externalUrl: link,
        category: "Ẩm Thực",
        source: "Báo Khánh Hòa",
      });
    }
    if (items.length >= 9) break;
  }
  return items;
}

router.get("/rss", async (_req, res) => {
  if (rssCache && Date.now() - rssCache.fetchedAt < RSS_TTL) {
    res.json(rssCache.items); return;
  }
  try {
    const html = await fetchUrl(`${BASE_BKH}/du-lich-am-thuc/`);
    const items = parseBaoKhanhHoa(html);
    rssCache = { items, fetchedAt: Date.now() };
    res.json(items);
  } catch {
    if (rssCache) { res.json(rssCache.items); return; }
    res.status(502).json({ error: "Không thể tải tin từ Báo Khánh Hòa" });
  }
});

export default router;
