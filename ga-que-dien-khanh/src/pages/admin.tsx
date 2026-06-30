import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, LogOut, Lock, CheckCircle, Image, Pencil, X, Star } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE}/api/blog`;
const AUTH_API = `${BASE}/api/auth`;
const RATING_API = `${BASE}/api/rating`;
const BANNER_API = `${BASE}/api/banner`;
const MENU_API = `${BASE}/api/menu`;

interface RatingData {
  google_rating: number;
  google_count: number;
  show_tripadvisor: boolean;
  tripadvisor_rating: number;
  tripadvisor_count: number;
}

const CATEGORIES = ["Ẩm Thực", "Nguyên Liệu", "Du Lịch", "Câu Chuyện", "Tin Tức", "Sự Kiện"];
const PRESET_IMAGES = [
  { value: "hero", label: "Ảnh gà nướng (hero)" },
  { value: "hotpot", label: "Ảnh lẩu (hotpot)" },
  { value: "grilled", label: "Ảnh gà nướng muối ớt" },
];

interface Post {
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

type FormState = {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  imageUrl: string;
  content: string;
};

function todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

const EMPTY_FORM: FormState = {
  title: "",
  date: todayStr(),
  category: "Ẩm Thực",
  excerpt: "",
  image: "hero",
  imageUrl: "",
  content: "",
};

function postToForm(p: Post): FormState {
  return {
    title: p.title,
    date: p.date,
    category: p.category,
    excerpt: p.excerpt,
    image: p.image,
    imageUrl: p.imageUrl ?? "",
    content: p.content ?? "",
  };
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [rating, setRating] = useState<RatingData>({ google_rating: 4.9, google_count: 17, show_tripadvisor: false, tripadvisor_rating: 4.5, tripadvisor_count: 1 });
  const [ratingSaving, setRatingSaving] = useState(false);
  const [ratingSaved, setRatingSaved] = useState(false);
  const [ratingError, setRatingError] = useState("");

  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerSaving, setBannerSaving] = useState(false);
  const [bannerSaved, setBannerSaved] = useState(false);
  const [bannerError, setBannerError] = useState("");

  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [menuUploading, setMenuUploading] = useState(false);
  const [menuUploaded, setMenuUploaded] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [menuPreview, setMenuPreview] = useState<{ category: string; count: number }[] | null>(null);
  const menuFileRef = useRef<HTMLInputElement>(null);

  function authHeader(tk: string) {
    return { Authorization: `Bearer ${tk}` };
  }

  async function fetchPosts(tk: string) {
    try {
      const res = await fetch(API, { headers: authHeader(tk) });
      if (!res.ok) return;
      setPosts(await res.json());
    } catch { /* ignore */ }
  }

  async function fetchRating() {
    try {
      const res = await fetch(RATING_API);
      if (res.ok) setRating(await res.json());
    } catch { /* ignore */ }
  }

  async function fetchBanner() {
    try {
      const res = await fetch(BANNER_API);
      if (res.ok) { const d = await res.json() as { banner_url: string }; setBannerUrl(d.banner_url ?? ""); }
    } catch { /* ignore */ }
  }

  async function saveBanner() {
    if (!token) return;
    setBannerError("");
    setBannerSaving(true);
    try {
      const res = await fetch(BANNER_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader(token) },
        body: JSON.stringify({ banner_url: bannerUrl }),
      });
      if (res.ok) {
        const d = await res.json() as { banner_url: string };
        setBannerUrl(d.banner_url);
        setBannerSaved(true);
        setTimeout(() => setBannerSaved(false), 3000);
      } else {
        setBannerError("Lỗi khi lưu banner");
      }
    } catch {
      setBannerError("Không thể kết nối server");
    }
    setBannerSaving(false);
  }

  async function uploadMenu() {
    if (!token || !menuFile) return;
    setMenuError("");
    setMenuUploading(true);
    setMenuPreview(null);
    try {
      const fd = new FormData();
      fd.append("file", menuFile);
      const res = await fetch(`${MENU_API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        const data = await res.json() as { ok: boolean; menu: Record<string, unknown[]> };
        const LABELS_MAP: Record<string, string> = {
          grilled: "Các Món Gà",
          hotpot: "Lẩu Gà",
          beef: "Các Món Bò",
          pork: "Các Món Heo",
          sides: "Món Ăn Kèm",
          rice: "Cơm & Mì",
          drinks: "Bia & Nước",
        };
        setMenuPreview(
          Object.entries(data.menu)
            .filter(([, arr]) => Array.isArray(arr))
            .map(([cat, arr]) => ({ category: LABELS_MAP[cat] ?? cat, count: (arr as unknown[]).length }))
        );
        setMenuFile(null);
        if (menuFileRef.current) menuFileRef.current.value = "";
        setMenuUploaded(true);
        setTimeout(() => setMenuUploaded(false), 4000);
      } else {
        const d = await res.json() as { error: string };
        setMenuError(d.error ?? "Lỗi khi upload file");
      }
    } catch {
      setMenuError("Không thể kết nối server");
    }
    setMenuUploading(false);
  }

  async function saveRating() {
    if (!token) return;
    setRatingError("");
    setRatingSaving(true);
    try {
      const res = await fetch(RATING_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader(token) },
        body: JSON.stringify(rating),
      });
      if (res.ok) {
        setRating(await res.json());
        setRatingSaved(true);
        setTimeout(() => setRatingSaved(false), 3000);
      } else {
        setRatingError("Lỗi khi lưu đánh giá");
      }
    } catch {
      setRatingError("Không thể kết nối server");
    }
    setRatingSaving(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch(AUTH_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const { token: tk } = await res.json() as { token: string };
        sessionStorage.setItem("admin_token", tk);
        setToken(tk);
        setPassword("");
        setAuthed(true);
        fetchPosts(tk);
        fetchRating();
        fetchBanner();
      } else {
        const d = await res.json() as { error: string };
        setAuthError(d.error ?? "Sai mật khẩu. Vui lòng thử lại.");
      }
    } catch {
      setAuthError("Không thể kết nối server. Vui lòng thử lại.");
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (!saved) return;
    fetch(AUTH_API, { headers: authHeader(saved) })
      .then((r) => {
        if (r.ok) {
          setToken(saved);
          setAuthed(true);
          fetchPosts(saved);
          fetchRating();
          fetchBanner();
        } else {
          sessionStorage.removeItem("admin_token");
        }
      })
      .catch(() => sessionStorage.removeItem("admin_token"));
  }, []);

  function handleNewPost() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, date: todayStr() });
    setError("");
    setSaved(false);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function handleEdit(post: Post) {
    setEditingId(post.id);
    setForm(postToForm(post));
    setError("");
    setSaved(false);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, date: todayStr() });
    setError("");
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!form.title || !form.excerpt) { setError("Vui lòng điền tiêu đề và tóm tắt"); return; }
    setError("");
    setSaving(true);

    const payload = {
      title: form.title,
      date: form.date,
      category: form.category,
      excerpt: form.excerpt,
      image: form.image,
      ...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
      ...(form.content.trim() ? { content: form.content.trim() } : {}),
    };

    const isEdit = editingId !== null;
    const res = await fetch(isEdit ? `${API}/${editingId}` : API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", ...authHeader(token) },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      const post = await res.json();
      if (isEdit) {
        setPosts((prev) => prev.map((p) => p.id === post.id ? post : p));
      } else {
        setPosts((prev) => [post, ...prev]);
      }
      setEditingId(null);
      setForm({ ...EMPTY_FORM, date: todayStr() });
      setShowForm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? "Lỗi khi lưu bài");
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!token || !confirm(`Xoá bài "${title}"?`)) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeader(token) });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) handleCancelEdit();
  }

  async function handleLogout() {
    if (token) {
      try { await fetch(AUTH_API, { method: "DELETE", headers: authHeader(token) }); } catch { /* ignore */ }
    }
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setAuthed(false);
    setPassword("");
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-sm p-10 w-full max-w-sm"
        >
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock size={22} className="text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-2xl text-center text-foreground mb-1">Quản Trị Blog</h1>
          <p className="text-muted-foreground text-sm text-center mb-8">Gà Quê Diên Khánh</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Mật khẩu quản trị"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors">
              Đăng nhập
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-6 md:px-10 py-10 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-3xl text-foreground font-bold">Quản Trị Blog</h1>
            <p className="text-muted-foreground text-sm mt-1">Gà Quê Diên Khánh — {posts.length} bài viết</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle size={16} /> Đã lưu!
              </motion.span>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={15} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Post List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground text-lg">Bài Viết Hiện Có</h2>
            <button onClick={handleNewPost}
              className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-sm text-sm font-semibold hover:bg-accent/85 transition-colors">
              <PlusCircle size={16} /> Thêm bài mới
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white border border-border/50 rounded-sm p-10 text-center text-muted-foreground text-sm">
              Chưa có bài viết nào. Bấm "Thêm bài mới" để bắt đầu.
            </div>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post.id}
                  className={`flex items-start justify-between gap-4 rounded-sm border px-5 py-4 transition-colors ${editingId === post.id ? "bg-amber-50 border-amber-300" : "bg-white border-border/50 hover:border-border"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{post.category}</span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs">{post.date}</span>
                      {post.content && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Có nội dung</span>}
                      {post.imageUrl && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">URL ảnh</span>}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button onClick={() => editingId === post.id ? handleCancelEdit() : handleEdit(post)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${editingId === post.id ? "bg-amber-100 text-amber-600 hover:bg-amber-200" : "bg-muted text-muted-foreground hover:text-primary hover:bg-muted/80"}`}
                      title={editingId === post.id ? "Huỷ chỉnh sửa" : "Chỉnh sửa"}>
                      {editingId === post.id ? <><X size={13} /> Huỷ</> : <><Pencil size={13} /> Sửa</>}
                    </button>
                    <button onClick={() => handleDelete(post.id, post.title)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded" title="Xoá bài">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <motion.div ref={formRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-sm shadow-sm border p-8 transition-colors ${editingId ? "bg-amber-50 border-amber-200" : "bg-white border-border/50"}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                {editingId
                  ? <><Pencil size={18} className="text-amber-500" /> Chỉnh Sửa Bài Viết</>
                  : <><PlusCircle size={18} className="text-accent" /> Thêm Bài Viết Mới</>}
              </h2>
              <button onClick={handleCancelEdit} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} /> Đóng
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Tiêu đề *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Ngày đăng *</label>
                  <input type="text" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    placeholder="dd/mm/yyyy"
                    className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Danh mục *</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Ảnh preset</label>
                  <select value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white">
                    {PRESET_IMAGES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Image size={12} /> URL ảnh tùy chỉnh <span className="font-normal normal-case tracking-normal">(ghi đè ảnh preset nếu điền)</span>
                </label>
                <input type="url" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://example.com/anh-bai-viet.jpg"
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                {form.imageUrl.trim() && (
                  <div className="mt-2 rounded-sm overflow-hidden border border-border h-32">
                    <img src={form.imageUrl.trim()} alt="Xem trước" className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Tóm tắt *</label>
                <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Viết tóm tắt ngắn gọn (2–4 câu) để hiển thị trong danh sách blog..."
                  rows={3} className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Nội dung đầy đủ <span className="font-normal normal-case tracking-normal">(hiển thị ở trang chi tiết)</span>
                </label>
                <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Viết toàn bộ nội dung bài viết tại đây. Copy-paste thoải mái. Xuống dòng được giữ nguyên..."
                  rows={14} className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary resize-y font-mono leading-relaxed" />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex items-center gap-4">
                <button type="submit" disabled={saving}
                  className={`px-8 py-3 rounded-sm text-sm font-semibold transition-colors disabled:opacity-60 text-white ${editingId ? "bg-amber-500 hover:bg-amber-500/85" : "bg-accent hover:bg-accent/85"}`}>
                  {saving ? "Đang lưu..." : editingId ? "Lưu Thay Đổi" : "Đăng Bài"}
                </button>
                <button type="button" onClick={handleCancelEdit}
                  className="px-6 py-3 rounded-sm text-sm font-semibold border border-border hover:border-foreground transition-colors text-foreground">
                  Huỷ
                </button>
              </div>
            </form>
          </motion.div>
        )}

      {/* Banner Management */}
      <div className="mb-10 bg-white border border-border/50 rounded-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-foreground text-lg flex items-center gap-2">
            <Image size={18} className="text-accent" /> Ảnh Banner Trang Chủ
          </h2>
          {bannerSaved && (
            <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle size={16} /> Đã lưu!
            </motion.span>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            URL ảnh banner
          </label>
          <input
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://lh3.googleusercontent.com/d/FILE_ID_CỦA_BẠN"
            className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Để trống sẽ dùng ảnh mặc định. Dùng link Google Drive dạng: <span className="font-mono bg-muted px-1 rounded">https://lh3.googleusercontent.com/d/FILE_ID</span>
          </p>
        </div>

        {bannerUrl.trim() && (
          <div className="mb-5 rounded-sm overflow-hidden border border-border h-48 bg-muted">
            <img
              src={bannerUrl.trim()}
              alt="Xem trước banner"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        {bannerUrl.trim() && (
          <button
            type="button"
            onClick={() => setBannerUrl("")}
            className="mb-4 text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <X size={12} /> Xoá banner (dùng ảnh mặc định)
          </button>
        )}

        {bannerError && <p className="text-red-500 text-sm mb-3">{bannerError}</p>}
        <button onClick={saveBanner} disabled={bannerSaving}
          className="px-8 py-3 rounded-sm text-sm font-semibold bg-accent text-white hover:bg-accent/85 transition-colors disabled:opacity-60">
          {bannerSaving ? "Đang lưu..." : "Lưu Banner"}
        </button>
      </div>

      {/* Rating Management */}
      <div className="mb-10 bg-white border border-border/50 rounded-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-foreground text-lg flex items-center gap-2">
            <Star size={18} className="text-amber-400" /> Đánh Giá Google Maps
          </h2>
          <div className="flex items-center gap-3">
            {ratingSaved && (
              <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle size={16} /> Đã lưu!
              </motion.span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Điểm Google Maps (vd: 4.9)
            </label>
            <input
              type="number" step="0.1" min="1" max="5"
              value={rating.google_rating}
              onChange={(e) => setRating((r) => ({ ...r, google_rating: parseFloat(e.target.value) || r.google_rating }))}
              className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Số lượng đánh giá Google
            </label>
            <input
              type="number" min="0"
              value={rating.google_count}
              onChange={(e) => setRating((r) => ({ ...r, google_count: parseInt(e.target.value) || r.google_count }))}
              className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="border-t border-border/40 pt-5 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox" id="show_tripadvisor"
              checked={rating.show_tripadvisor}
              onChange={(e) => setRating((r) => ({ ...r, show_tripadvisor: e.target.checked }))}
              className="w-4 h-4 accent-amber-500"
            />
            <label htmlFor="show_tripadvisor" className="text-sm font-medium text-foreground cursor-pointer">
              Hiện card TripAdvisor trên trang chủ
            </label>
          </div>
          {rating.show_tripadvisor && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Điểm TripAdvisor (vd: 4.5)
                </label>
                <input
                  type="number" step="0.5" min="1" max="5"
                  value={rating.tripadvisor_rating}
                  onChange={(e) => setRating((r) => ({ ...r, tripadvisor_rating: parseFloat(e.target.value) || r.tripadvisor_rating }))}
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Số lượng đánh giá TripAdvisor
                </label>
                <input
                  type="number" min="0"
                  value={rating.tripadvisor_count}
                  onChange={(e) => setRating((r) => ({ ...r, tripadvisor_count: parseInt(e.target.value) || r.tripadvisor_count }))}
                  className="w-full border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>

        {ratingError && <p className="text-red-500 text-sm mb-3">{ratingError}</p>}
        <button onClick={saveRating} disabled={ratingSaving}
          className="px-8 py-3 rounded-sm text-sm font-semibold bg-accent text-white hover:bg-accent/85 transition-colors disabled:opacity-60">
          {ratingSaving ? "Đang lưu..." : "Lưu Đánh Giá"}
        </button>
      </div>

      {/* Menu Upload */}
      <div className="bg-white rounded-sm shadow-sm border border-border/50 p-8 mt-6">
        <h2 className="font-semibold text-lg text-foreground mb-1 flex items-center gap-2">
          📄 Cập Nhật Thực Đơn từ File Word
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Upload file <code className="bg-muted px-1 py-0.5 rounded text-xs">.docx</code> để cập nhật thực đơn trên website. Hệ thống tự động phân tích tên món, giá và phân loại theo danh mục.
        </p>

        <div className="border-2 border-dashed border-border rounded-sm p-6 text-center mb-5 hover:border-primary/50 transition-colors">
          <input
            ref={menuFileRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            id="menu-file-input"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setMenuFile(f);
              setMenuError("");
              setMenuPreview(null);
            }}
          />
          <label htmlFor="menu-file-input" className="cursor-pointer">
            {menuFile ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">📝</span>
                <div className="text-left">
                  <p className="font-medium text-foreground text-sm">{menuFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(menuFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setMenuFile(null); if (menuFileRef.current) menuFileRef.current.value = ""; }}
                  className="ml-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-2">📂</p>
                <p className="text-sm font-medium text-foreground">Chọn file Word (.docx)</p>
                <p className="text-xs text-muted-foreground mt-1">hoặc kéo thả vào đây</p>
              </div>
            )}
          </label>
        </div>

        {menuError && <p className="text-red-500 text-sm mb-4">{menuError}</p>}

        {menuUploaded && menuPreview && (
          <div className="bg-green-50 border border-green-200 rounded-sm p-4 mb-4">
            <p className="text-green-700 font-semibold text-sm flex items-center gap-2 mb-3">
              <CheckCircle size={16} /> Cập nhật thực đơn thành công!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {menuPreview.map((p) => (
                <div key={p.category} className="bg-white rounded border border-green-100 px-3 py-2 text-xs">
                  <p className="font-medium text-foreground">{p.category}</p>
                  <p className="text-muted-foreground">{p.count} món</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={uploadMenu}
          disabled={!menuFile || menuUploading}
          className="px-8 py-3 rounded-sm text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/85 transition-colors disabled:opacity-50"
        >
          {menuUploading ? "Đang xử lý..." : "Upload & Cập Nhật Thực Đơn"}
        </button>

        <p className="text-xs text-muted-foreground mt-3">
          ⚠️ Lưu ý: Chỉ các danh mục có dữ liệu mới trong file sẽ được cập nhật. Danh mục không có trong file sẽ giữ nguyên.
        </p>
      </div>

      </div>
    </div>
  );
}
