
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/theme-context';
import { QueryProvider } from '@/context/query-provider';
import { ClientLayout } from '@/components/client-layout';
import { AuthProvider } from '@/components/auth/auth-provider';
import { ChatProvider } from '@/context/chat-context';
import { ChatWidget } from '@/components/chat/chat-widget';
import { NotificationProvider } from '@/context/notification-context';
import { InstallPrompt } from '@/components/pwa/install-prompt';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>CandidatoScope</title>
        <meta name="description" content="Candidate Management System" />

        {/* Favicon */}
        <link rel="icon" href="/app-icon.ico" sizes="any" />
        <link rel="icon" href="/app-icon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/app-icon.ico" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#70A7E3" />

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
