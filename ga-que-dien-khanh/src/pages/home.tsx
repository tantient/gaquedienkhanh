import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, Star, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { fmt, BLOG_POSTS } from "@/lib/translations";
import { useMenu } from "@/hooks/useMenu";
import type { Lang } from "@/lib/translations";
import { useSEO } from "@/hooks/useSEO";
import heroImg from "../assets/images/hero.png";
import hotpotImg from "../assets/images/hotpot.png";
import grilledChickenImg from "../assets/images/grilled_chicken.png";

const POST_IMAGES = [heroImg, hotpotImg, grilledChickenImg, hotpotImg];
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface RatingData {
  google_rating: number;
  google_count: number;
  show_tripadvisor: boolean;
  tripadvisor_rating: number;
  tripadvisor_count: number;
}

const BLOG_LABELS: Record<Lang, { sectionTitle: string; sectionSub: string; read: string; viewAll: string }> = {
  vi: { sectionTitle: "Bài Viết Mới Nhất", sectionSub: "Khám phá câu chuyện ẩm thực và bí quyết từ bếp quê", read: "Đọc bài viết", viewAll: "Xem Tất Cả Bài Viết" },
  en: { sectionTitle: "Latest from the Blog", sectionSub: "Culinary stories and tips straight from our kitchen", read: "Read article", viewAll: "View All Posts" },
  ko: { sectionTitle: "최신 블로그 글", sectionSub: "우리 주방에서 직접 전하는 요리 이야기와 팁", read: "글 읽기", viewAll: "모든 글 보기" },
  zh: { sectionTitle: "最新博客文章", sectionSub: "来自我们厨房的美食故事与小贴士", read: "阅读文章", viewAll: "查看全部文章" },
  ru: { sectionTitle: "Последние записи", sectionSub: "Кулинарные истории и советы прямо с нашей кухни", read: "Читать", viewAll: "Все записи" },
};

interface ApiPost { id: number; slug: string; date: string; category: string; title: string; excerpt: string; image: string; imageUrl?: string; }

const IMAGE_MAP: Record<string, string> = { hero: heroImg, hotpot: hotpotImg, grilled: grilledChickenImg };

const fadeIn = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const WELCOME: Record<string, { tagline: string; heading: string; sub: string; btn: string; scroll: string; bestSeller: string; halfLabel: string; wholeLabel: string; viewMenu: string }> = {
  vi: {
    tagline: "Mộc mạc gà quê - Đậm đà vị nhớ",
    heading: "Gà Quê Diên Khánh",
    sub: "Mời bạn đến với Gà Quê Diên Khánh — khám phá hương vị cơm quê Việt Nam, gà ta thả vườn, và lẩu lá é thơm nồng, trong một góc làng quê Khánh Hòa giữa lòng Nha Trang.",
    btn: "Khám Phá Thực Đơn",
    scroll: "Cuộn xuống",
    bestSeller: "Món Được Yêu Thích Nhất",
    halfLabel: "Nửa con",
    wholeLabel: "Nguyên con",
    viewMenu: "Xem Toàn Bộ Thực Đơn",
  },
  en: {
    tagline: "Best Free-Range Chicken in Nha Trang",
    heading: "Gà Quê Diên Khánh",
    sub: "Nha Trang's best free-range chicken restaurant — famous lemon-leaf hotpot, charcoal-grilled chicken & traditional Dien Khanh countryside flavors at 27 Tô Hiến Thành.",
    btn: "Explore Our Menu",
    scroll: "Scroll Down",
    bestSeller: "Our Best Sellers",
    halfLabel: "Half",
    wholeLabel: "Whole",
    viewMenu: "View Full Menu",
  },
  ko: {
    tagline: "나트랑 닭고기 맛집",
    heading: "가 께 디엔 칸",
    sub: "나트랑 최고의 닭고기 맛집 — 레몬잎 닭 훠궈와 숯불 구이 닭을 따뜻하고 소박한 공간에서 즐겨보세요. 27 Tô Hiến Thành.",
    btn: "메뉴 보기",
    scroll: "아래로",
    bestSeller: "베스트셀러",
    halfLabel: "반 마리",
    wholeLabel: "한 마리",
    viewMenu: "전체 메뉴 보기",
  },
  zh: {
    tagline: "芽庄最好的鸡肉火锅",
    heading: "嘉桂延庆",
    sub: "芽庄最佳鸡肉餐厅 — 品尝招牌芽庄鸡肉火锅与炭烤鸡，感受正宗越南乡村风味。地址：27 Tô Hiến Thành。",
    btn: "查看菜单",
    scroll: "向下滚动",
    bestSeller: "最受欢迎的菜",
    halfLabel: "半只",
    wholeLabel: "整只",
    viewMenu: "查看完整菜单",
  },
  ru: {
    tagline: "Деревенские вкусы",
    heading: "Га Ке Зиен Кхань",
    sub: "Насладитесь знаменитым куриным фондю с лимонными листьями и курицей на углях в тёплой обстановке Нячанга.",
    btn: "Посмотреть меню",
    scroll: "Вниз",
    bestSeller: "Самые популярные блюда",
    halfLabel: "Половина",
    wholeLabel: "Целая",
    viewMenu: "Посмотреть полное меню",
  },
};

