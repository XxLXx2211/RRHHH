
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/theme-context';
import { QueryProvider } from '@/context/query-provider';
import { ClientLayout } from '@/components/client-layout';
import { AuthProvider } from '@/components/auth/auth-provider';
import { ChatProvider } from '@/context/chat-context';
import { NotificationProvider } from '@/context/notification-context';
import { ChatWidget, InstallPrompt } from '@/components/layout/dynamic-components';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Solo precargar la fuente principal
});



// Metadatos optimizados
export const metadata = {
  title: {
    default: 'CandidatoScope',
    template: '%s | CandidatoScope'
  },
  description: 'Sistema completo de gestión de candidatos y recursos humanos con IA integrada',
  keywords: ['RRHH', 'candidatos', 'gestión', 'recursos humanos', 'IA', 'reclutamiento'],
  authors: [{ name: 'CandidatoScope Team' }],
  creator: 'CandidatoScope',
  publisher: 'CandidatoScope',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:9002'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/app-icon.ico',
    shortcut: '/app-icon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  themeColor: '#70A7E3',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnect para optimizar carga de recursos externos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://rwcbpuekhaujyzgaodro.supabase.co" />

        {/* DNS Prefetch para dominios externos */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Optimización de recursos críticos */}
        <link rel="preload" href="/app-icon.ico" as="image" type="image/x-icon" />

        {/* PWA Meta Tags optimizados */}
        <meta name="application-name" content="CandidatoScope" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CandidatoScope" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#70A7E3" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CandidatoScope" />

        {/* Additional PWA Meta Tags */}
        <meta name="application-name" content="CandidatoScope" />
        <meta name="msapplication-TileColor" content="#70A7E3" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Clean up browser extension attributes before React hydration
              (function() {
                function cleanupExtensionAttributes() {
                  const body = document.body;
                  if (body) {
                    // Remove common browser extension attributes
                    body.removeAttribute('bis_register');
                    body.removeAttribute('__processed_bf80d3b4-abf4-48de-b6cb-0ae9f883f96a__');
                    body.removeAttribute('__processed_6ba51d2f-4b90-4cc6-94bf-16c3001cdc92__');
                    // Remove any attribute that starts with __processed_
                    Array.from(body.attributes).forEach(attr => {
                      if (attr.name.startsWith('__processed_') || attr.name.includes('bis_')) {
                        body.removeAttribute(attr.name);
                      }
                    });
                  }
                }

                // Run immediately if DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', cleanupExtensionAttributes);
                } else {
                  cleanupExtensionAttributes();
                }

                // Also run before React hydration
                if (typeof window !== 'undefined') {
                  const originalAddEventListener = window.addEventListener;
                  window.addEventListener = function(type, listener, options) {
                    if (type === 'DOMContentLoaded') {
                      const wrappedListener = function(event) {
                        cleanupExtensionAttributes();
                        return listener.call(this, event);
                      };
                      return originalAddEventListener.call(this, type, wrappedListener, options);
                    }
                    return originalAddEventListener.call(this, type, listener, options);
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`} suppressHydrationWarning>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <NotificationProvider>
                <ChatProvider>
                  <ClientLayout>
                    {children}
                  </ClientLayout>
                  <ChatWidget />
                  <InstallPrompt />
                  <Toaster />
                </ChatProvider>
              </NotificationProvider>
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
