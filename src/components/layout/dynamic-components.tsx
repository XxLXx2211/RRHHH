'use client'

import dynamic from 'next/dynamic';

// Lazy load components que no son críticos para el primer render
export const ChatWidget = dynamic(() => import('@/components/chat/chat-widget').then(mod => ({ default: mod.ChatWidget })), {
  ssr: false,
  loading: () => null
});

export const InstallPrompt = dynamic(() => import('@/components/pwa/install-prompt').then(mod => ({ default: mod.InstallPrompt })), {
  ssr: false,
  loading: () => null
});