const WELCOME_LANGS: { lang: string; text: string }[] = [
  { lang: "Tiếng Việt", text: "Chào mừng quý khách đến với Gà Quê Diên Khánh — quán gà ta thả vườn chính gốc Diên Khánh, nơi hương vị truyền thống gặp gỡ sự ấm áp của miền quê Khánh Hòa." },
  { lang: "English", text: "Welcome to Gà Quê Diên Khánh — Nha Trang's best free-range chicken restaurant, where traditional countryside flavors meet warm hospitality." },
  { lang: "한국어", text: "나트랑 닭고기 맛집 Gà Quê Diên Khánh에 오신 것을 환영합니다 — 전통의 맛과 시골의 따뜻함이 만나는 곳." },
  { lang: "中文", text: "欢迎来到芽庄鸡肉火锅餐厅 Gà Quê Diên Khánh — 体验正宗越南乡村风味，品尝最地道的炭烤鸡与草本鸡火锅。" },
];

const SEO_HOME: Record<string, { title: string; description: string }> = {
  vi: { title: "Gà Quê Diên Khánh | Lẩu Gà Lá É & Gà Nướng Than Hoa Nha Trang", description: "Gà Quê Diên Khánh – quán gà ta thả vườn chính gốc Diên Khánh ngon nhất Nha Trang. Lẩu gà lá é, lẩu gà lá giang, gà nướng muối ớt, gà sốt bơ tỏi. Quán ăn gia đình ấm cúng tại 27 Tô Hiến Thành. Đặt bàn: 0823 890 789." },
  en: { title: "Gà Quê Diên Khánh | Best Chicken Hotpot & Grilled Chicken Nha Trang", description: "Best free-range chicken restaurant in Nha Trang. Famous lemon-leaf chicken hotpot, grilled chicken with salt & chili, garlic butter chicken. Traditional Vietnamese countryside flavors at 27 Tô Hiến Thành. Book: 0823 890 789." },
  ko: { title: "가 께 디엔 칸 | 나트랑 닭고기 맛집 & 숯불 구이 치킨", description: "나트랑 최고의 닭고기 맛집 Gà Quê Diên Khánh. 레몬잎 닭 훠궈, 숯불 구이 닭, 소금 고추 구이. 27 Tô Hiến Thành 위치. 예약: 0823 890 789." },
  zh: { title: "Gà Quê Diên Khánh | 芽庄最好的鸡肉火锅餐厅", description: "芽庄最佳鸡肉餐厅 Gà Quê Diên Khánh。招牌菜：芽庄鸡肉火锅、炭烤鸡、黄油蒜香鸡。地址：27 Tô Hiến Thành，芽庄。预订：0823 890 789。" },
  ru: { title: "Gà Quê Diên Khánh | Лучший Куриный Ресторан в Нячанге", description: "Лучший ресторан домашней курицы в Нячанге. Знаменитое куриное фондю с лимонными листьями, курица-гриль на углях, курица в чесночном масле. 27 Tô Hiến Thành. Бронь: 0823 890 789." },
};

