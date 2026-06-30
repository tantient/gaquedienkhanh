import mammoth from "mammoth";

export interface MenuItem {
  vi: string;
  en: string;
  ko: string;
  zh: string;
  ru: string;
  price: number | { half: number; whole: number };
  isBestSeller?: boolean;
}

export interface DrinkItem {
  name: string | { vi: string; en: string; ko?: string; zh?: string; ru?: string };
  price: number;
}

export interface ParsedMenu {
  grilled: MenuItem[];
  hotpot: MenuItem[];
  beef: MenuItem[];
  pork: MenuItem[];
  sides: MenuItem[];
  rice: MenuItem[];
  drinks: DrinkItem[];
}

function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
}

function hasKorean(text: string): boolean {
  return /[\uac00-\ud7a3\u1100-\u11ff]/.test(text);
}

function hasCyrillic(text: string): boolean {
  return /[\u0400-\u04ff]/.test(text);
}

function parsePrice(raw: string): number | { half: number; whole: number } | null {
  const clean = raw.replace(/\s/g, "").toLowerCase();

  const parseNum = (s: string) => {
    const m = s.match(/([\d]+[.,]?[\d]*)/);
    if (!m) return 0;
    return parseInt(m[1].replace(/[.,]/g, ""), 10);
  };

  const halfMatch = clean.match(
    /(\d[\d.,]*)\s*vn[đd]?\s*\/?\s*[½½1]?\s*(?:con|chicken|курицы|只|마리|kuricy)/i
  );
  const wholeMatch = clean.match(
    /\(?\s*(\d[\d.,]*)\s*vn[đd]?\s*\/?\s*1?\s*(?:con|chicken|курица|只|마리|kuricy)?\s*\)?/i
  );

  const firstPrice = clean.match(/(\d[\d.]*)\s*(?:vn)?[đd]/i);

  if (halfMatch && wholeMatch && halfMatch[1] !== wholeMatch[1]) {
    const half = parseNum(halfMatch[1]);
    const whole = parseNum(wholeMatch[1]);
    if (half > 0 && whole > 0 && whole > half) {
      return { half, whole };
    }
  }

  if (firstPrice) {
    const val = parseNum(firstPrice[1]);
    if (val > 0) return val;
  }

  return null;
}

function parsePriceFromLine(line: string): number | { half: number; whole: number } | null {
  const parseNum = (s: string) => parseInt(s.replace(/[.,]/g, ""), 10);

  const clean = line.replace(/\s/g, "");

  const twoPrice = clean.match(/(\d[\d.,]+)\s*[\/\-]\s*(\d[\d.,]+)/);
  if (twoPrice) {
    const a = parseNum(twoPrice[1]);
    const b = parseNum(twoPrice[2]);
    if (a > 0 && b > 0 && b > a) return { half: a, whole: b };
    if (a > 0 && b > 0) return { half: Math.min(a, b), whole: Math.max(a, b) };
  }

  const singlePrice = clean.match(/(\d[\d.,]{2,})/);
  if (singlePrice) {
    const val = parseNum(singlePrice[1]);
    if (val >= 10000) return val;
  }

  return null;
}

function detectCategory(vi: string): keyof ParsedMenu {
  const v = vi.toLowerCase();
  if (v.includes("lẩu")) return "hotpot";
  if (
    v.includes("gà ta") ||
    v.includes("gà nướng") ||
    v.includes("gà hấp") ||
    v.includes("gà sốt") ||
    v.includes("gà bó xôi") ||
    v.includes("gà rang")
  )
    return "grilled";
  if (v.includes("bò")) return "beef";
  if (
    v.includes("heo") ||
    v.includes("sườn") ||
    v.includes("chạo") ||
    v.includes("ba chỉ") ||
    v.includes("thịt quay")
  )
    return "pork";
  if (
    v.includes("cơm") ||
    v.includes("miến") ||
    v.includes("mì") ||
    v.includes("khoai tây") ||
    v.includes("bún")
  )
    return "rice";
  if (
    v.includes("bia") ||
    v.includes("nước") ||
    v.includes("trà") ||
    v.includes("sinh tố") ||
    v.includes("nước ngọt")
  )
    return "drinks" as keyof ParsedMenu;
  return "sides";
}

interface RawItem {
  lines: string[];
}

export async function parseMenuDocx(buffer: Buffer): Promise<ParsedMenu> {
  const result = await mammoth.extractRawText({ buffer });
  const rawText = result.value;
  return parseMenuText(rawText);
}

export async function extractRawText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export function parseMenuText(rawText: string): ParsedMenu {
  const menu = parseNumberedMultilang(rawText);

  const totalItems = Object.values(menu).reduce((s, a) => s + a.length, 0);
  if (totalItems > 0) return menu;

  return parseSimpleFormat(rawText);
}

