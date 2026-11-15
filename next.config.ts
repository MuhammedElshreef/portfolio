import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// A short hash of the CV file, read at build time. The CV link carries it (?v=...), so every
// new CV is a new link and phones and in-app browsers can't open an old saved copy.
const cvVersion = createHash("sha256")
  .update(readFileSync(join(process.cwd(), "public", "Muhammed-Alsayed-CV.pdf")))
  .digest("hex")
  .slice(0, 8);

const nextConfig: NextConfig = {
  env: { CV_VERSION: cvVersion },
};

export default nextConfig;
