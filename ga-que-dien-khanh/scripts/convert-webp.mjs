import sharp from "sharp";
import { readdirSync, unlinkSync } from "fs";
import { join, extname, basename } from "path";

const dir = new URL("../src/assets/images/", import.meta.url).pathname;

const files = readdirSync(dir).filter(
  (f) => [".jpg", ".jpeg"].includes(extname(f).toLowerCase())
);

for (const file of files) {
  const src = join(dir, file);
  const dest = join(dir, basename(file, extname(file)) + ".webp");
  const info = await sharp(src)
    .webp({ quality: 82 })
    .toFile(dest);
  const srcSize = (await import("fs")).statSync(src).size;
  console.log(
    `${file} → ${basename(dest)} | ${Math.round(srcSize/1024)}KB → ${Math.round(info.size/1024)}KB (-${Math.round((1-info.size/srcSize)*100)}%)`
  );
}
console.log(`\nDone: ${files.length} images converted.`);
