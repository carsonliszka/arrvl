import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// csp. static policy, no nonce. we render inline styles everywhere (react style={{}})
// so style-src/script-src have to keep unsafe-inline; the rest is locked down.
// dev needs unsafe-eval (react refresh) + ws (hmr) and drops upgrade-insecure-requests
// so localhost still works.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  // contact form posts to the crm
  `connect-src 'self' https://crm-phi-gray.vercel.app${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// browser-policy headers on every response. they don't touch the page, just lock the browser down.
const securityHeaders = [
  // no embedding us in an iframe
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: csp },
  // no mime-sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // don't leak full urls cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // force https once it's been seen over https
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // kill apis we never use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // pin turbopack to this folder. a stray package-lock.json up in the user dir
  // makes next think the whole profile is the workspace otherwise.
  turbopack: {
    root: __dirname,
  },
  // same deal for file tracing
  outputFileTracingRoot: __dirname,
  // the dev fs cache balloons ram on restart, leave it off
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  // drop the x-powered-by header
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
