import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizeCss: false,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Qpids Place can reach the shared dating backend through this app instead
  // of calling it from the browser. Set QPIDS_BACKEND_URL to the backend and
  // NEXT_PUBLIC_QPIDS_API_URL=/api/qpids-proxy. The browser then only talks to
  // its own domain, so the backend needs no cross-origin (CORS) setup.
  async rewrites() {
    const backend = (process.env.QPIDS_BACKEND_URL || '').replace(/\/$/, '')
    if (!backend) return []
    return [{ source: '/api/qpids-proxy/:path*', destination: `${backend}/:path*` }]
  },
}

export default nextConfig

