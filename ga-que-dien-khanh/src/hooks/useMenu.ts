import { useQuery } from "@tanstack/react-query";
import { menuItems as staticMenu } from "@/lib/translations";

export type MenuData = typeof staticMenu;

const BASE = typeof import.meta !== "undefined" && (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL
  ? (import.meta as { env: { BASE_URL: string } }).env.BASE_URL.replace(/\/$/, "")
  : "";

async function fetchMenu(): Promise<MenuData> {
  const res = await fetch(`${BASE}/api/menu`);
  if (!res.ok) throw new Error("Failed to fetch menu");
  return res.json();
}

export function useMenu() {
  const { data, isLoading, error } = useQuery<MenuData>({
    queryKey: ["menu"],
    queryFn: fetchMenu,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    menu: data ?? staticMenu,
    isLoading,
    hasApiData: !!data,
    error,
  };
}
