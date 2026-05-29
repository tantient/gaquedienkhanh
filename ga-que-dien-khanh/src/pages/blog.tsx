import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { useBanner } from "@/hooks/useBanner";
import { BLOG_POSTS } from "@/lib/translations";
import type { Lang } from "@/lib/translations";
import heroImg from "../assets/images/hero.png";
import hotpotImg from "../assets/images/hotpot.png";
import grilledChickenImg from "../assets/images/grilled_chicken.png";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const IMAGE_MAP: Record<string, string> = {
  hero: heroImg,
  hotpot: hotpotImg,
  grilled: grilledChickenImg,
};

const POST_IMAGES = [heroImg, hotpotImg, grilledChickenImg, hotpotImg];

const LABELS: Record<Lang, { breadcrumb: string; heroTitle: string; heroSub: string; read: string; rssTitle: string; rssSub: string; readMore: string }> = {
  vi: { breadcrumb: "Blog", heroTitle: "Blog & Tin Tức", heroSub: "Kinh nghiệm ẩm thực, câu chuyện bếp núc và những điều thú vị từ Gà Quê Diên Khánh.", read: "Đọc bài viết", rssTitle: "Tin Ẩm Thực Khánh Hòa", rssSub: "Tổng hợp từ Báo Khánh Hòa", readMore: "Đọc thêm →" },
  en: { breadcrumb: "Blog", heroTitle: "Blog & News", heroSub: "Culinary experiences, kitchen stories, and interesting things from Ga Que Dien Khanh.", read: "Read article", rssTitle: "Khánh Hòa Food News", rssSub: "Sourced from Báo Khánh Hòa", readMore: "Read more →" },
  ko: { breadcrumb: "블로그", heroTitle: "블로그 & 소식", heroSub: "가 께 디엔 칸의 음식 경험, 주방 이야기, 흥미로운 소식.", read: "글 읽기", rssTitle: "카인호아 음식 뉴스", rssSub: "Báo Khánh Hòa 제공", readMore: "더 읽기 →" },
  zh: { breadcrumb: "博客", heroTitle: "博客 & 新闻", heroSub: "来自嘉桂延庆的美食体验、厨房故事与趣事。", read: "阅读文章", rssTitle: "庆和省美食资讯", rssSub: "来源：Báo Khánh Hòa", readMore: "阅读更多 →" },
  ru: { breadcrumb: "Блог", heroTitle: "Блог & Новости", heroSub: "Кулинарные впечатления, истории с кухни и интересные новости от Га Ке Зиен Кхань.", read: "Читать статью", rssTitle: "Кулинарные новости Кханьхоа", rssSub: "Источник: Báo Khánh Hòa", readMore: "Читать далее →" },
};

interface ApiPost {
  id: number;
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imageUrl?: string;
}

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

function toDisplayPost(p: ApiPost, idx: number) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    date: p.date,
    excerpt: p.excerpt,
    img: p.imageUrl ? p.imageUrl : (IMAGE_MAP[p.image] ?? POST_IMAGES[idx % POST_IMAGES.length]),
    isExternal: !!p.imageUrl,
  };
}

function fromStaticPost(p: (typeof BLOG_POSTS)[number], lang: Lang, idx: number) {
  return {
    id: p.id,
    slug: p.id.toString(),
    title: p.title[lang],
    category: p.category[lang],
    date: p.date,
    excerpt: p.excerpt[lang],
    img: POST_IMAGES[idx % POST_IMAGES.length],
    isExternal: false,
  };
}

