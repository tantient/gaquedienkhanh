import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { useBanner } from "@/hooks/useBanner";
import { fmt } from "@/lib/translations";
import type { Lang } from "@/lib/translations";
import { useMenu } from "@/hooks/useMenu";
import heroImg from "../assets/images/hero.png";
import hotpotImg from "../assets/images/hotpot.png";
import grilledChickenImg from "../assets/images/grilled_chicken.png";

import imgLauLaE from "../assets/images/lau-ga-la-e.webp";
import imgLauLaGiang from "../assets/images/lau-ga-la-giang.webp";
import imgNuongLaQue from "../assets/images/ga-nuong-la-que.webp";
import imgNuongMuoiOt from "../assets/images/ga-nuong-muoi-ot.webp";
import imgHapHanh from "../assets/images/ga-hap-hanh.webp";
import imgSotBoToi from "../assets/images/ga-sot-bo-toi.webp";
import imgBoXoi from "../assets/images/ga-bo-xoi.webp";
import imgLongGaBoXoi from "../assets/images/long-ga-bo-xoi.webp";
import imgLongGaXaoMuop from "../assets/images/long-ga-xao-muop.webp";
import imgComChienMuoiE from "../assets/images/com-chien-muoi-e.webp";
import imgComChienTrung from "../assets/images/com-chien-trung.webp";
import imgMiXaoThitBo from "../assets/images/mi-xao-thit-bo.webp";
import imgKhoaiTayChien from "../assets/images/khoai-tay-chien.webp";

const DISH_IMAGES: Record<string, string> = {
  "Lẩu gà ta lá é": imgLauLaE,
  "Lẩu gà ta lá giang": imgLauLaGiang,
  "Gà ta nướng lá chuối": imgNuongLaQue,
  "Gà ta nướng muối ớt": imgNuongMuoiOt,
  "Gà ta hấp hành": imgHapHanh,
  "Gà ta sốt bơ tỏi": imgSotBoToi,
  "Gà ta bó xôi": imgBoXoi,
  "Lòng gà bó xôi": imgLongGaBoXoi,
  "Lòng gà xào mướp": imgLongGaXaoMuop,
  "Cơm chiên muối é": imgComChienMuoiE,
  "Cơm chiên trứng": imgComChienTrung,
  "Mì xào thịt bò": imgMiXaoThitBo,
  "Khoai tây chiên": imgKhoaiTayChien,
};

