import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { requireAuth } from "../lib/auth.js";
import { parseMenuDocx } from "../lib/menuParser.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MENU_FILE = join(__dirname, "../src/data/menu.json");

function readMenu() {
  try {
    return JSON.parse(readFileSync(MENU_FILE, "utf-8"));
  } catch {
    return null;
  }
}

function writeMenu(data: unknown) {
  writeFileSync(MENU_FILE, JSON.stringify(data, null, 2), "utf-8");
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok =
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.originalname.endsWith(".docx");
    cb(null, ok);
  },
});

const router = Router();

router.get("/menu", (_req, res) => {
  const data = readMenu();
  if (!data) return res.status(404).json({ error: "Menu not found" });
  return res.json(data);
});

router.post(
  "/menu/upload",
  (req, res, next) => {
    const token = requireAuth(req, res);
    if (!token) return;
    next();
  },
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const parsed = await parseMenuDocx(req.file.buffer);

      const existing = readMenu() ?? {};
      const merged = { ...existing };

      for (const key of Object.keys(parsed) as Array<keyof typeof parsed>) {
        if (Array.isArray(parsed[key]) && (parsed[key] as unknown[]).length > 0) {
          merged[key] = parsed[key];
        }
      }

      writeMenu(merged);
      return res.json({ ok: true, menu: merged });
    } catch (err) {
      console.error("Menu upload error:", err);
      return res.status(500).json({ error: "Failed to parse menu file" });
    }
  }
);

router.put("/menu", (req, res) => {
  const token = requireAuth(req, res);
  if (!token) return;
  try {
    const body = req.body;
    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "Invalid body" });
    }
    writeMenu(body);
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to save menu" });
  }
});

export default router;