const SEO_BLOG: Record<string, { title: string; description: string }> = {
  vi: { title: "Blog Ẩm Thực | Gà Quê Diên Khánh – Bí Quyết & Câu Chuyện Bếp Quê", description: "Khám phá bí quyết nấu ăn, câu chuyện ẩm thực và tin tức mới nhất từ nhà hàng Gà Quê Diên Khánh tại Nha Trang." },
  en: { title: "Food Blog | Gà Quê Diên Khánh – Recipes & Culinary Stories", description: "Explore cooking tips, culinary stories and the latest news from Gà Quê Diên Khánh restaurant in Nha Trang." },
  ko: { title: "푸드 블로그 | Gà Quê Diên Khánh – 레시피 & 요리 이야기", description: "나트랑 Gà Quê Diên Khánh 레스토랑의 요리 팁, 음식 이야기 및 최신 소식을 탐색해 보세요." },
  zh: { title: "美食博客 | Gà Quê Diên Khánh – 食谱与烹饪故事", description: "探索芽庄Gà Quê Diên Khánh餐厅的烹饪技巧、美食故事和最新资讯。" },
  ru: { title: "Кулинарный Блог | Gà Quê Diên Khánh – Рецепты и Истории", description: "Откройте для себя кулинарные советы, истории и последние новости ресторана Gà Quê Diên Khánh в Нячанге." },
};

export default function Blog() {
  const { lang } = useLang();
  const tx = LABELS[lang] ?? LABELS.vi;
  const seo = SEO_BLOG[lang] ?? SEO_BLOG.vi;
  useSEO({ title: seo.title, description: seo.description, canonical: "https://gaquedienkhanh.com/blog" });
  const bannerUrl = useBanner();
  const [, navigate] = useLocation();
  const [apiPosts, setApiPosts] = useState<ApiPost[] | null>(null);
  const [rssPosts, setRssPosts] = useState<RssItem[]>([]);

  useEffect(() => {
    fetch(`${BASE}/api/blog`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: ApiPost[]) => setApiPosts(data))
      .catch(() => setApiPosts(null));
    fetch(`${BASE}/api/rss`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: RssItem[]) => setRssPosts(data))
      .catch(() => setRssPosts([]));
  }, []);

  const posts = apiPosts
    ? apiPosts.map((p, i) => toDisplayPost(p, i))
    : BLOG_POSTS.map((p, i) => fromStaticPost(p, lang, i));

  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Page Hero */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <img src={bannerUrl || heroImg} alt="Blog ẩm thực và tin tức Gà Quê Diên Khánh Nha Trang" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold">{tx.breadcrumb}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">{tx.heroTitle}</h1>
            <p className="text-white/75 text-base mt-4 max-w-xl font-light">{tx.heroSub}</p>
          </motion.div>
        </div>
      </div>

      {/* Posts */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          {/* Featured post */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            onClick={() => navigate(`${BASE}/blog/${featured.slug}`)}
            className="group mb-16 flex flex-col md:flex-row gap-0 bg-[#F6F4ED] rounded-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            data-testid="card-blog-featured"
          >
            <div className="md:w-[45%] h-64 md:h-auto overflow-hidden flex-shrink-0">
              <img
                src={featured.img}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = heroImg; }}
              />
            </div>
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs bg-accent/15 text-accent px-2.5 py-1 rounded-sm font-semibold">{featured.category}</span>
                <span className="text-xs text-muted-foreground">{featured.date}</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold mb-4 leading-snug group-hover:text-accent transition-colors">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light mb-6">{featured.excerpt}</p>
              <span className="text-sm font-semibold text-accent tracking-wider uppercase">{tx.read} →</span>
            </div>
          </motion.div>

          {/* Grid of remaining posts */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rest.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`${BASE}/blog/${post.slug}`)}
                  className="group bg-[#F6F4ED] rounded-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  data-testid={`card-blog-${post.id}`}
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).src = heroImg; }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-sm font-semibold">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h3 className="font-serif text-lg text-primary font-bold mb-3 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light mb-4 line-clamp-3">{post.excerpt}</p>
                    <span className="text-xs font-semibold text-accent">{tx.read} →</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RSS Feed Section */}
      {rssPosts.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F6F4ED]">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-10"
            >
              <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold mb-2">{tx.rssTitle}</h2>
              <p className="text-sm text-muted-foreground">{tx.rssSub}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rssPosts.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-background rounded-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="h-44 overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = heroImg; }}
                      />
                    ) : (
                      <img src={heroImg} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-sm font-semibold">{item.category}</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                      <span className="ml-auto text-xs text-muted-foreground/60 italic">{item.source}</span>
                    </div>
                    <h3 className="font-serif text-base text-primary font-bold mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-3">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{item.excerpt}</p>
                    <span className="text-xs font-semibold text-accent">{tx.readMore}</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