const MENU_PAGES: { src: string; alt: string; caption: Record<Lang, string> }[] = [
  {
    src: "/menu-pages/page-00.jpg",
    alt: "Bìa menu - Gà Quê Diên Khánh",
    caption: { vi: "Bìa Menu", en: "Menu Cover", ko: "메뉴 표지", zh: "菜单封面", ru: "Обложка меню" },
  },
  {
    src: "/menu-pages/page-01.jpg",
    alt: "Các Món Gà",
    caption: { vi: "Các Món Gà", en: "Chicken Dishes", ko: "닭고기 요리", zh: "鸡肉料理", ru: "Блюда из курицы" },
  },
  {
    src: "/menu-pages/page-02.jpg",
    alt: "Lẩu Gà (Lá É)",
    caption: { vi: "Lẩu Gà (Lá É)", en: "Chicken Hotpot (Basil)", ko: "닭 샤부샤부 (바질)", zh: "鸡肉火锅（罗勒）", ru: "Куриный фондю (базилик)" },
  },
  {
    src: "/menu-pages/page-03.jpg",
    alt: "Lẩu Gà (Lá Giang)",
    caption: { vi: "Lẩu Gà (Lá Giang)", en: "Chicken Hotpot (Roselle)", ko: "닭 샤부샤부 (로젤)", zh: "鸡肉火锅（洛神）", ru: "Куриный фондю (розелла)" },
  },
  {
    src: "/menu-pages/page-04.jpg",
    alt: "Các Món Bò",
    caption: { vi: "Các Món Bò", en: "Beef Dishes", ko: "소고기 요리", zh: "牛肉料理", ru: "Блюда из говядины" },
  },
  {
    src: "/menu-pages/page-05.jpg",
    alt: "Các Món Heo (1)",
    caption: { vi: "Các Món Heo (1)", en: "Pork Dishes (1)", ko: "돼지고기 요리 (1)", zh: "猪肉料理（1）", ru: "Блюда из свинины (1)" },
  },
  {
    src: "/menu-pages/page-06.jpg",
    alt: "Các Món Heo (2)",
    caption: { vi: "Các Món Heo (2)", en: "Pork Dishes (2)", ko: "돼지고기 요리 (2)", zh: "猪肉料理（2）", ru: "Блюда из свинины (2)" },
  },
  {
    src: "/menu-pages/page-07.jpg",
    alt: "Gỏi & Salad",
    caption: { vi: "Gỏi & Salad", en: "Salads", ko: "샐러드", zh: "沙拉", ru: "Салаты" },
  },
  {
    src: "/menu-pages/page-08.jpg",
    alt: "Các Món Mực (1)",
    caption: { vi: "Các Món Mực (1)", en: "Squid Dishes (1)", ko: "오징어 요리 (1)", zh: "鱿鱼料理（1）", ru: "Блюда из кальмара (1)" },
  },
  {
    src: "/menu-pages/page-09.jpg",
    alt: "Các Món Mực (2)",
    caption: { vi: "Các Món Mực (2)", en: "Squid Dishes (2)", ko: "오징어 요리 (2)", zh: "鱿鱼料理（2）", ru: "Блюда из кальмара (2)" },
  },
  {
    src: "/menu-pages/page-10.jpg",
    alt: "Các Món Tôm (1)",
    caption: { vi: "Các Món Tôm (1)", en: "Shrimp Dishes (1)", ko: "새우 요리 (1)", zh: "虾类料理（1）", ru: "Блюда из креветок (1)" },
  },
  {
    src: "/menu-pages/page-11.jpg",
    alt: "Các Món Tôm (2)",
    caption: { vi: "Các Món Tôm (2)", en: "Shrimp Dishes (2)", ko: "새우 요리 (2)", zh: "虾类料理（2）", ru: "Блюда из креветок (2)" },
  },
  {
    src: "/menu-pages/page-12.jpg",
    alt: "Lòng Gà",
    caption: { vi: "Lòng Gà", en: "Chicken Offal", ko: "닭 내장 요리", zh: "鸡杂料理", ru: "Блюда из потрохов" },
  },
  {
    src: "/menu-pages/page-13.jpg",
    alt: "Cơm & Khoai",
    caption: { vi: "Cơm & Khoai", en: "Rice & Fries", ko: "밥 & 튀김", zh: "炒饭 & 薯条", ru: "Рис & Картофель" },
  },
  {
    src: "/menu-pages/page-14.jpg",
    alt: "Bia & Nước Giải Khát",
    caption: { vi: "Bia & Nước Uống", en: "Beer & Drinks", ko: "맥주 & 음료", zh: "啤酒 & 饮料", ru: "Пиво & Напитки" },
  },
  {
    src: "/menu-pages/page-15.jpg",
    alt: "Thông tin & QR Code",
    caption: { vi: "Thông Tin & QR", en: "Info & QR Code", ko: "정보 & QR 코드", zh: "信息 & 二维码", ru: "Информация & QR" },
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const LABELS: Record<Lang, {
  breadcrumb: string; heroTitle: string; heroSub: string;
  grilled: string; hotpot: string; beef: string; pork: string;
  squid: string; shrimp: string; offal: string;
  sides: string; rice: string; drinks: string;
  half: string; whole: string; perPlate: string; note: string;
  tabDigital: string; tabPhotos: string;
}> = {
  vi: {
    breadcrumb: "Thực Đơn",
    heroTitle: "Thực Đơn",
    heroSub: "Từ lẩu gà lá é đặc sản đến gà thả vườn nướng lá chuối thơm lừng — chúng tôi phục vụ trọn vẹn hương vị đồng quê Diên Khánh.",
    grilled: "Các Món Gà",
    hotpot: "Lẩu Gà",
    beef: "Các Món Bò",
    pork: "Các Món Heo",
    squid: "Các Món Mực",
    shrimp: "Các Món Tôm",
    offal: "Lòng Gà",
    sides: "Gỏi & Salad",
    rice: "Cơm & Khoai",
    drinks: "Bia & Nước Giải Khát",
    half: "Nửa con",
    whole: "Nguyên con",
    perPlate: "đĩa",
    note: "Giá đã bao gồm thuế. Vui lòng thông báo nhân viên nếu có yêu cầu đặc biệt về dị ứng thực phẩm.",
    tabDigital: "Thực Đơn", tabPhotos: "Ảnh Menu In",
  },
  en: {
    breadcrumb: "Menu",
    heroTitle: "Our Menu",
    heroSub: "From specialty basil-leaf chicken hotpot to fragrant banana-leaf grilled chicken — the full taste of the Vietnamese countryside.",
    grilled: "Chicken Dishes",
    hotpot: "Chicken Hotpot",
    beef: "Beef Dishes",
    pork: "Pork Dishes",
    squid: "Squid Dishes",
    shrimp: "Shrimp Dishes",
    offal: "Chicken Offal",
    sides: "Salads",
    rice: "Rice & Fries",
    drinks: "Beer & Beverages",
    half: "Half",
    whole: "Whole",
    perPlate: "plate",
    note: "Prices include tax. Please inform staff of any food allergies or special dietary requirements.",
    tabDigital: "Digital Menu", tabPhotos: "Menu Photos",
  },
  ko: {
    breadcrumb: "메뉴",
    heroTitle: "메뉴",
    heroSub: "바질잎 닭 샤부샤부 전문점부터 바나나잎 구운 닭까지 — 베트남 시골의 완전한 맛.",
    grilled: "닭고기 요리",
    hotpot: "닭 샤부샤부",
    beef: "소고기 요리",
    pork: "돼지고기 요리",
    squid: "오징어 요리",
    shrimp: "새우 요리",
    offal: "닭 내장 요리",
    sides: "샐러드",
    rice: "밥 & 튀김",
    drinks: "맥주 & 음료",
    half: "반 마리",
    whole: "한 마리",
    perPlate: "접시",
    note: "가격에는 세금이 포함되어 있습니다. 음식 알레르기나 특별한 식이 요건이 있으시면 직원에게 알려주세요.",
    tabDigital: "디지털 메뉴", tabPhotos: "메뉴 사진",
  },
  zh: {
    breadcrumb: "菜单",
    heroTitle: "菜单",
    heroSub: "从特色罗勒叶鸡肉火锅到香气四溢的香蕉叶烤鸡 — 越南乡村风味的完整呈现。",
    grilled: "鸡肉料理",
    hotpot: "鸡肉火锅",
    beef: "牛肉料理",
    pork: "猪肉料理",
    squid: "鱿鱼料理",
    shrimp: "虾类料理",
    offal: "鸡杂料理",
    sides: "沙拉",
    rice: "炒饭 & 薯条",
    drinks: "啤酒 & 饮料",
    half: "半只",
    whole: "整只",
    perPlate: "盘",
    note: "价格含税。如有食物过敏或特殊饮食要求，请通知工作人员。",
    tabDigital: "数字菜单", tabPhotos: "菜单图片",
  },
  ru: {
    breadcrumb: "Меню",
    heroTitle: "Наше меню",
    heroSub: "От фирменного куриного фондю с базиликом до ароматной курицы в листьях банана — весь вкус вьетнамской деревни.",
    grilled: "Блюда из курицы",
    hotpot: "Куриный фондю",
    beef: "Блюда из говядины",
    pork: "Блюда из свинины",
    squid: "Блюда из кальмара",
    shrimp: "Блюда из креветок",
    offal: "Блюда из потрохов",
    sides: "Салаты",
    rice: "Рис & Картофель",
    drinks: "Пиво & Напитки",
    half: "Половина",
    whole: "Целая",
    perPlate: "порция",
    note: "Цены включают налог. Пожалуйста, сообщите персоналу о пищевых аллергиях или особых пожеланиях.",
    tabDigital: "Цифровое меню", tabPhotos: "Фото меню",
  },
};

function SectionHeading({ label, icon }: { label: string; icon?: string }) {
  return (
    <div className="flex items-center gap-4 mb-7">
      {icon && <span className="text-2xl">{icon}</span>}
      <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold">{label}</h2>
      <span className="h-px flex-1 bg-border/70" />
    </div>
  );
}

const SEO_MENU: Record<string, { title: string; description: string }> = {
  vi: { title: "Thực Đơn | Gà Quê Diên Khánh – Lẩu Gà, Gà Nướng, Món Quê", description: "Xem thực đơn đầy đủ của Gà Quê Diên Khánh: lẩu gà lá é, gà nướng than hoa, gà hấp muối ớt và các món ăn kèm dân dã tại Nha Trang." },
  en: { title: "Menu | Gà Quê Diên Khánh – Chicken Hotpot, Grilled & More", description: "Full menu of Gà Quê Diên Khánh: herbal chicken hotpot, charcoal-grilled chicken, steamed chicken and traditional Vietnamese sides in Nha Trang." },
  ko: { title: "메뉴 | Gà Quê Diên Khánh – 훠궈, 구이 & 더", description: "Gà Quê Diên Khánh의 전체 메뉴: 허브 치킨 훠궈, 숯불 구이 치킨, 찜 치킨 및 나트랑의 전통 베트남 사이드 요리." },
  zh: { title: "菜单 | Gà Quê Diên Khánh – 鸡火锅、烤鸡及更多", description: "查看Gà Quê Diên Khánh的完整菜单：草本鸡火锅、炭烤鸡、盐蒸鸡以及芽庄的传统越南配菜。" },
  ru: { title: "Меню | Gà Quê Diên Khánh – Куриное Фондю, Гриль и Больше", description: "Полное меню Gà Quê Diên Khánh: куриное фондю с травами, курица на углях, паровая курица и традиционные вьетнамские гарниры в Нячанге." },
};

export default function Menu() {
  const { lang } = useLang();
  const tx = LABELS[lang] ?? LABELS.vi;
  const seo = SEO_MENU[lang] ?? SEO_MENU.vi;
  useSEO({ title: seo.title, description: seo.description, canonical: "https://gaquedienkhanh.com/menu" });
  const bannerUrl = useBanner();
  const { menu: menuItems } = useMenu();

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const [menuView, setMenuView] = useState<"digital" | "photos">("digital");

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lightbox, closeLightbox]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Page Hero */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <img src={bannerUrl || heroImg} alt="Thực đơn nhà hàng Gà Quê Diên Khánh Nha Trang" className="w-full h-full object-cover object-bottom" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold">{tx.breadcrumb}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">{tx.heroTitle}</h1>
            <p className="text-white/75 text-base mt-4 max-w-xl font-light">{tx.heroSub}</p>
          </motion.div>
        </div>
      </div>

      {/* Menu body */}
      <section className="py-16 md:py-24 bg-[#F6F4ED]">
        <div className="container mx-auto px-6 md:px-12">

          {/* View tab switcher */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-background rounded-full border border-border/60 p-1 gap-1 shadow-sm">
              <button
                onClick={() => setMenuView("digital")}
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${menuView === "digital" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span>📋</span> {tx.tabDigital}
              </button>
              <button
                onClick={() => setMenuView("photos")}
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${menuView === "photos" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span>📷</span> {tx.tabPhotos}
              </button>
            </div>
          </div>

          {/* Photo menu gallery */}
          {menuView === "photos" && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pb-8"
            >
              {MENU_PAGES.map((page, i) => (
                <motion.button
                  key={i}
                  variants={fadeIn}
                  type="button"
                  onClick={() => setLightbox({ src: page.src, alt: page.alt })}
                  className="group cursor-zoom-in rounded-sm border border-border/40 bg-background hover:border-primary/60 hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                  <div className="overflow-hidden">
                    <img
                      src={page.src}
                      alt={page.alt}
                      loading="lazy"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs text-center py-1.5 px-2 text-muted-foreground font-medium leading-tight">
                    {page.caption[lang]}
                  </p>
                </motion.button>
              ))}
            </motion.div>
          )}

          {menuView === "digital" && (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left: food items */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="lg:w-[58%] space-y-12">

              {/* 01. Các Món Gà */}
              <motion.div variants={fadeIn} data-testid="section-grilled">
                <SectionHeading label={tx.grilled} />
                <div className="space-y-4">
                  {menuItems.grilled.map((item, i) => (
                    <div key={i} className="bg-background rounded-sm overflow-hidden hover:shadow-sm transition-shadow flex gap-0" data-testid={`menu-grilled-${i}`}>
                      {DISH_IMAGES[item.vi] && (
                        <button type="button" onClick={() => setLightbox({ src: DISH_IMAGES[item.vi], alt: item.vi })} className="w-28 flex-shrink-0 cursor-zoom-in overflow-hidden">
                          <img src={DISH_IMAGES[item.vi]} alt={item.vi} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </button>
                      )}
                      <div className="p-5 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="font-semibold text-foreground text-lg leading-snug">{item[lang]}</h3>
                          {item.isBestSeller && (
                            <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-sm font-medium whitespace-nowrap flex-shrink-0">Best</span>
                          )}
                        </div>
                        {lang !== "vi" && <p className="text-sm text-muted-foreground italic mb-3">{item.vi}</p>}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {typeof item.price === "object" ? (
                            <>
                              <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{tx.half}: {fmt(item.price.half)}</span>
                              <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{tx.whole}: {fmt(item.price.whole)}</span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{fmt(item.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 02. Lẩu Gà */}
              <motion.div variants={fadeIn} data-testid="section-hotpot">
                <SectionHeading label={tx.hotpot} />
                <div className="space-y-4">
                  {menuItems.hotpot.map((item, i) => (
                    <div key={i} className="bg-background rounded-sm overflow-hidden hover:shadow-sm transition-shadow flex gap-0" data-testid={`menu-hotpot-${i}`}>
                      {DISH_IMAGES[item.vi] && (
                        <button type="button" onClick={() => setLightbox({ src: DISH_IMAGES[item.vi], alt: item.vi })} className="w-28 flex-shrink-0 cursor-zoom-in overflow-hidden">
                          <img src={DISH_IMAGES[item.vi]} alt={item.vi} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </button>
                      )}
                      <div className="p-5 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="font-semibold text-foreground text-lg leading-snug">{item[lang]}</h3>
                          {item.isBestSeller && (
                            <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-sm font-medium whitespace-nowrap flex-shrink-0">Best</span>
                          )}
                        </div>
                        {lang !== "vi" && <p className="text-sm text-muted-foreground italic mb-3">{item.vi}</p>}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {typeof item.price === "object" ? (
                            <>
                              <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{tx.half}: {fmt(item.price.half)}</span>
                              <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{tx.whole}: {fmt(item.price.whole)}</span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{fmt(item.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 03. Các Món Bò */}
              <motion.div variants={fadeIn} data-testid="section-beef">
                <SectionHeading label={tx.beef} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.beef.map((item, i) => (
                    <div key={i} className="flex items-center gap-0 hover:bg-muted/30 transition-colors" data-testid={`menu-beef-${i}`}>
                      <div className="flex items-center justify-between flex-1 px-5 py-4 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic">({item.vi})</span>}
                          {item.isBestSeller && (
                            <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-sm font-medium whitespace-nowrap">Best</span>
                          )}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price)}/{tx.perPlate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 04. Các Món Heo */}
              <motion.div variants={fadeIn} data-testid="section-pork">
                <SectionHeading label={tx.pork} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.pork.map((item, i) => (
                    <div key={i} className="flex items-center gap-0 hover:bg-muted/30 transition-colors" data-testid={`menu-pork-${i}`}>
                      <div className="flex items-center justify-between flex-1 px-5 py-4 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic">({item.vi})</span>}
                          {item.isBestSeller && (
                            <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-sm font-medium whitespace-nowrap">Best</span>
                          )}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price)}/{tx.perPlate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 05. Gỏi & Salad */}
              <motion.div variants={fadeIn} data-testid="section-sides">
                <SectionHeading label={tx.sides} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.sides?.map((item, i) => (
                    <div key={i} className="flex items-center gap-0 hover:bg-muted/30 transition-colors" data-testid={`menu-side-${i}`}>
                      <div className="flex items-center justify-between flex-1 px-5 py-4 min-w-0">
                        <div>
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic ml-2">({item.vi})</span>}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price as number)}/{tx.perPlate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 06. Các Món Mực */}
              <motion.div variants={fadeIn} data-testid="section-squid">
                <SectionHeading label={tx.squid} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.squid?.map((item, i) => (
                    <div key={i} className="flex items-center gap-0 hover:bg-muted/30 transition-colors" data-testid={`menu-squid-${i}`}>
                      <div className="flex items-center justify-between flex-1 px-5 py-4 min-w-0">
                        <div>
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic ml-2">({item.vi})</span>}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price as number)}/{tx.perPlate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 07. Các Món Tôm */}
              <motion.div variants={fadeIn} data-testid="section-shrimp">
                <SectionHeading label={tx.shrimp} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.shrimp?.map((item, i) => (
                    <div key={i} className="flex items-center gap-0 hover:bg-muted/30 transition-colors" data-testid={`menu-shrimp-${i}`}>
                      <div className="flex items-center justify-between flex-1 px-5 py-4 min-w-0">
                        <div>
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic ml-2">({item.vi})</span>}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price as number)}/{tx.perPlate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 08. Lòng Gà */}
              <motion.div variants={fadeIn} data-testid="section-offal">
                <SectionHeading label={tx.offal} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.offal?.map((item, i) => (
                    <div key={i} className="flex items-center gap-0 hover:bg-muted/30 transition-colors" data-testid={`menu-offal-${i}`}>
                      {DISH_IMAGES[item.vi] && (
                        <button type="button" onClick={() => setLightbox({ src: DISH_IMAGES[item.vi], alt: item.vi })} className="w-16 h-16 flex-shrink-0 cursor-zoom-in overflow-hidden">
                          <img src={DISH_IMAGES[item.vi]} alt={item.vi} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </button>
                      )}
                      <div className="flex items-center justify-between flex-1 px-4 py-4 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic">({item.vi})</span>}
                          {item.isBestSeller && (
                            <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-sm font-medium whitespace-nowrap">Best</span>
                          )}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price as number)}/{tx.perPlate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 09. Cơm & Khoai */}
              <motion.div variants={fadeIn} data-testid="section-rice">
                <SectionHeading label={tx.rice} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.rice?.map((item, i) => (
                    <div key={i} className="flex items-center gap-0 hover:bg-muted/30 transition-colors" data-testid={`menu-rice-${i}`}>
                      {DISH_IMAGES[item.vi] && (
                        <button type="button" onClick={() => setLightbox({ src: DISH_IMAGES[item.vi], alt: item.vi })} className="w-16 h-16 flex-shrink-0 cursor-zoom-in overflow-hidden">
                          <img src={DISH_IMAGES[item.vi]} alt={item.vi} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </button>
                      )}
                      <div className="flex items-center justify-between flex-1 px-4 py-4 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic">({item.vi})</span>}
                          {item.isBestSeller && (
                            <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-sm font-medium whitespace-nowrap">Best</span>
                          )}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price as number)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 10. Bia & Nước */}
              <motion.div variants={fadeIn} data-testid="section-drinks">
                <SectionHeading label={tx.drinks} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.drinks.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors" data-testid={`menu-drink-${i}`}>
                      <span className="font-medium text-foreground">
                        {typeof item.name === "string" ? item.name : item.name[lang]}
                      </span>
                      <span className="font-semibold text-primary text-base ml-4">{fmt(item.price)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Note */}
              <p className="text-xs text-muted-foreground italic border-t border-border/50 pt-5">{tx.note}</p>
            </motion.div>

            {/* Right: images + quote */}
            <div className="lg:w-[42%] flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
              <motion.div
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="aspect-[4/3] overflow-hidden rounded-sm"
              >
                <img src={grilledChickenImg} alt="Gà nướng than hoa đặc sản Diên Khánh" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.12 }}
                className="aspect-[4/3] overflow-hidden rounded-sm"
              >
                <img src={hotpotImg} alt="Lẩu gà lá é Diên Khánh Nha Trang" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
              <div className="bg-primary text-primary-foreground p-7 text-center rounded-sm">
                <p className="font-serif text-lg italic leading-relaxed">
                  {lang === "vi" ? '"Hương vị ngon nhất là hương vị của sự tận tâm."'
                   : lang === "en" ? '"The finest flavor is the flavor of dedication."'
                   : lang === "ko" ? '"최고의 맛은 정성의 맛입니다."'
                   : lang === "zh" ? '"最好的味道是用心的味道。"'
                   : '"Лучший вкус — это вкус преданности."'}
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            <motion.img
              src={lightbox.src}
              alt={lightbox.alt}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-[88vh] rounded-md shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Đóng"
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors"
            >
              ✕
            </button>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm select-none">
              {lightbox.alt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
