import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, Star, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { menuItems, fmt, BLOG_POSTS } from "@/lib/translations";
import type { Lang } from "@/lib/translations";
import { useSEO } from "@/hooks/useSEO";
import heroImg from "../assets/images/hero.png";
import hotpotImg from "../assets/images/hotpot.png";
import grilledChickenImg from "../assets/images/grilled_chicken.png";

const POST_IMAGES = [heroImg, hotpotImg, grilledChickenImg, hotpotImg];
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

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
    tagline: "Gà ta thả vườn chính gốc Diên Khánh",
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

  const allBestSellers = [
    ...menuItems.hotpot.filter((i) => i.isBestSeller),
    ...menuItems.grilled.filter((i) => i.isBestSeller),
  ];

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
          <img src={heroImg} alt="Gà nướng than hoa Gà Quê Diên Khánh tại Nha Trang" className="w-full h-full object-cover" />
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
    </div>
  );
}
