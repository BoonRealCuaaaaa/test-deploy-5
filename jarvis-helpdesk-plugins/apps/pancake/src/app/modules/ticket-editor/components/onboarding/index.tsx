import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/shared/components/alt-button';
import { useI18n } from '@/shared/hooks/use-i18n';
import { StorageKey } from '@/shared/lib/constants/chrome';
import { ChromePersistStorage, listenStorageData } from '@/shared/lib/helpers/chrome/persistent-storage';
import { verifyDomain } from '@/src/app/apis/auth';
import { PancakeAPIs } from '@/src/app/apis/pancake-apis';
import { APP_CONFIG } from '@/src/app/lib/app-config';
import useAppStore from '@/src/app/stores';

function Onboarding() {
  const { t } = useI18n();

  const { isLogin, setIsLogin, isRegisteredDomain, setIsRegisteredDomain } = useAppStore((state) => state);
  const intervalVerifyDomain = useRef<NodeJS.Timeout | null>(null);

  const handleGoToAdmin = () => {
    window.open(APP_CONFIG.ADMIN_URL);
  };

  const { mutate: mutateVerifyDomain } = useMutation({
    mutationFn: async () => {
      const domain = await PancakeAPIs.getDomain();
      try {
        return await verifyDomain(domain);
      } catch (err) {
        throw new Error('Failed to verify domain');
      }
    },
    onSuccess: () => {
      setIsRegisteredDomain(true);
      ChromePersistStorage.setItem(StorageKey.IS_REGISTERED_DOMAIN, true);

      if (intervalVerifyDomain.current) {
        clearInterval(intervalVerifyDomain.current);
      }
    },
    onError: () => {
      setIsRegisteredDomain(false);
      ChromePersistStorage.setItem(StorageKey.IS_REGISTERED_DOMAIN, false);
    },
  });

  useEffect(() => {
    const checkLogin = async () => {
      const tokens = await ChromePersistStorage.getItem(StorageKey.AUTH_DATA);
      const isRegistered = await ChromePersistStorage.getItem(StorageKey.IS_REGISTERED_DOMAIN);
      if (tokens) {
        setIsLogin(true);
        if (isRegistered) {
          setIsRegisteredDomain(true);
        } else {
          mutateVerifyDomain();
        }
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (isLogin && !isRegisteredDomain) {
      intervalVerifyDomain.current = setInterval(() => {
        mutateVerifyDomain();
      }, 5000);
    }

    return () => {
      if (intervalVerifyDomain.current) {
        clearInterval(intervalVerifyDomain.current);
      }
    };
  }, []);

  listenStorageData(StorageKey.AUTH_DATA, async () => {
    const tokens = await ChromePersistStorage.getItem(StorageKey.AUTH_DATA);
    const isLoggedIn = !!tokens;

    setIsLogin(isLoggedIn);
    mutateVerifyDomain();
  });

  return (
    <div className="flex flex-col items-center gap-y-6 p-8">
      <div className="note-card">
        <p>🚀</p>
        {!isLogin && <p>{t('ticket_sidebar.onboarding.login_required')}</p>}
        {!isRegisteredDomain && isLogin && <p>{t('ticket_sidebar.onboarding.domain_required')}</p>}
      </div>
      <div>
        <Button onClick={handleGoToAdmin} variant={'primary'}>
          {t('ticket_editor.onboarding.go_to_admin')}
        </Button>
      </div>
    </div>
  );
}

export default Onboarding;
