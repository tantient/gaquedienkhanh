import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { menuItems, fmt } from "@/lib/translations";
import type { Lang } from "@/lib/translations";
import heroImg from "../assets/images/hero.png";
import hotpotImg from "../assets/images/hotpot.png";
import grilledChickenImg from "../assets/images/grilled_chicken.png";

import imgLauLaE from "../assets/images/lau-ga-la-e.jpg";
import imgLauLaGiang from "../assets/images/lau-ga-la-giang.jpg";
import imgNuongLaQue from "../assets/images/ga-nuong-la-que.jpg";
import imgNuongMuoiOt from "../assets/images/ga-nuong-muoi-ot.jpg";
import imgHapHanh from "../assets/images/ga-hap-hanh.jpg";
import imgSotBoToi from "../assets/images/ga-sot-bo-toi.jpg";
import imgBoXoi from "../assets/images/ga-bo-xoi.jpg";
import imgLongGaBoXoi from "../assets/images/long-ga-bo-xoi.jpg";
import imgLongGaXaoMuop from "../assets/images/long-ga-xao-muop.jpg";
import imgComChienMuoiE from "../assets/images/com-chien-muoi-e.jpg";
import imgComChienTrung from "../assets/images/com-chien-trung.jpg";
import imgMiXaoThitBo from "../assets/images/mi-xao-thit-bo.jpg";
import imgKhoaiTayChien from "../assets/images/khoai-tay-chien.jpg";

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
  grilled: string; hotpot: string; beef: string; pork: string; sides: string; rice: string; drinks: string;
  half: string; whole: string; perPlate: string; note: string;
}> = {
  vi: {
    breadcrumb: "Thực Đơn",
    heroTitle: "Thực Đơn",
    heroSub: "Từ lẩu gà lá é đặc sản đến gà thả vườn nướng lá chuối thơm lừng — chúng tôi phục vụ trọn vẹn hương vị đồng quê Diên Khánh.",
    grilled: "Các Món Gà",
    hotpot: "Lẩu Gà",
    beef: "Các Món Bò",
    pork: "Các Món Heo",
    sides: "Món Ăn Kèm",
    rice: "Cơm & Mì",
    drinks: "Bia & Nước Giải Khát",
    half: "Nửa con",
    whole: "Nguyên con",
    perPlate: "đĩa",
    note: "Giá đã bao gồm thuế. Vui lòng thông báo nhân viên nếu có yêu cầu đặc biệt về dị ứng thực phẩm.",
  },
  en: {
    breadcrumb: "Menu",
    heroTitle: "Our Menu",
    heroSub: "From specialty basil-leaf chicken hotpot to fragrant banana-leaf grilled chicken — the full taste of the Vietnamese countryside.",
    grilled: "Chicken Dishes",
    hotpot: "Chicken Hotpot",
    beef: "Beef Dishes",
    pork: "Pork Dishes",
    sides: "Sides & Small Plates",
    rice: "Rice & Noodles",
    drinks: "Beer & Beverages",
    half: "Half",
    whole: "Whole",
    perPlate: "plate",
    note: "Prices include tax. Please inform staff of any food allergies or special dietary requirements.",
  },
  ko: {
    breadcrumb: "메뉴",
    heroTitle: "메뉴",
    heroSub: "바질잎 닭 샤부샤부 전문점부터 바나나잎 구운 닭까지 — 베트남 시골의 완전한 맛.",
    grilled: "닭고기 요리",
    hotpot: "닭 샤부샤부",
    beef: "소고기 요리",
    pork: "돼지고기 요리",
    sides: "사이드 & 소플레이트",
    rice: "밥 & 면",
    drinks: "맥주 & 음료",
    half: "반 마리",
    whole: "한 마리",
    perPlate: "접시",
    note: "가격에는 세금이 포함되어 있습니다. 음식 알레르기나 특별한 식이 요건이 있으시면 직원에게 알려주세요.",
  },
  zh: {
    breadcrumb: "菜单",
    heroTitle: "菜单",
    heroSub: "从特色罗勒叶鸡肉火锅到香气四溢的香蕉叶烤鸡 — 越南乡村风味的完整呈现。",
    grilled: "鸡肉料理",
    hotpot: "鸡肉火锅",
    beef: "牛肉料理",
    pork: "猪肉料理",
    sides: "小食 & 配菜",
    rice: "米饭 & 面条",
    drinks: "啤酒 & 饮料",
    half: "半只",
    whole: "整只",
    perPlate: "盘",
    note: "价格含税。如有食物过敏或特殊饮食要求，请通知工作人员。",
  },
  ru: {
    breadcrumb: "Меню",
    heroTitle: "Наше меню",
    heroSub: "От фирменного куриного фондю с базиликом до ароматной курицы в листьях банана — весь вкус вьетнамской деревни.",
    grilled: "Блюда из курицы",
    hotpot: "Куриный фондю",
    beef: "Блюда из говядины",
    pork: "Блюда из свинины",
    sides: "Закуски & Гарниры",
    rice: "Рис & Лапша",
    drinks: "Пиво & Напитки",
    half: "Половина",
    whole: "Целая",
    perPlate: "порция",
    note: "Цены включают налог. Пожалуйста, сообщите персоналу о пищевых аллергиях или особых пожеланиях.",
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

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Page Hero */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <img src={heroImg} alt="Thực đơn nhà hàng Gà Quê Diên Khánh Nha Trang" className="w-full h-full object-cover object-bottom" />
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
                        <div className="w-28 flex-shrink-0">
                          <img src={DISH_IMAGES[item.vi]} alt={item.vi} className="w-full h-full object-cover" />
                        </div>
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
                          <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{tx.half}: {fmt(item.price.half)}</span>
                          <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{tx.whole}: {fmt(item.price.whole)}</span>
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
                        <div className="w-28 flex-shrink-0">
                          <img src={DISH_IMAGES[item.vi]} alt={item.vi} className="w-full h-full object-cover" />
                        </div>
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
                          <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{tx.half}: {fmt(item.price.half)}</span>
                          <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1 rounded-sm">{tx.whole}: {fmt(item.price.whole)}</span>
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
                        <div>
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic ml-2">({item.vi})</span>}
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
                        <div>
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic ml-2">({item.vi})</span>}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price)}/{tx.perPlate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 05. Món Ăn Kèm */}
              <motion.div variants={fadeIn} data-testid="section-sides">
                <SectionHeading label={tx.sides} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.sides.map((item, i) => (
                    <div key={i} className="flex items-center gap-0 hover:bg-muted/30 transition-colors" data-testid={`menu-side-${i}`}>
                      {DISH_IMAGES[item.vi] && (
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                          <img src={DISH_IMAGES[item.vi]} alt={item.vi} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center justify-between flex-1 px-4 py-4 min-w-0">
                        <div>
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic ml-2">({item.vi})</span>}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price)}/{tx.perPlate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 06. Cơm & Mì */}
              <motion.div variants={fadeIn} data-testid="section-rice">
                <SectionHeading label={tx.rice} />
                <div className="bg-background rounded-sm overflow-hidden divide-y divide-border/50">
                  {menuItems.rice.map((item, i) => (
                    <div key={i} className="flex items-center gap-0 hover:bg-muted/30 transition-colors" data-testid={`menu-rice-${i}`}>
                      {DISH_IMAGES[item.vi] && (
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                          <img src={DISH_IMAGES[item.vi]} alt={item.vi} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center justify-between flex-1 px-4 py-4 min-w-0">
                        <div>
                          <span className="font-medium text-foreground">{item[lang]}</span>
                          {lang !== "vi" && <span className="text-xs text-muted-foreground italic ml-2">({item.vi})</span>}
                        </div>
                        <span className="font-semibold text-primary text-base ml-4 whitespace-nowrap">{fmt(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 07. Bia & Nước */}
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
        </div>
      </section>
    </div>
  );
}
