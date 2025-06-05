
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Configuración mínima para desarrollo
  typescript: {
    ignoreBuildErrors: true, // Temporalmente para debugging
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporalmente para debugging
  },

  // Configuración básica de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
