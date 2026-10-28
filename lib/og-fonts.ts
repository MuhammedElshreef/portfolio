import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
  Font files for the generated icons and share image. Satori reads TTF, OTF or WOFF
  (not WOFF2), so these come from the @fontsource packages' .woff files.
*/
const fontsource = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

export const rakkasArabic = () => fontsource("rakkas", "rakkas-arabic-400-normal.woff");
export const bricolage = (weight: 500 | 800) =>
  fontsource("bricolage-grotesque", `bricolage-grotesque-latin-${weight}-normal.woff`);
export const jetbrainsMono = () => fontsource("jetbrains-mono", "jetbrains-mono-latin-500-normal.woff");

export const brand = {
  ground: "#07090c",
  accent: "#33c7d8",
  accentHi: "#8ee3ea",
  text: "#eef6f7",
  muted: "#93abaf",
};
