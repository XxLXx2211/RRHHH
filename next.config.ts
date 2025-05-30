
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Optimizaciones para producción
  output: 'standalone',

  // Configuración de TypeScript y ESLint
  typescript: {
    ignoreBuildErrors: false, // Cambiar a false para producción
  },
  eslint: {
    ignoreDuringBuilds: false, // Cambiar a false para producción
  },

  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Configuración de compresión
  compress: true,

  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Configuración experimental solo para desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      allowedDevOrigins: [
        'https://6000-firebase-studio-1748558012346.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev',
        'https://9000-firebase-studio-1748558012346.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev',
      ],
    },
  }),
};

export default nextConfig;
