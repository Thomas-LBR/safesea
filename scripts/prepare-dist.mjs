import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";

await rm("dist", { force: true, recursive: true });
await cp("out", "dist", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await cp(".openai/hosting.json", "dist/.openai/hosting.json");

const assets = {};

for (const filePath of await listFiles("dist")) {
  const normalizedPath = `/${relative("dist", filePath).split(sep).join("/")}`;

  if (normalizedPath.startsWith("/server/")) {
    continue;
  }

  if (normalizedPath.startsWith("/.openai/")) {
    continue;
  }

  const bytes = await readFile(filePath);
  assets[normalizedPath] = {
    contentType: getContentType(filePath),
    body: bytes.toString("base64")
  };
}

await writeFile(
  "dist/server/index.js",
  `const ASSETS = ${JSON.stringify(assets)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);
    const asset = ASSETS[pathname] || ASSETS[pathname + ".html"] || ASSETS[pathname + "/index.html"] || ASSETS["/index.html"];

    if (!asset) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(base64ToBytes(asset.body), {
      headers: {
        "content-type": asset.contentType,
        "cache-control": pathname.startsWith("/_next/") ? "public, max-age=31536000, immutable" : "public, max-age=60"
      }
    });
  }
};

function normalizePath(pathname) {
  if (pathname === "/") return "/index.html";
  return pathname.endsWith("/") ? pathname + "index.html" : pathname;
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}
`
);

async function listFiles(directory) {
  const entries = await readdir(directory);
  const files = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry);
    const entryStat = await stat(entryPath);

    if (entryStat.isDirectory()) {
      files.push(...(await listFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

function getContentType(filePath) {
  const extension = extname(filePath);
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8"
  };

  return contentTypes[extension] ?? "application/octet-stream";
}
