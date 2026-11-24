import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../docs/screenshots");
const base = "http://127.0.0.1:8081";

const tabs = [
  { label: "Ana Sayfa", file: "home.png" },
  { label: "Analiz", file: "analyze.png" },
  { label: "Hesapla", file: "calculator.png" },
  { label: "Piyasa", file: "market.png" },
  { label: "Daha Fazla", file: "more.png" },
];

const browser = await chromium.launch({ headless: true });
const page = await (
  await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  })
).newPage();

const waitReady = async () => {
  await page.waitForTimeout(1200);
  const body = await page.locator("body").innerText();
  if (body.includes("Server Error") || body.includes("unknown module")) {
    throw new Error(`Error overlay: ${body.slice(0, 160)}`);
  }
};

const clickTab = async (label) => {
  // Prefer bottom tab bar hit target (last matching label on screen)
  const matches = page.getByText(label, { exact: true });
  const count = await matches.count();
  await matches.nth(Math.max(0, count - 1)).click({ force: true });
  await waitReady();
};

await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 90000 });
await waitReady();

for (const { label, file } of tabs) {
  await clickTab(label);
  await page.screenshot({ path: path.join(outDir, file), fullPage: true });
  console.log("saved", file);
}

await clickTab("Ana Sayfa");
await page.getByRole("button", { name: "Giriş" }).click({ force: true });
await waitReady();
await page.screenshot({
  path: path.join(outDir, "login.png"),
  fullPage: true,
});
console.log("saved login.png");

await page.getByText("Kayıt Ol", { exact: true }).last().click({ force: true });
await waitReady();
await page.screenshot({
  path: path.join(outDir, "register.png"),
  fullPage: true,
});
console.log("saved register.png");

await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 90000 });
await waitReady();
await clickTab("Daha Fazla");
await page.getByRole("button", { name: "Paketler" }).first().click({ force: true });
await waitReady();
await page.screenshot({
  path: path.join(outDir, "pricing.png"),
  fullPage: true,
});
console.log("saved pricing.png");

await browser.close();
