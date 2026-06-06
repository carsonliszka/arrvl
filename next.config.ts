import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy.
//
// This is a *static, no-nonce* policy. The site renders inline style
// attributes everywhere (React `style={{}}` → `style="..."`), which a
// nonce-based `style-src` cannot cover — it would block every inline style
// and destroy the visual design. So `style-src`/`script-src` keep
// 'unsafe-inline'; the value here is defense-in-depth on every *other*
// directive (no foreign origins, no <object>, locked base-uri/form-action,
// framing locked to self), while preserving static rendering.
//
// Scope was verified against the actual runtime: WebGL is raw GPU shaders
// (no eval/workers/wasm), fonts are self-hosted by next/font, images are
// same-origin PNGs plus data: SVG noise, and there are no external scripts,
// styles, fonts, or fetches. External https:// references are <a> links
// (navigation), which CSP does not restrict here.
//
// Dev-only relaxations: React Refresh needs 'unsafe-eval'; Turbopack HMR
// needs a websocket (connect-src ws:); and upgrade-insecure-requests is
// omitted in dev because it would upgrade http://localhost and break it.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  // Allow the contact form to POST submissions to the self-hosted CRM.
  `connect-src 'self' https://crm-phi-gray.vercel.app${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// Security headers applied to every response. These are all transport/
// browser-policy headers — they have no effect on styling, layout, or
// behavior, they just tell the browser to be stricter.
const securityHeaders = [
  // Clickjacking: stop other sites from embedding us in an <iframe>.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: csp },
  // Stop the browser from MIME-sniffing a response into a different type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs to other origins in the Referer header.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Once seen over HTTPS, always use HTTPS for this domain and subdomains.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Explicitly disable powerful features the site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Pin Turbopack dev to this folder only. Without this, a package-lock.json in
  // C:\Users\apollo makes Next treat the whole user profile as the workspace.
  turbopack: {
    root: __dirname,
  },
  // Pin the file-tracing root to this project. A stray package-lock.json in a
  // parent directory otherwise makes Next infer the wrong workspace root.
  outputFileTracingRoot: __dirname,
  // Avoid a multi-GB .next/dev cache that spikes RAM on every restart.
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
