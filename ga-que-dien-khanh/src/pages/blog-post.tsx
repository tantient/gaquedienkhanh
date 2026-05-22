import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import heroImg from "../assets/images/hero.png";
import hotpotImg from "../assets/images/hotpot.png";
import grilledChickenImg from "../assets/images/grilled_chicken.png";
import { useLang } from "@/context/LanguageContext";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const IMAGE_MAP: Record<string, string> = {
  hero: heroImg,
  hotpot: hotpotImg,
  grilled: grilledChickenImg,
};

interface BlogPost {
  id: number;
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imageUrl?: string;
  content?: string;
}

const BACK_LABEL: Record<string, string> = {
  vi: "Quay lại Blog",
  en: "Back to Blog",
  ko: "블로그로 돌아가기",
  zh: "返回博客",
  ru: "Назад в блог",
};

const NO_CONTENT_LABEL: Record<string, string> = {
  vi: "Bài viết chưa có nội dung đầy đủ.",
  en: "This article has no full content yet.",
  ko: "이 기사의 전체 내용이 아직 없습니다.",
  zh: "本文尚无完整内容。",
  ru: "У этой статьи пока нет полного содержания.",
};

const NOT_FOUND_LABEL: Record<string, string> = {
  vi: "Không tìm thấy bài viết.",
  en: "Article not found.",
  ko: "기사를 찾을 수 없습니다.",
  zh: "找不到文章。",
  ru: "Статья не найдена.",
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { lang } = useLang();
  const [post, setPost] = useState<BlogPost | null | "loading" | "notfound">("loading");

  useEffect(() => {
    setPost("loading");
    fetch(`${BASE}/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data: BlogPost) => setPost(data))
      .catch(() => setPost("notfound"));
  }, [slug]);

  const backLabel = BACK_LABEL[lang] ?? BACK_LABEL.vi;

  if (post === "loading") {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (post === "notfound") {
    return (
      <div className="min-h-screen bg-background pt-16 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{NOT_FOUND_LABEL[lang] ?? NOT_FOUND_LABEL.vi}</p>
        <button
          onClick={() => navigate(`${BASE}/blog`)}
          className="flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          <ArrowLeft size={14} /> {backLabel}
        </button>
      </div>
    );
  }

  const imgSrc = post.imageUrl ? post.imageUrl : (IMAGE_MAP[post.image] ?? heroImg);

  const paragraphs = post.content
    ? post.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Hero image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={imgSrc}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = heroImg; }}
        />
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="container mx-auto px-6 md:px-12 pb-8 md:pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-xs bg-accent text-white px-3 py-1 rounded-sm font-semibold mb-3">{post.category}</span>
              <h1 className="font-serif text-2xl md:text-4xl text-white font-bold max-w-3xl leading-snug">{post.title}</h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 py-10 max-w-3xl">
        {/* Back + meta */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <button
            onClick={() => navigate(`${BASE}/blog`)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={15} /> {backLabel}
          </button>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
            <span className="flex items-center gap-1"><Tag size={12} /> {post.category}</span>
          </div>
        </div>

        {/* Excerpt (lead) */}
        <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8 border-l-4 border-accent/50 pl-5 italic">
          {post.excerpt}
        </p>

        {/* Full content */}
        {paragraphs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-lg max-w-none"
          >
            {paragraphs.map((para, i) => (
              <p key={i} className="text-foreground/90 leading-[1.9] mb-5 text-[1.05rem]">
                {para.split("\n").map((line, j, arr) => (
                  j < arr.length - 1 ? <span key={j}>{line}<br /></span> : <span key={j}>{line}</span>
                ))}
              </p>
            ))}
          </motion.div>
        ) : (
          <p className="text-muted-foreground italic">{NO_CONTENT_LABEL[lang] ?? NO_CONTENT_LABEL.vi}</p>
        )}
      </div>
    </div>
  );
}
