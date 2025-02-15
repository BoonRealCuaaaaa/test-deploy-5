import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import FullscreenLoader from '../components/full-screen-loader';
import Header from '../components/header';
import { getRefreshToken, getToken } from '../libs/utils/get-auth-token';

const RootLayout = () => {
  // Transfer token to the parent window (plugin)
  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data === 'REQUEST_TOKEN') {
        (event.source as Window).postMessage(
          { type: 'ACCESS_TOKEN', token: getToken(), refreshToken: getRefreshToken() },
          event.origin
        );
      }
    });
  }, []);

  return (
    <Suspense fallback={<FullscreenLoader />}>
      <div className="flex min-h-screen flex-col gap-y-5">
        <header>
          <Header />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </Suspense>
  );
};

export default RootLayout;
