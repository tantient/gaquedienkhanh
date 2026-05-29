import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { useBanner } from "@/hooks/useBanner";
import type { Lang } from "@/lib/translations";
import heroImg from "../assets/images/hero.png";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const LABELS: Record<Lang, {
  breadcrumb: string; heroTitle: string; heroSub: string;
  addressTitle: string; address: string;
  hoursTitle: string; hours: string;
  phoneTitle: string;
  callBtn: string;
  emailTitle: string;
  directionsBtn: string;
  note: string;
}> = {
  vi: {
    breadcrumb: "Liên Hệ",
    heroTitle: "Tìm Chúng Tôi",
    heroSub: "Ghé thăm Gà Quê Diên Khánh — chúng tôi luôn mở cửa đón tiếp bạn và gia đình.",
    addressTitle: "Địa Chỉ",
    address: "27 Tô Hiến Thành, Phường Nha Trang\nTỉnh Khánh Hoà",
    hoursTitle: "Giờ Mở Cửa",
    hours: "Thứ Hai – Chủ Nhật\n10:00 Sáng – 12:00 Đêm",
    phoneTitle: "Đặt Bàn & Hỏi Thăm",
    callBtn: "Gọi Ngay: 0823 890 789",
    emailTitle: "Email",
    directionsBtn: "Xem Đường Đi trên Google Maps",
    note: "Quán mở cửa tất cả các ngày trong tuần, kể cả ngày lễ. Đặt bàn trước được ưu tiên phục vụ.",
  },
  en: {
    breadcrumb: "Contact",
    heroTitle: "Find Us",
    heroSub: "Visit Gà Quê Diên Khánh — we're always open to welcome you and your family.",
    addressTitle: "Address",
    address: "27 To Hien Thanh, Nha Trang Ward\nKhanh Hoa Province",
    hoursTitle: "Opening Hours",
    hours: "Monday – Sunday\n10:00 AM – Midnight",
    phoneTitle: "Reservations & Enquiries",
    callBtn: "Call Us: 0823 890 789",
    emailTitle: "Email",
    directionsBtn: "Get Directions on Google Maps",
    note: "We are open every day of the week, including public holidays. Advance reservations are prioritized.",
  },
  ko: {
    breadcrumb: "연락처",
    heroTitle: "찾아오시는 길",
    heroSub: "가 께 디엔 칸을 방문하세요 — 언제나 여러분과 가족을 환영합니다.",
    addressTitle: "주소",
    address: "27 Tô Hiến Thành, 나트랑 구\n칸호아성",
    hoursTitle: "영업 시간",
    hours: "월요일 – 일요일\n오전 10:00 – 자정 12:00",
    phoneTitle: "예약 & 문의",
    callBtn: "전화: 0823 890 789",
    emailTitle: "이메일",
    directionsBtn: "Google Maps에서 길 찾기",
    note: "공휴일을 포함하여 주 7일 영업합니다. 사전 예약을 우선으로 모십니다.",
  },
  zh: {
    breadcrumb: "联系我们",
    heroTitle: "找到我们",
    heroSub: "欢迎来到嘉桂延庆 — 我们随时欢迎您和家人的到来。",
    addressTitle: "地址",
    address: "27 Tô Hiến Thành街，芽庄坊\n庆和省",
    hoursTitle: "营业时间",
    hours: "周一 – 周日\n上午10:00 – 深夜12:00",
    phoneTitle: "预订 & 咨询",
    callBtn: "致电: 0823 890 789",
    emailTitle: "电子邮件",
    directionsBtn: "在Google Maps上获取路线",
    note: "每天营业，包括法定节假日。提前预订优先接待。",
  },
  ru: {
    breadcrumb: "Контакты",
    heroTitle: "Найдите нас",
    heroSub: "Посетите Га Ке Зиен Кхань — мы всегда рады приветствовать вас и вашу семью.",
    addressTitle: "Адрес",
    address: "27 улица Tô Hiến Thành, квартал Нячанг\nпровинция Кханьхоа",
    hoursTitle: "Часы работы",
    hours: "Понедельник – Воскресенье\n10:00 – 24:00",
    phoneTitle: "Бронирование & Вопросы",
    callBtn: "Позвонить: 0823 890 789",
    emailTitle: "Эл. почта",
    directionsBtn: "Проложить маршрут в Google Maps",
    note: "Работаем каждый день, включая праздники. Бронирование заблаговременно имеет приоритет.",
  },
};

