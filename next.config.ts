import type { NextConfig } from 'next'

const immutable = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]

const config: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: { deviceSizes: [360, 640, 828, 1080, 1440, 1920], imageSizes: [128, 256, 384], formats: ['image/avif', 'image/webp'], minimumCacheTTL: 31536000, qualities: [60, 75] },
  async headers() {
    return [
      { source: '/places/:path*', headers: immutable },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}
export default config
