import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X, ChevronDown, Phone } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { LANGUAGES, NAV_LABELS } from "@/lib/translations";
import logoImg from "/logo.png";


const NAV_LINKS = [
  { key: "home" as const, path: "/" },
  { key: "about" as const, path: "/about" },
  { key: "menu" as const, path: "/menu" },
  { key: "gallery" as const, path: "/gallery" },
  { key: "blog" as const, path: "/blog" },
  { key: "contact" as const, path: "/contact" },
];

export default function Navbar() {
  const { lang, setLang } = useLang();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const labels = NAV_LABELS[lang];
  const isHome = location === "/" || location === "";
  const currentLang = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navBg = isHome && !isScrolled ? "bg-transparent" : "bg-background/97 backdrop-blur-md shadow-sm";
  const textColor = isHome && !isScrolled ? "text-white/90 drop-shadow-sm" : "text-foreground";
  const logoColor = isHome && !isScrolled ? "text-white drop-shadow-md" : "text-primary";
  const borderColor = isHome && !isScrolled ? "border-white/30 text-white" : "border-border text-foreground";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg} ${isScrolled || !isHome ? "py-3" : "py-5"}`}>
        <div className="container mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <span
              className="cursor-pointer flex flex-col items-center justify-center"
              data-testid="link-logo"
            >
              <img
                src={logoImg}
                alt="Gà Quê Diên Khánh"
                className="h-[104px] w-auto transition-all duration-300 brightness-125 drop-shadow-[0_0_18px_rgba(255,180,0,0.9)]"
              />
              <span className={`hidden md:block text-[10px] tracking-[0.18em] font-light mt-[-6px] transition-colors duration-300 ${isHome && !isScrolled ? "text-white/60" : "text-muted-foreground"}`}>
                từ vườn quê đến bàn ăn
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {NAV_LINKS.map(({ key, path }) => {
              const isActive = location === path || (path !== "/" && location.startsWith(path));
              return (
                <Link key={key} href={path}>
                  <span
                    className={`text-[13.5px] font-semibold tracking-[0.12em] uppercase cursor-pointer transition-colors duration-300 pb-0.5 ${
                      isActive
                        ? "text-accent border-b-2 border-accent"
                        : `${textColor} hover:text-accent`
                    }`}
                    data-testid={`link-nav-${key}`}
                  >
                    {labels[key]}
                  </span>
                </Link>
              );
            })}

            {/* Hotline */}
            <a
              href="tel:0823890789"
              data-testid="navbar-phone"
              className={`hidden lg:flex items-center gap-2 text-[13px] font-bold tracking-wider transition-colors duration-300 hover:opacity-75 ${isHome && !isScrolled ? "text-accent/90" : "text-accent"}`}
            >
              <Phone size={13} />
              0823 890 789
            </a>

            {/* Language picker */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 border rounded-sm transition-colors duration-300 hover:border-accent hover:text-accent ${borderColor}`}
                data-testid="button-lang-picker"
              >
                <span>{currentLang.flag}</span>
                <span className="uppercase tracking-wider">{currentLang.code}</span>
                <ChevronDown size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 bg-background border border-border shadow-lg rounded-sm overflow-hidden z-50 min-w-[160px]"
                    onMouseLeave={() => setLangOpen(false)}
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-muted ${
                          lang === l.code ? "text-accent font-semibold bg-muted/60" : "text-foreground"
                        }`}
                        data-testid={`button-lang-${l.code}`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile: hotline + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="tel:0823890789"
              className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${isHome && !isScrolled ? "text-accent" : "text-accent"}`}
            >
              <Phone size={14} />
              <span>0823 890 789</span>
            </a>
            <button
              className={`p-2 -mr-2 transition-colors ${isHome && !isScrolled ? "text-white" : "text-foreground"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-20 px-8 pb-8 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-1 mb-8">
              {NAV_LINKS.map(({ key, path }) => {
                const isActive = location === path || (path !== "/" && location.startsWith(path));
                return (
                  <Link key={key} href={path}>
                    <span
                      className={`block py-4 text-2xl font-serif border-b border-border/40 transition-colors ${
                        isActive ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {labels[key]}
                    </span>
                  </Link>
                );
              })}
            </div>

            <a
              href="tel:0823890789"
              className="flex items-center gap-3 mb-8 px-4 py-3 rounded-sm bg-accent/10 border border-accent/30 text-accent font-bold text-lg"
            >
              <Phone size={20} />
              0823 890 789
            </a>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-medium">Language</p>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setMobileOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2.5 border rounded-sm text-sm transition-colors ${
                      lang === l.code ? "border-accent text-accent bg-accent/5 font-semibold" : "border-border text-foreground"
                    }`}
                    data-testid={`button-mobile-lang-${l.code}`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
