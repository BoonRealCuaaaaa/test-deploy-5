import { useEffect } from 'react';

import gif from '@/shared/assets/gifs/onboarding-plugin.gif';
import { Button } from '@/shared/components/alt-button';
import { Separator } from '@/shared/components/separator';
import { useI18n } from '@/shared/hooks/use-i18n';
import { StorageKey } from '@/shared/lib/constants/chrome';
import { ChromePersistStorage, listenStorageData } from '@/shared/lib/helpers/chrome/persistent-storage';
import { APP_CONFIG } from '@/src/app/lib/app-config';
import useAppStore from '@/src/app/stores';

function Onboarding() {
  const { t } = useI18n();

  const handleButtonClick = () => {
    window.open(APP_CONFIG.ADMIN_URL);
  };

  const { isLogin, isRegisteredDomain, setIsLogin, setIsRegisteredDomain } = useAppStore((state) => state);

  useEffect(() => {
    const checkLogin = async () => {
      const tokens = await ChromePersistStorage.getItem(StorageKey.AUTH_DATA);
      if (tokens) {
        setIsLogin(true);
        setIsRegisteredDomain(true);
      }
    };

    checkLogin();
  });

  listenStorageData(StorageKey.AUTH_DATA, async () => {
    const tokens = await ChromePersistStorage.getItem(StorageKey.AUTH_DATA);
    const isLoggedIn = !!tokens; // Chuyển thành boolean

    setIsLogin(isLoggedIn);
  });

  listenStorageData(StorageKey.IS_REGISTERED_DOMAIN, async () => {
    const isRegistered = await ChromePersistStorage.getItem(StorageKey.IS_REGISTERED_DOMAIN);
    if (isRegistered) {
      setIsRegisteredDomain(true);
    }
  });

  return (
    <div className="flex flex-col items-center gap-y-6 px-2 py-10">
      <p className="text-base font-semibold">🎉 {t('ticket_sidebar.onboarding.welcome')} 🎉</p>
      <div className="flex flex-col items-center gap-y-4">
        <Separator />
        <p className="text-center text-sm">{t('ticket_sidebar.onboarding.introduction')}</p>
        <img src={gif}></img>
        <div className="note-card">
          <p>🚀</p>
          {!isLogin && <p>{t('ticket_sidebar.onboarding.login_required')}</p>}
          {isLogin && !isRegisteredDomain && <p>{t('ticket_sidebar.onboarding.domain_required')}</p>}
        </div>
      </div>

      <div>
        <Button onClick={handleButtonClick} variant={'primary'}>
          {t('ticket_sidebar.onboarding.go_to_admin')}
        </Button>
      </div>
    </div>
  );
}

export default Onboarding;
