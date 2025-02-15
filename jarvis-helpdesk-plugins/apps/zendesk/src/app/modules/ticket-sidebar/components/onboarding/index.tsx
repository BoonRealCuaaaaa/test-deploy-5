import { useEffect, useRef } from 'react';

import gif from '@/shared/assets/gifs/onboarding-plugin.gif';
import { Button } from '@/shared/components/alt-button';
import { Separator } from '@/shared/components/separator';
import { useI18n } from '@/shared/hooks/use-i18n';
import { setRefreshToken, setToken } from '@/shared/lib/utils/get-auth-token';
import useAuthStatus, { AuthStatus } from '@/src/app/hooks/use-check-auth-status-mutation';

function Onboarding() {
  const { t } = useI18n();
  const authStatus = useAuthStatus();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const adminUrl = import.meta.env.VITE_HELPDESK_ADMIN_URL as string;

  const handleButtonClick = () => {
    const adminWindow = window.open(adminUrl);

    if (adminWindow) {
      intervalRef.current = setInterval(() => {
        if (adminWindow.closed) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          return;
        }

        try {
          adminWindow.postMessage('REQUEST_TOKEN', adminUrl);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }, 5000);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, token, refreshToken } = event.data as { type: string; token: string; refreshToken: string };
      if (type === 'ACCESS_TOKEN') {
        setToken(token);
        setRefreshToken(refreshToken);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-y-6 px-2 py-10">
      <p className="text-base font-semibold">🎉 {t('ticket_sidebar.onboarding.welcome')} 🎉</p>
      <div className="flex flex-col gap-y-4">
        <Separator />
        <p className="text-center text-sm">{t('ticket_sidebar.onboarding.introduction')}</p>
        <img src={gif}></img>
        <div className="note-card">
          <p>🚀</p>
          {authStatus === AuthStatus.NOT_LOGGED_IN ? (
            <>
              <p>{t('ticket_sidebar.onboarding.login_required')}</p>
            </>
          ) : (
            <p>{t('ticket_sidebar.onboarding.domain_required')}</p>
          )}
        </div>
      </div>
      {authStatus === AuthStatus.NOT_LOGGED_IN && (
        <div className="note-card border-yellow-300 bg-yellow-50">
          <p>⚠️</p>
          <p className="text-yellow-600">{t('ticket_sidebar.onboarding.google_login_warning')}</p>
        </div>
      )}

      <div>
        <Button onClick={handleButtonClick} variant={'primary'}>
          {t('ticket_sidebar.onboarding.go_to_admin')}
        </Button>
      </div>
    </div>
  );
}

export default Onboarding;