function parseNumberedMultilang(rawText: string): ParsedMenu {
  const menu: ParsedMenu = {
    grilled: [],
    hotpot: [],
    beef: [],
    pork: [],
    sides: [],
    rice: [],
    drinks: [],
  };

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let inDrinksSection = false;
  const itemMap = new Map<string, RawItem>();

  for (const line of lines) {
    if (/^(BIA|BEER|bia|beer)/i.test(line)) {
      inDrinksSection = true;
      continue;
    }

    const numMatch = line.match(/^(\d+)\s*[.\s]/);
    if (!numMatch) continue;

    const num = numMatch[1];
    const content = line.slice(numMatch[0].length).trim();
    if (!content) continue;

    const key = inDrinksSection ? `d-${num}` : `f-${num}`;
    if (!itemMap.has(key)) {
      itemMap.set(key, { lines: [] });
    }
    itemMap.get(key)!.lines.push(content);
  }

  for (const [key, item] of itemMap.entries()) {
    const isDrink = key.startsWith("d-");
    if (isDrink) {
      parseDrinkLines(item.lines, menu.drinks);
    } else {
      parseFoodLines(item.lines, menu);
    }
  }

  return menu;
}

function parseSimpleFormat(rawText: string): ParsedMenu {
  const menu: ParsedMenu = {
    grilled: [],
    hotpot: [],
    beef: [],
    pork: [],
    sides: [],
    rice: [],
    drinks: [],
  };

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let inDrinksSection = false;

  for (const line of lines) {
    if (/^(BIA[\s\-]|NƯỚC[\s\-]|ĐỒ UỐNG)/i.test(line)) {
      inDrinksSection = true;
      continue;
    }

    const stripped = line.replace(/^\d+[\s.。、)）]+/, "").trim();
    if (!stripped) continue;

    const colonIdx = stripped.lastIndexOf(":");
    let name = stripped;
    let priceStr = "";

    if (colonIdx !== -1) {
      name = stripped.slice(0, colonIdx).trim();
      priceStr = stripped.slice(colonIdx + 1).trim();
    } else {
      const priceMatch = stripped.match(/^(.+?)\s{2,}([\d][\d.,\/\-\s]+)$/);
      if (priceMatch) {
        name = priceMatch[1].trim();
        priceStr = priceMatch[2].trim();
      }
    }

    if (!name || name.length < 2) continue;

    if (hasChinese(name) || hasKorean(name) || hasCyrillic(name)) continue;

    const price = parsePriceFromLine(priceStr || line);
    if (!price) continue;

    name = name.replace(/\/$/, "").trim();

    if (inDrinksSection) {
      menu.drinks.push({ name, price: typeof price === "number" ? price : price.half });
    } else {
      const category = detectCategory(name);
      if (category === "drinks") {
        menu.drinks.push({ name, price: typeof price === "number" ? price : price.half });
      } else {
        (menu[category] as MenuItem[]).push({
          vi: name,
          en: name,
          ko: "",
          zh: "",
          ru: "",
          price,
        });
      }
    }
  }

  return menu;
}

function extractNameAndPrice(raw: string): { name: string; priceRaw: string } {
  const colonIdx = raw.lastIndexOf(":");
  if (colonIdx === -1) return { name: raw.trim(), priceRaw: "" };
  return {
    name: raw.slice(0, colonIdx).replace(/\/$/, "").trim(),
    priceRaw: raw.slice(colonIdx + 1).trim(),
  };
}

function parseDrinkLines(lines: string[], drinks: DrinkItem[]): void {
  const viLine = lines.find(
    (l) => !hasChinese(l) && !hasKorean(l) && !hasCyrillic(l)
  );
  if (!viLine) return;

  const { name, priceRaw } = extractNameAndPrice(viLine);
  const price = parsePrice(priceRaw);
  if (!price || typeof price !== "number") return;

  const enLine = lines.find(
    (l) =>
      l !== viLine &&
      !hasChinese(l) &&
      !hasKorean(l) &&
      !hasCyrillic(l) &&
      /[a-zA-Z]/.test(l)
  );

  if (enLine) {
    const { name: enName } = extractNameAndPrice(enLine);
    if (enName && enName.toLowerCase() !== name.toLowerCase()) {
      drinks.push({ name: { vi: name, en: enName }, price });
      return;
    }
  }

  drinks.push({ name, price });
}

function parseFoodLines(lines: string[], menu: ParsedMenu): void {
  const langs = { vi: "", en: "", zh: "", ko: "", ru: "" };

  let firstPrice: number | { half: number; whole: number } | null = null;

  for (const line of lines) {
    const { name, priceRaw: pr } = extractNameAndPrice(line);
    const p = parsePrice(pr);
    if (!firstPrice && p) {
      firstPrice = p;
    }

    if (hasChinese(line)) {
      if (!langs.zh) langs.zh = name;
    } else if (hasKorean(line)) {
      if (!langs.ko) langs.ko = name;
    } else if (hasCyrillic(line)) {
      if (!langs.ru) langs.ru = name;
    } else if (!langs.vi) {
      langs.vi = name.replace(/\/$/, "").trim();
    } else if (!langs.en) {
      langs.en = name.replace(/\/$/, "").trim();
    }
  }

  if (!langs.vi || !firstPrice) return;

  const category = detectCategory(langs.vi);

  const entry: MenuItem = {
    vi: langs.vi,
    en: langs.en || langs.vi,
    ko: langs.ko || "",
    zh: langs.zh || "",
    ru: langs.ru || "",
    price: firstPrice,
  };

  (menu[category] as MenuItem[]).push(entry);
}
