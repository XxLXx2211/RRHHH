
'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Moon, Sun, FileText, Users } from 'lucide-react';
import { useCustomTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/user-nav';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { usePathname } from 'next/navigation';

export const AppHeader = React.memo(function AppHeader() {
  const { theme, toggleTheme } = useCustomTheme()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              CandidatoScope
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Candidatos</span>
            </Link>
            <Link
              href="/reports"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/reports'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Reportes</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <NotificationCenter />
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
});
AppHeader.displayName = 'AppHeader';

    