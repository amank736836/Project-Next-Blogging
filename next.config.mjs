/** @type {import('next').NextConfig} */
const nextConfig = {
  // BUG-014 fix: disable X-Powered-By header to avoid advertising the framework.
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // BUG-014 fix: add security headers to every response.
  // NOTE: X-Frame-Options is intentionally NOT set here. DENY blocks the
  // portfolio Live Preview iframe (amank.co.in embedding blog.amank.co.in).
  // CSP frame-ancestors is the modern replacement and allows listed origins.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' https://amank.co.in https://www.amank.co.in https://frameandphrase.vercel.app http://localhost:3000;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
