import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function useBanner(): string {
  const [bannerUrl, setBannerUrl] = useState("");
  useEffect(() => {
    fetch(`${BASE}/api/banner`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d: { banner_url: string }) => setBannerUrl(d.banner_url ?? ""))
      .catch(() => {});
  }, []);
  return bannerUrl;
}
