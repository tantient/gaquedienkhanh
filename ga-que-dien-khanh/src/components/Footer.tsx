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
                { id: "facebook", label: "f", url: "https://www.facebook.com/gaquedienkhanh/" },
                { id: "instagram", label: "ig", url: "https://www.instagram.com/gaquedienkhanh/" },
                { id: "tiktok", label: "tk", url: "#" },
              ] as const).map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  aria-label={s.id}
                  target={s.url !== "#" ? "_blank" : undefined}
                  rel={s.url !== "#" ? "noopener noreferrer" : undefined}
                  className="w-8 h-8 rounded-sm border border-white/20 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-colors text-white/60 text-xs font-bold"
                >
                  {s.label}
                </a>
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
