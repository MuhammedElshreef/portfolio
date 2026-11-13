// Prints cv/cv.html to public/Muhammed-Alsayed-CV.pdf with a locally installed Chrome or Edge.
// Usage: node cv/build.mjs [output.pdf]
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] ?? resolve(here, "../public/Muhammed-Alsayed-CV.pdf"));
const browsers = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = browsers.find((p) => existsSync(p));
if (!browser) throw new Error("No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.");

execFileSync(
  browser,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    // Gives the web font time to load before the page is printed
    "--virtual-time-budget=10000",
    `--print-to-pdf=${out}`,
    pathToFileURL(resolve(here, "cv.html")).href,
  ],
  { stdio: "inherit" },
);
console.log(`Wrote ${out}`);
