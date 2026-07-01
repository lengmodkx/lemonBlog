'use client';

import { useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  window.addEventListener('storage', callback);

  return () => {
    mediaQuery.removeEventListener('change', callback);
    window.removeEventListener('storage', callback);
  };
};

export function useIsDarkTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
