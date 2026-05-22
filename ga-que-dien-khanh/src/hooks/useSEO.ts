import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

export function useSEO({ title, description, canonical, ogImage }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const attr = selector.includes("property=") ? "property" : "name";
        const key = selector.match(/["']([^"']+)["']/)?.[1] ?? "";
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    if (canonical) {
      setMeta('meta[property="og:url"]', canonical);
      const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (link) link.href = canonical;
    }
    if (ogImage) {
      setMeta('meta[property="og:image"]', ogImage);
    }
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [title, description, canonical, ogImage]);
}
