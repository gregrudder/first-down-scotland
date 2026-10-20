/**
 * Submit the live production sitemap to IndexNow.
 *
 *   node scripts/indexnow.mjs
 *   node scripts/indexnow.mjs --dry-run
 *
 * Reads https://www.firstdownscotland.com/sitemap.xml (and any sitemap
 * index children) and POSTs the page URLs to https://api.indexnow.org/indexnow.
 * 200 and 202 are success. A non-success exit code must not fail the
 * Vercel build: the production workflow runs this after deploy and
 * continues on error.
 */
import { pathToFileURL } from "node:url";

const HOST = "www.firstdownscotland.com";
const KEY = "189232d7a2df75356e1229dd198f9f0c";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10000;
const USER_AGENT = "FirstDownScotland-IndexNow/1.0 (+https://www.firstdownscotland.com)";

export function decodeXml(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export function extractLocs(xml) {
  const pattern = /<(?:[A-Za-z0-9_]+:)?loc>\s*([^<]*?)\s*<\/(?:[A-Za-z0-9_]+:)?loc>/gi;
  const locs = [];
  for (const match of xml.matchAll(pattern)) {
    const loc = decodeXml(match[1]).trim();
    if (loc) locs.push(loc);
  }
  return locs;
}

export function isSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(xml);
}

export function batchesOf(urls, size = BATCH_SIZE) {
  if (size < 1 || size > BATCH_SIZE) {
    throw new Error(`IndexNow batches must be between 1 and ${BATCH_SIZE} URLs`);
  }
  const batches = [];
  for (let index = 0; index < urls.length; index += size) {
    batches.push(urls.slice(index, index + size));
  }
  return batches;
}

export function selectHostUrls(urls, host = HOST) {
  const accepted = [];
  const skipped = [];
  const seen = new Set();

  for (const href of urls) {
    let url;
    try {
      url = new URL(href);
    } catch {
      skipped.push(href);
      continue;
    }
    if ((url.protocol !== "http:" && url.protocol !== "https:") || url.hostname !== host) {
      skipped.push(href);
      continue;
    }
    if (seen.has(url.href)) continue;
    seen.add(url.href);
    accepted.push(url.href);
  }

  return { accepted, skipped };
}

export async function collectUrls(sitemapUrl, fetchText, seen = new Set()) {
  const normalized = new URL(sitemapUrl).href;
  if (seen.has(normalized)) return [];
  seen.add(normalized);

  const xml = (await fetchText(normalized)).replace(/^\uFEFF/, "");
  const locs = extractLocs(xml).flatMap((loc) => {
    try {
      return [new URL(loc, normalized).href];
    } catch {
      return [];
    }
  });

  if (isSitemapIndex(xml)) {
    const nested = [];
    for (const child of locs) {
      nested.push(...(await collectUrls(child, fetchText, seen)));
    }
    return nested;
  }

  return locs;
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
    headers: {
      Accept: "application/xml, text/xml, */*",
      "User-Agent": USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(`GET ${url} failed: HTTP ${response.status}`);
  }
  return response.text();
}

async function postBatch(urlList) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "User-Agent": USER_AGENT,
    },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });
  const body = await response.text();
  console.log(`IndexNow HTTP ${response.status} (${urlList.length} URL(s))`);
  if (body.trim()) console.log(body.trim().slice(0, 500));
  return response.status;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  let urls;
  try {
    urls = await collectUrls(SITEMAP_URL, fetchText);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
    return;
  }

  const { accepted, skipped } = selectHostUrls(urls);
  console.log(`Sitemap ${SITEMAP_URL}: ${accepted.length} URL(s)`);
  if (skipped.length > 0) {
    console.error(`Skipped ${skipped.length} URL(s) that are not on ${HOST}`);
    for (const url of skipped) console.error(`skipped ${url}`);
  }

  if (dryRun) {
    for (const url of accepted) console.log(url);
    console.log("Dry run: did not POST to IndexNow.");
    return;
  }

  if (accepted.length === 0) {
    console.error("No URLs to submit.");
    process.exitCode = 1;
    return;
  }

  let failed = false;
  for (const batch of batchesOf(accepted)) {
    try {
      const status = await postBatch(batch);
      if (status !== 200 && status !== 202) failed = true;
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      failed = true;
    }
  }
  if (failed) process.exitCode = 1;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) return false;
  return import.meta.url === pathToFileURL(entry).href;
}

if (isDirectRun()) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
