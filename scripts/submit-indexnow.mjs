import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { XMLParser } from "fast-xml-parser";

const SITE_URL = process.env.INDEXNOW_SITE_URL || "https://onemoremoment.org";
const INDEXNOW_KEY = "42152178bcbf56d650ccbcecbb285fc7";
const INDEXNOW_ENDPOINT =
  process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const SITEMAP_PATHS = [
  resolve("dist/sitemap-index.xml"),
  resolve("dist/client/sitemap-index.xml"),
];
const SITEMAP_PATH =
  SITEMAP_PATHS.find((path) => existsSync(path)) || SITEMAP_PATHS[0];
const SITEMAP_DIR = dirname(SITEMAP_PATH);
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const DRY_RUN = process.argv.includes("--dry-run");
const SUBMIT_RETRIES = Math.max(1, Number(process.env.INDEXNOW_RETRIES || 3));
const RETRY_DELAY_MS = Math.max(
  0,
  Number(process.env.INDEXNOW_RETRY_DELAY_MS || 30000),
);

const parser = new XMLParser({
  ignoreAttributes: false,
});

function readXml(path) {
  if (!existsSync(path)) {
    throw new Error(
      `Missing ${path}. Run "npm run build" before submitting to IndexNow.`,
    );
  }

  return parser.parse(readFileSync(path, "utf8"));
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function localSitemapPath(sitemapUrl) {
  const { pathname } = new URL(sitemapUrl);
  return resolve(SITEMAP_DIR, pathname.replace(/^\/+/, ""));
}

function collectUrlsFromSitemap(path) {
  const xml = readXml(path);

  if (xml.sitemapindex?.sitemap) {
    return asArray(xml.sitemapindex.sitemap).flatMap((sitemap) =>
      collectUrlsFromSitemap(localSitemapPath(sitemap.loc)),
    );
  }

  return asArray(xml.urlset?.url)
    .map((entry) => entry.loc)
    .filter(Boolean);
}

function chunk(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function writeActionsSummary(lines) {
  if (!process.env.GITHUB_STEP_SUMMARY) return;

  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
}

async function submitUrlList(urlList) {
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `IndexNow submission failed with ${response.status}: ${body}`,
    );
  }
}

const urls = [...new Set(collectUrlsFromSitemap(SITEMAP_PATH))].filter((url) =>
  url.startsWith(SITE_URL),
);

if (urls.length === 0) {
  throw new Error(`No ${SITE_URL} URLs found in ${SITEMAP_PATH}.`);
}

if (DRY_RUN) {
  console.log(`Found ${urls.length} URLs for IndexNow.`);
  console.log(`Key location: ${KEY_LOCATION}`);
  console.log(`First URL: ${urls[0]}`);
  writeActionsSummary([
    "## IndexNow dry run",
    "",
    `- URLs found: ${urls.length}`,
    `- Key location: ${KEY_LOCATION}`,
    `- First URL: ${urls[0]}`,
  ]);
  process.exit(0);
}

let submittedUrlCount = 0;

for (const urlList of chunk(urls, 10000)) {
  for (let attempt = 1; attempt <= SUBMIT_RETRIES; attempt += 1) {
    try {
      await submitUrlList(urlList);
      submittedUrlCount += urlList.length;
      console.log(`Submitted ${urlList.length} URLs to IndexNow.`);
      break;
    } catch (error) {
      if (attempt === SUBMIT_RETRIES) {
        throw error;
      }

      console.warn(
        `${error.message} Retrying in ${Math.round(RETRY_DELAY_MS / 1000)} seconds.`,
      );
      await sleep(RETRY_DELAY_MS);
    }
  }
}

writeActionsSummary([
  "## IndexNow submission",
  "",
  `- Submitted URLs: ${submittedUrlCount}`,
  `- Site: ${SITE_URL}`,
  `- Key location: ${KEY_LOCATION}`,
  `- Endpoint: ${INDEXNOW_ENDPOINT}`,
]);
