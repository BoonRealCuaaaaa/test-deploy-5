import { StrictMode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';

import ErrorBoundary from '@/shared/components/error-boundary';
import Loader from '@/shared/components/loader';
import AuthProvider from '@/shared/contexts/auth/provider';
import TranslationProvider from '@/shared/contexts/translation/provider';
import I18n from '@/shared/lib/i18n';

import queryClient from './lib/clients/query-client';
import { initI18n } from './lib/helpers/i18n';

import './styles/index.scss';

export const Bootstrap = ({ children }: { children: React.ReactNode }) => {
  const [i18n, setI18n] = useState<I18n>();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    (async () => {
      const { i18n, locale } = await initI18n();
      setLocale(locale);
      setI18n(i18n);
    })();
  }, []);

  if (!i18n) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <TranslationProvider i18n={i18n} initLocale={locale}>
      <AuthProvider>{children}</AuthProvider>
    </TranslationProvider>
  );
};

export const renderApp = (Component: React.FC, containerId: string) => {
  const container = document.getElementById(containerId);
  if (container) {
    createRoot(container).render(
      <StrictMode>
        <Suspense fallback={<Loader />}>
          <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
              <Bootstrap>
                <Component />
              </Bootstrap>
            </QueryClientProvider>
          </ErrorBoundary>
        </Suspense>
      </StrictMode>
    );
  }
};
