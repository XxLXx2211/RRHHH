
'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Moon, Sun } from 'lucide-react';
import { useCustomTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';

export const AppHeader = React.memo(function AppHeader() {
  const { theme, toggleTheme } = useCustomTheme(); 

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            CandidatoScope
          </span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
});
AppHeader.displayName = 'AppHeader';

    