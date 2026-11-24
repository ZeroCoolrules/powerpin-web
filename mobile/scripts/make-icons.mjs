// Redraws the app icon, splash screens and Play Store graphics from the
// Qpids Place heart mark. Run from mobile/: node scripts/make-icons.mjs
// Needs Playwright with Chromium available.
import { chromium } from "playwright";
import { readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const CORAL = "#F0545C";
const CREAM = "#FFF7F0";
const INK = "#2B1D2A";
const HEART = "M16 23.5s-7-4.3-7-9.2A3.9 3.9 0 0 1 16 12a3.9 3.9 0 0 1 7 2.3c0 4.9-7 9.2-7 9.2z";
const RES = "android/app/src/main/res";

// The heart path sits in a 32-unit box, centred near (16, 16.5).
const heart = (cx, cy, scale, fill) =>
  `<path transform="translate(${cx - 16 * scale} ${cy - 16.6 * scale}) scale(${scale})" d="${HEART}" fill="${fill}"/>`;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const browser = await chromium.launch();
async function draw(file, w, h, body, transparent = true) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg(w, h, body)}`);
  await page.screenshot({ path: file, omitBackground: transparent });
  await page.close();
}

const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [name, k] of Object.entries(densities)) {
  const s = 48 * k;
  const f = 108 * k;
  const dir = `${RES}/mipmap-${name}`;
  const round = `<circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}" fill="${CORAL}"/>${heart(s / 2, s / 2, s / 30, "#fff")}`;
  await draw(`${dir}/ic_launcher_round.png`, s, s, round);
  await draw(`${dir}/ic_launcher.png`, s, s, `<rect width="${s}" height="${s}" rx="${s * 0.22}" fill="${CORAL}"/>${heart(s / 2, s / 2, s / 30, "#fff")}`);
  // Adaptive icon foreground: keep the heart inside the middle 66 of 108.
  await draw(`${dir}/ic_launcher_foreground.png`, f, f, heart(f / 2, f / 2, f / 56, "#fff"));
}

// Splash screens keep the sizes the project already has.
for (const d of readdirSync(RES).filter((n) => n.startsWith("drawable"))) {
  const file = `${RES}/${d}/splash.png`;
  if (!existsSync(file)) continue;
  const [w, h] = execFileSync("file", [file]).toString().match(/(\d+) x (\d+)/).slice(1).map(Number);
  const r = Math.min(w, h) * 0.13;
  await draw(file, w, h, `<rect width="${w}" height="${h}" fill="${CREAM}"/><circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="${CORAL}"/>${heart(w / 2, h / 2, r / 16, "#fff")}`, false);
}

// Play Store listing graphics.
await draw("store/icon-512.png", 512, 512, `<rect width="512" height="512" fill="${CORAL}"/>${heart(256, 256, 17, "#fff")}`, false);
await draw(
  "store/feature-graphic-1024x500.png",
  1024,
  500,
  `<rect width="1024" height="500" fill="${CREAM}"/><circle cx="250" cy="250" r="120" fill="${CORAL}"/>${heart(250, 250, 7.5, "#fff")}
   <text x="420" y="240" font-family="Georgia, serif" font-weight="700" font-size="76" fill="${INK}">Qpids Place</text>
   <text x="424" y="300" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#7B6A77">Meet someone worth meeting</text>`,
  false,
);
await browser.close();