export default function Home() {
  const { lang } = useLang();
  const tx = WELCOME[lang] ?? WELCOME.vi;
  const seo = SEO_HOME[lang] ?? SEO_HOME.vi;
  useSEO({ title: seo.title, description: seo.description, canonical: "https://gaquedienkhanh.com/" });
  const bl = BLOG_LABELS[lang] ?? BLOG_LABELS.vi;
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 200]);
  const heroOp = useTransform(scrollY, [0, 400], [1, 0]);
  const { menu: menuItems } = useMenu();

  const allBestSellers = [
    ...menuItems.hotpot.filter((i) => i.isBestSeller),
    ...menuItems.grilled.filter((i) => i.isBestSeller),
  ];

  const [rating, setRating] = useState<RatingData>({ google_rating: 4.9, google_count: 17, show_tripadvisor: false, tripadvisor_rating: 4.5, tripadvisor_count: 1 });
  useEffect(() => {
    fetch(`${BASE}/api/rating`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: RatingData) => setRating(data))
      .catch(() => {});
  }, []);

  const [bannerUrl, setBannerUrl] = useState("");
  useEffect(() => {
    fetch(`${BASE}/api/banner`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: { banner_url: string }) => setBannerUrl(data.banner_url ?? ""))
      .catch(() => {});
  }, []);

  const [apiPosts, setApiPosts] = useState<ApiPost[] | null>(null);
  useEffect(() => {
    fetch(`${BASE}/api/blog`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: ApiPost[]) => setApiPosts(data))
      .catch(() => setApiPosts(null));
  }, []);

  const latestPosts = (apiPosts
    ? apiPosts.slice(0, 3).map((p, i) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        date: p.date,
        excerpt: p.excerpt,
        img: p.imageUrl ? p.imageUrl : (IMAGE_MAP[p.image] ?? POST_IMAGES[i % POST_IMAGES.length]),
      }))
    : BLOG_POSTS.slice(0, 3).map((p, i) => ({
        slug: p.id.toString(),
        title: p.title[lang as Lang] ?? p.title.vi,
        category: p.category[lang as Lang] ?? p.category.vi,
        date: p.date,
        excerpt: p.excerpt[lang as Lang] ?? p.excerpt.vi,
        img: POST_IMAGES[i % POST_IMAGES.length],
      })));

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOp }}>
          <div className="absolute inset-0 bg-black/45 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-50" />
          <img src={bannerUrl || heroImg} alt="Gà nướng than hoa Gà Quê Diên Khánh tại Nha Trang" className="w-full h-full object-cover" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            <p className="text-accent text-sm tracking-[0.35em] uppercase mb-5 font-semibold drop-shadow">{tx.tagline}</p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-6 drop-shadow-lg leading-tight">
              Gà Quê <span className="text-accent/95">Diên Khánh</span>
            </h1>
            <p className="text-white/85 text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">{tx.sub}</p>
            <Link href="/menu">
              <span className="inline-block bg-accent hover:bg-accent/85 text-white px-8 py-4 text-sm tracking-wider uppercase font-semibold cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1" data-testid="button-hero-menu">
                {tx.btn}
              </span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" })}
        >
          <span className="text-white/60 text-xs tracking-widest uppercase mb-2">{tx.scroll}</span>
          <motion.div animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
            <ChevronDown className="text-white/60" size={22} />
          </motion.div>
        </motion.div>
      </section>

      {/* Multilingual Welcome */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col gap-8"
          >
            {WELCOME_LANGS.map(({ lang: langLabel, text }) => (
              <motion.div key={langLabel} variants={fadeIn} className="text-center">
                <span className="text-accent text-xs tracking-[0.25em] uppercase font-bold block mb-3">{langLabel}</span>
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-primary-foreground/90">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 md:py-32 bg-[#F6F4ED]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star size={16} className="text-accent fill-accent" />
              <span className="text-accent text-sm tracking-widest uppercase font-semibold">{tx.bestSeller}</span>
              <Star size={16} className="text-accent fill-accent" />
            </div>
            <div className="w-16 h-0.5 bg-accent mx-auto opacity-60"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {allBestSellers.map((item, idx) => {
              const img = idx === 0 ? hotpotImg : grilledChickenImg;
              const name = item[lang] ?? item.vi;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.15 }}
                  className="group bg-background rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  data-testid={`card-bestseller-${idx}`}
                >
                  <div className="h-52 overflow-hidden">
                    <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-serif text-xl text-foreground font-semibold leading-snug group-hover:text-accent transition-colors">{name}</h3>
                      <span className="text-xs bg-accent/15 text-accent px-2 py-1 rounded-sm font-medium whitespace-nowrap flex-shrink-0 mt-0.5">
                        {tx.bestSeller.split(" ")[0]}
                      </span>
                    </div>
                    {item.vi !== name && (
                      <p className="text-sm text-muted-foreground italic mb-4">{item.vi}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.price.half && (
                        <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-sm">
                          {tx.halfLabel}: {fmt(item.price.half)}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-sm">
                        {tx.wholeLabel}: {fmt(item.price.whole)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/menu">
              <span className="inline-block border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-sm tracking-wider uppercase font-medium cursor-pointer transition-all duration-300" data-testid="link-view-full-menu">
                {tx.viewMenu}
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24 md:py-32 bg-primary">
        <div className="container mx-auto px-6 md:px-12">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-accent opacity-60" />
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold">{bl.sectionTitle}</span>
              <div className="h-px w-10 bg-accent opacity-60" />
            </div>
            <p className="text-primary-foreground/60 text-sm font-light">{bl.sectionSub}</p>
          </motion.div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {latestPosts.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                data-testid={`card-home-blog-${idx}`}
              >
                <Link href={`/blog/${post.slug}`}>
                  <span className="group block cursor-pointer h-full">
                    <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                      {/* Image */}
                      <div className="h-44 overflow-hidden flex-shrink-0">
                        <img
                          src={post.img}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-accent text-[10px] font-bold tracking-widest uppercase">{post.category}</span>
                          <span className="text-primary-foreground/35 text-[11px] font-light">{post.date}</span>
                        </div>
                        <h3 className="font-serif text-base text-primary-foreground font-semibold leading-snug mb-3 group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-primary-foreground/50 text-sm font-light leading-relaxed line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-1.5 mt-4 text-accent text-xs font-semibold tracking-wide uppercase">
                          {bl.read}
                          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View all button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/blog">
              <span
                className="inline-block border border-primary-foreground/30 text-primary-foreground/80 hover:border-accent hover:text-accent px-8 py-3 text-sm tracking-wider uppercase font-medium cursor-pointer transition-all duration-300"
                data-testid="link-view-all-blog"
              >
                {bl.viewAll}
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Review Ratings */}
      <section className="py-16 bg-[#F6F4ED]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-accent opacity-60" />
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold">
                {lang === "vi" ? "Đánh Giá" : lang === "en" ? "Reviews" : lang === "ko" ? "리뷰" : lang === "zh" ? "评价" : "Отзывы"}
              </span>
              <div className="h-px w-10 bg-accent opacity-60" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold">
              {lang === "vi" ? "Khách hàng nói gì về chúng tôi"
               : lang === "en" ? "What our guests say"
               : lang === "ko" ? "고객들의 평가"
               : lang === "zh" ? "顾客评价"
               : "Отзывы наших гостей"}
            </h2>
          </motion.div>

          <div className={`flex ${rating.show_tripadvisor ? "flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto" : "justify-center"}`}>
            {/* Google Maps */}
            <motion.a
              href="https://maps.app.goo.gl/z9vPkxyfrkMaFktu9"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-xs bg-white rounded-sm p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              data-testid="rating-google"
            >
              <div className="flex justify-center mb-4">
                <svg width="38" height="38" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-foreground mb-1">{rating.google_rating.toFixed(1)}</div>
              <div className="flex justify-center gap-1 my-2">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="18" height="18" viewBox="0 0 24 24"
                    fill={s <= Math.round(rating.google_rating) ? "#FBBC04" : "none"}
                    stroke="#FBBC04" strokeWidth="1.5" strokeLinejoin="round">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {rating.google_count} {lang === "vi" ? "đánh giá" : lang === "en" ? "reviews" : lang === "ko" ? "리뷰" : lang === "zh" ? "评价" : "отзывов"}
              </p>
              <p className="text-xs font-bold text-[#4285F4] tracking-widest uppercase mt-3">Google Maps</p>
            </motion.a>

            {/* TripAdvisor — chỉ hiện khi được bật trong admin */}
            {rating.show_tripadvisor && (
              <motion.a
                href="https://www.tripadvisor.com/Restaurant_Review-g293928-d34384120-Reviews-Ga_Que_Dien_Khanh-Nha_Trang_Khanh_Hoa_Province.html"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="flex-1 bg-white rounded-sm p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" className="text-[#00AA6C]">
                    <path d="M12.006 4.295c-2.67 0-5.338.553-7.482 1.662L3 6.56l1.342 1.234a5.518 5.518 0 00-1.8 4.048 5.527 5.527 0 005.526 5.526 5.499 5.499 0 003.808-1.526l.13.176.138-.176a5.499 5.499 0 003.807 1.526 5.527 5.527 0 005.526-5.526 5.52 5.52 0 00-1.8-4.048L21 6.559l-1.524-.603c-2.144-1.109-4.812-1.661-7.47-1.661zM8.068 9.457a3.316 3.316 0 110 6.632 3.316 3.316 0 010-6.632zm7.876 0a3.316 3.316 0 110 6.632 3.316 3.316 0 010-6.632zm-7.876 1.105a2.21 2.21 0 100 4.42 2.21 2.21 0 000-4.42zm7.876 0a2.21 2.21 0 100 4.42 2.21 2.21 0 000-4.42zm-7.876 1.104a1.105 1.105 0 110 2.21 1.105 1.105 0 010-2.21zm7.876 0a1.105 1.105 0 110 2.21 1.105 1.105 0 010-2.21z"/>
                  </svg>
                </div>
                <div className="text-4xl font-bold text-foreground mb-1">{rating.tripadvisor_rating.toFixed(1)}</div>
                <div className="flex justify-center gap-1.5 my-2">
                  {[1,2,3,4,5].map(s => (
                    <div key={s} className={`w-[18px] h-[18px] rounded-full border-2 border-[#00AA6C] ${s <= Math.round(rating.tripadvisor_rating) ? "bg-[#00AA6C]" : "bg-white"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {rating.tripadvisor_count} {lang === "vi" ? "đánh giá" : lang === "en" ? "reviews" : lang === "ko" ? "리뷰" : lang === "zh" ? "评价" : "отзывов"}
                </p>
                <p className="text-xs font-bold text-[#00AA6C] tracking-widest uppercase mt-3">Tripadvisor</p>
              </motion.a>
            )}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section style={{ backgroundColor: "#4A3427" }} className="py-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">
              {lang === "vi" ? "Theo dõi chúng tôi" : lang === "en" ? "Follow Us" : lang === "ko" ? "팔로우" : lang === "zh" ? "关注我们" : "Подписывайтесь"}
            </p>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">@gaquedienkhanh</h2>
            <p className="text-white/50 text-sm mb-10">
              {lang === "vi" ? "Cập nhật món mới, hình ảnh quán và ưu đãi mỗi ngày" : lang === "en" ? "Daily updates, food photos & special offers" : lang === "ko" ? "매일 새로운 메뉴, 사진 및 특가 소식" : lang === "zh" ? "每日更新菜品、照片和优惠" : "Ежедневные обновления, фото блюд и акции"}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                id: "tiktok",
                label: "TikTok",
                handle: "@gaquedienkhanh",
                url: "https://www.tiktok.com/@gaquedienkhanh",
                bg: "#010101",
                color: "#ffffff",
                delay: 0,
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                ),
              },
              {
                id: "facebook",
                label: "Facebook",
                handle: "Gà Quê Diên Khánh",
                url: "https://www.facebook.com/gaquedienkhanh/",
                bg: "#1877F2",
                color: "#ffffff",
                delay: 0.08,
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                ),
              },
              {
                id: "instagram",
                label: "Instagram",
                handle: "@gaquedienkhanh",
                url: "https://www.instagram.com/gaquedienkhanh/",
                bg: "#E1306C",
                color: "#ffffff",
                delay: 0.16,
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                ),
              },
              {
                id: "tripadvisor",
                label: "Tripadvisor",
                handle: "Gà Quê Diên Khánh",
                url: "https://www.tripadvisor.com/Restaurant_Review-g293928-d34384120-Reviews-Ga_Que_Dien_Khanh-Nha_Trang_Khanh_Hoa_Province.html",
                bg: "#00AA6C",
                color: "#ffffff",
                delay: 0.24,
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M12.006 4.295c-2.67 0-5.338.553-7.482 1.662L3 6.56l1.342 1.234a5.518 5.518 0 00-1.8 4.048 5.527 5.527 0 005.526 5.526 5.499 5.499 0 003.808-1.526l.13.176.138-.176a5.499 5.499 0 003.807 1.526 5.527 5.527 0 005.526-5.526 5.52 5.52 0 00-1.8-4.048L21 6.559l-1.524-.603c-2.144-1.109-4.812-1.661-7.47-1.661zM8.068 9.457a3.316 3.316 0 110 6.632 3.316 3.316 0 010-6.632zm7.876 0a3.316 3.316 0 110 6.632 3.316 3.316 0 010-6.632zm-7.876 1.105a2.21 2.21 0 100 4.42 2.21 2.21 0 000-4.42zm7.876 0a2.21 2.21 0 100 4.42 2.21 2.21 0 000-4.42zm-7.876 1.104a1.105 1.105 0 110 2.21 1.105 1.105 0 010-2.21zm7.876 0a1.105 1.105 0 110 2.21 1.105 1.105 0 010-2.21z"/>
                  </svg>
                ),
              },
            ].map((s) => (
              <motion.a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: s.delay }}
                whileHover={{ scale: 1.04 }}
                className="flex flex-col items-center gap-3 rounded-sm py-6 px-3 cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: s.bg, color: s.color }}
              >
                {s.icon}
                <div className="text-center">
                  <p className="font-bold text-sm">{s.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{s.handle}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
