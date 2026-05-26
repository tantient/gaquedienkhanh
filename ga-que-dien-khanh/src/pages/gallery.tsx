import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import type { Lang } from "@/lib/translations";
import heroImg from "../assets/images/hero.png";
import { Instagram } from "lucide-react";

const LABELS: Record<Lang, {
  breadcrumb: string;
  heroTitle: string;
  heroSub: string;
  instagramTitle: string;
  instagramSub: string;
  followUs: string;
  noWidget: string;
}> = {
  vi: {
    breadcrumb: "Hình Ảnh",
    heroTitle: "Gallery",
    heroSub: "Những khoảnh khắc tươi ngon từ bếp quê Diên Khánh — cập nhật liên tục từ Instagram của quán.",
    instagramTitle: "Instagram của chúng tôi",
    instagramSub: "Theo dõi @gaquedienkhanh để không bỏ lỡ món ngon mới!",
    followUs: "Theo dõi trên Instagram",
    noWidget: "Đang tải hình ảnh từ Instagram...",
  },
  en: {
    breadcrumb: "Gallery",
    heroTitle: "Gallery",
    heroSub: "Fresh moments from Dien Khanh's countryside kitchen — updated live from our Instagram.",
    instagramTitle: "Our Instagram",
    instagramSub: "Follow @gaquedienkhanh for the latest dishes!",
    followUs: "Follow on Instagram",
    noWidget: "Loading images from Instagram...",
  },
  ko: {
    breadcrumb: "갤러리",
    heroTitle: "갤러리",
    heroSub: "디엔 칸 시골 주방의 신선한 순간들 — 인스타그램에서 실시간 업데이트.",
    instagramTitle: "인스타그램",
    instagramSub: "@gaquedienkhanh를 팔로우하세요!",
    followUs: "인스타그램 팔로우",
    noWidget: "인스타그램에서 이미지 로딩 중...",
  },
  zh: {
    breadcrumb: "相册",
    heroTitle: "相册",
    heroSub: "来自延庆乡村厨房的新鲜瞬间 — 通过Instagram实时更新。",
    instagramTitle: "我们的Instagram",
    instagramSub: "关注 @gaquedienkhanh 获取最新美食！",
    followUs: "在Instagram上关注我们",
    noWidget: "正在从Instagram加载图片...",
  },
  ru: {
    breadcrumb: "Галерея",
    heroTitle: "Галерея",
    heroSub: "Свежие моменты из деревенской кухни Зиен Кхань — обновляется в реальном времени из Instagram.",
    instagramTitle: "Наш Instagram",
    instagramSub: "Подпишитесь на @gaquedienkhanh!",
    followUs: "Подписаться в Instagram",
    noWidget: "Загрузка изображений из Instagram...",
  },
};

const SEO_GALLERY: Record<string, { title: string; description: string }> = {
  vi: { title: "Hình Ảnh | Gà Quê Diên Khánh – Gallery Instagram", description: "Xem những hình ảnh mới nhất từ Gà Quê Diên Khánh — gà nướng, lẩu gà và không gian quán tại Nha Trang." },
  en: { title: "Gallery | Gà Quê Diên Khánh – Instagram Feed", description: "Browse the latest photos from Gà Quê Diên Khánh — grilled chicken, hotpot and restaurant ambiance in Nha Trang." },
  ko: { title: "갤러리 | Gà Quê Diên Khánh – 인스타그램", description: "Gà Quê Diên Khánh의 최신 사진을 보세요." },
  zh: { title: "相册 | Gà Quê Diên Khánh – Instagram", description: "浏览 Gà Quê Diên Khánh 的最新照片。" },
  ru: { title: "Галерея | Gà Quê Diên Khánh – Instagram", description: "Просматривайте последние фото из Gà Quê Diên Khánh." },
};

const BEHOLD_FEED_ID = "NhC4uW6eW0jE9L9xvIjV";

export default function Gallery() {
  const { lang } = useLang();
  const tx = LABELS[lang] ?? LABELS.vi;
  const seo = SEO_GALLERY[lang] ?? SEO_GALLERY.vi;
  useSEO({ title: seo.title, description: seo.description, canonical: "https://gaquedienkhanh.com/gallery" });

  const beholdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = beholdRef.current;
    if (!container) return;

    const div = document.createElement("div");
    div.setAttribute("data-behold-id", BEHOLD_FEED_ID);
    container.appendChild(div);

    if (!document.querySelector('script[src="https://w.behold.so/widget.js"]')) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = "https://w.behold.so/widget.js";
      document.head.appendChild(s);
    } else {
      div.dispatchEvent(new Event("behold:refresh"));
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Hero */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <img src={heroImg} alt="Gallery" className="w-full h-full object-cover object-bottom" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold">{tx.breadcrumb}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">{tx.heroTitle}</h1>
            <p className="text-white/75 text-base mt-4 max-w-xl font-light">{tx.heroSub}</p>
          </motion.div>
        </div>
      </div>

      {/* Instagram feed section */}
      <section className="py-16 md:py-24 bg-[#F6F4ED]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Instagram size={22} className="text-accent" />
              <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold">{tx.instagramTitle}</h2>
            </div>
            <p className="text-muted-foreground">{tx.instagramSub}</p>
          </motion.div>

          {/* Behold widget — container managed imperatively to avoid React reconciler conflicts */}
          <div ref={beholdRef} />

          {/* Follow CTA */}
          <div className="text-center mt-10">
            <a
              href="https://www.instagram.com/gaquedienkhanh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-accent text-accent px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Instagram size={16} />
              {tx.followUs}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
