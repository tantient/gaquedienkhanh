import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

const MESSENGER_URL = "https://m.me/gaquedienkhanh";

const labels: Record<string, string> = {
  vi: "Chat ngay",
  en: "Chat now",
  ko: "채팅하기",
  zh: "立即聊天",
  ru: "Написать",
};

export default function MessengerButton() {
  const { lang } = useLang();
  const [hovered, setHovered] = useState(false);

  const label = labels[lang] ?? labels.vi;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white text-[#214830] text-sm font-semibold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.a
        href={MESSENGER_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat qua Facebook Messenger"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
        style={{ background: "linear-gradient(135deg, #0099FF 0%, #A033FF 100%)" }}
      >
        {/* Messenger icon */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 2C7.373 2 2 7.075 2 13.333c0 3.52 1.68 6.667 4.32 8.8V26l3.947-2.173c1.053.293 2.16.44 3.3.44 6.627 0 12-5.075 12-11.334C25.567 7.075 20.627 2 14 2z"
            fill="white"
          />
          <path
            d="M15.093 16.893l-3.053-3.253-5.96 3.253 6.547-6.96 3.107 3.253 5.906-3.253-6.547 6.96z"
            fill="url(#msg_grad)"
          />
          <defs>
            <linearGradient id="msg_grad" x1="6.08" y1="16.893" x2="21.64" y2="9.933" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0099FF" />
              <stop offset="1" stopColor="#A033FF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Pulse ring */}
        <motion.span
          className="absolute w-14 h-14 rounded-full"
          style={{ border: "2px solid rgba(0,153,255,0.5)" }}
          animate={{ scale: [1, 1.4, 1.4], opacity: [0.7, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.a>
    </div>
  );
}
