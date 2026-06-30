import { Link } from "wouter";
import logoImg from "/logo.png";
import { MapPin, Clock } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { NAV_LABELS } from "@/lib/translations";
import footerData from "@/lib/footer_translations.json";

type FooterKey = keyof typeof footerData;

const NAV_PATHS = [
  { key: "home" as const, path: "/" },
  { key: "about" as const, path: "/about" },
  { key: "menu" as const, path: "/menu" },
  { key: "gallery" as const, path: "/gallery" },
  { key: "blog" as const, path: "/blog" },
  { key: "contact" as const, path: "/contact" },
];

function getLangKey(lang: string): FooterKey {
  if (lang === "ko") return "kr";
  if (lang in footerData) return lang as FooterKey;
  return "vi";
}

export default function Footer() {
  const { lang } = useLang();

  const key = getLangKey(lang);
  const tx = footerData[key];
  const navLabels = NAV_LABELS[lang as keyof typeof NAV_LABELS] ?? NAV_LABELS.vi;

  return (
    <footer style={{ backgroundColor: "#4A3427" }} className="text-white/90">
      {/* Main footer grid */}
      <div className="container mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

          {/* Column 1 — About */}
          <div data-testid="footer-col-about">
            <div className="mb-3">
              <img
                src={logoImg}
                alt="Gà Quê Diên Khánh"
                className="h-24 w-auto drop-shadow-[0_0_10px_rgba(255,200,50,0.4)]"
              />
            </div>
            <p className="text-amber-400/90 text-xs font-semibold tracking-widest uppercase mb-5 leading-relaxed">
              Gà Quê Diên Khánh<br />
              <span className="font-light normal-case tracking-wide text-white/60">từ vườn quê đến bàn ăn</span>
            </p>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">{tx.about_title}</h4>
            <p className="text-sm text-white/70 font-light leading-relaxed">{tx.about_desc}</p>
            <div className="flex gap-3 mt-6">
              {([
                {
                  id: "facebook",
                  label: "Facebook",
                  url: "https://www.facebook.com/gaquedienkhanh/",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
                {
                  id: "instagram",
                  label: "Instagram",
                  url: "https://www.instagram.com/gaquedienkhanh/",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  ),
                },
                {
                  id: "tiktok",
                  label: "TikTok",
                  url: "https://www.tiktok.com/@qun.g.qu.nha.tran",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  ),
                },
                {
                  id: "tripadvisor",
                  label: "Tripadvisor",
                  url: "https://www.tripadvisor.com/Restaurant_Review-g293928-d34384120-Reviews-Ga_Que_Dien_Khanh-Nha_Trang_Khanh_Hoa_Province.html",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                      <path d="M12.006 4.295c-2.67 0-5.338.553-7.482 1.662L3 6.56l1.342 1.234a5.518 5.518 0 00-1.8 4.048 5.527 5.527 0 005.526 5.526 5.499 5.499 0 003.808-1.526l.13.176.138-.176a5.499 5.499 0 003.807 1.526 5.527 5.527 0 005.526-5.526 5.52 5.52 0 00-1.8-4.048L21 6.559l-1.524-.603c-2.144-1.109-4.812-1.661-7.47-1.661zM8.068 9.457a3.316 3.316 0 110 6.632 3.316 3.316 0 010-6.632zm7.876 0a3.316 3.316 0 110 6.632 3.316 3.316 0 010-6.632zm-7.876 1.105a2.21 2.21 0 100 4.42 2.21 2.21 0 000-4.42zm7.876 0a2.21 2.21 0 100 4.42 2.21 2.21 0 000-4.42zm-7.876 1.104a1.105 1.105 0 110 2.21 1.105 1.105 0 010-2.21zm7.876 0a1.105 1.105 0 110 2.21 1.105 1.105 0 010-2.21z"/>
                    </svg>
                  ),
                },
              ] as const).map((s) => (
                <div key={s.id} className="relative group">
                  <a
                    href={s.url}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-sm border border-white/20 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-colors text-white/60"
                  >
                    {s.icon}
                  </a>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-white text-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick links */}
          <div data-testid="footer-col-links">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">{tx.links_title}</h4>
            <ul className="space-y-2.5">
              {NAV_PATHS.map(({ key: navKey, path }) => (
                <li key={navKey}>
                  <Link href={path}>
                    <span className="text-sm text-white/70 hover:text-amber-400 transition-colors cursor-pointer font-light">
                      {navLabels[navKey]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div data-testid="footer-col-contact">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">{tx.contact_title}</h4>
            <div className="space-y-4 mb-6">
              <div className="flex gap-3 items-start">
                <MapPin size={15} className="flex-shrink-0 mt-0.5" style={{ color: "#E6A83E" }} />
                <p className="text-sm text-white/70 font-light leading-relaxed">{tx.address}</p>
              </div>
              <div className="flex gap-3 items-start">
                <Clock size={15} className="flex-shrink-0 mt-0.5" style={{ color: "#E6A83E" }} />
                <p className="text-sm text-white/70 font-light">{tx.hours}</p>
              </div>
            </div>
            <Link href="/contact">
              <span
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-5 py-3 cursor-pointer hover:opacity-90 transition-opacity rounded-sm"
                style={{ backgroundColor: "#E6A83E", color: "#fff" }}
                data-testid="button-footer-map"
              >
                <MapPin size={13} />
                {tx.button_map}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ backgroundColor: "#3A2518" }} className="border-t border-white/10">
        <div className="container mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/35">
          <span>© {new Date().getFullYear()} Gà Quê Diên Khánh. All rights reserved.</span>
          <span>27 Tô Hiến Thành, Nha Trang, Khánh Hòa</span>
        </div>
      </div>
    </footer>
  );
}