const SEO_CONTACT: Record<string, { title: string; description: string }> = {
  vi: { title: "Liên Hệ & Đặt Bàn | Gà Quê Diên Khánh – 27 Tô Hiến Thành, Nha Trang", description: "Liên hệ hoặc đặt bàn tại Gà Quê Diên Khánh. Địa chỉ: 27 Tô Hiến Thành, Nha Trang. Điện thoại: 0823 890 789. Mở cửa 10:00–22:00 hàng ngày." },
  en: { title: "Contact & Reservations | Gà Quê Diên Khánh – 27 Tô Hiến Thành, Nha Trang", description: "Contact or make a reservation at Gà Quê Diên Khánh. Address: 27 Tô Hiến Thành, Nha Trang. Phone: 0823 890 789. Open daily 10:00–22:00." },
  ko: { title: "연락처 & 예약 | Gà Quê Diên Khánh – 나트랑 27 Tô Hiến Thành", description: "Gà Quê Diên Khánh에 연락하거나 예약하세요. 주소: 나트랑 27 Tô Hiến Thành. 전화: 0823 890 789. 매일 10:00–22:00 영업." },
  zh: { title: "联系我们 & 预订 | Gà Quê Diên Khánh – 芽庄27 Tô Hiến Thành", description: "联系或预订Gà Quê Diên Khánh。地址：芽庄27 Tô Hiến Thành。电话：0823 890 789。每日10:00–22:00营业。" },
  ru: { title: "Контакты & Бронирование | Gà Quê Diên Khánh – 27 Tô Hiến Thành, Нячанг", description: "Свяжитесь с Gà Quê Diên Khánh или забронируйте столик. Адрес: 27 Tô Hiến Thành, Нячанг. Телефон: 0823 890 789. Открыто ежедневно 10:00–22:00." },
};

export default function Contact() {
  const { lang } = useLang();
  const tx = LABELS[lang] ?? LABELS.vi;
  const seo = SEO_CONTACT[lang] ?? SEO_CONTACT.vi;
  useSEO({ title: seo.title, description: seo.description, canonical: "https://gaquedienkhanh.com/contact" });
  const bannerUrl = useBanner();

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Page Hero */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <img src={bannerUrl || heroImg} alt="Contact" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold">{tx.breadcrumb}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">{tx.heroTitle}</h1>
            <p className="text-white/75 text-base mt-4 max-w-xl font-light">{tx.heroSub}</p>
          </motion.div>
        </div>
      </div>

      {/* Info + Map */}
      <section className="flex flex-col lg:flex-row min-h-[520px]">
        {/* Info panel */}
        <div className="lg:w-[42%] bg-[#F6F4ED] p-10 md:p-16 flex flex-col justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="space-y-8">
            {/* Address */}
            <div className="flex gap-5 items-start group">
              <div className="w-12 h-12 flex-shrink-0 bg-background flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 rounded-sm">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">{tx.addressTitle}</h3>
                <p className="text-muted-foreground font-light leading-relaxed whitespace-pre-line">{tx.address}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-5 items-start group">
              <div className="w-12 h-12 flex-shrink-0 bg-background flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 rounded-sm">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">{tx.hoursTitle}</h3>
                <p className="text-muted-foreground font-light leading-relaxed whitespace-pre-line">{tx.hours}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-5 items-start group">
              <div className="w-12 h-12 flex-shrink-0 bg-background flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 rounded-sm">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">{tx.phoneTitle}</h3>
                <p className="text-muted-foreground font-light">0823 890 789</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-5 items-start group">
              <div className="w-12 h-12 flex-shrink-0 bg-background flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 rounded-sm">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">{tx.emailTitle}</h3>
                <p className="text-muted-foreground font-light">gaquedienkhanh@gmail.com</p>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col gap-3"
          >
            <a
              href="tel:0823890789"
              className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/85 text-white px-6 py-3.5 text-sm tracking-wider uppercase font-semibold transition-all duration-300 hover:shadow-lg rounded-sm"
              data-testid="button-call"
            >
              <Phone size={16} />
              {tx.callBtn}
            </a>
            <a
              href="https://maps.app.goo.gl/oSrs7XZtXcscXZDA8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3.5 text-sm tracking-wider uppercase font-semibold transition-all duration-300 rounded-sm"
              data-testid="button-directions"
            >
              <MapPin size={16} />
              {tx.directionsBtn}
            </a>
          </motion.div>

          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">{tx.note}</p>
        </div>

        {/* Map */}
        <div className="lg:w-[58%] h-[400px] lg:h-auto">
          <iframe
            src="https://maps.google.com/maps?q=12.2408586,109.1925152&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            title="Bản đồ - Gà Quê Diên Khánh, 27 Tô Hiến Thành, Nha Trang"
            data-testid="map-embed"
          />
        </div>
      </section>
    </div>
  );
}
