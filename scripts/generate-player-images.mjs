import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const playersDir = path.join(__dirname, "..", "public", "players");
const outputPath = path.join(__dirname, "..", "data", "playerImages.json");

const files = fs.readdirSync(playersDir);
const images = files
  .filter((f) => f.endsWith(".png") || f.endsWith(".jpg"))
  .map((f) => f.replace(/\.(png|jpg)$/, ""));

fs.writeFileSync(outputPath, JSON.stringify(images, null, 2));
console.log(`Generated ${images.length} player images to data/playerImages.json`);
