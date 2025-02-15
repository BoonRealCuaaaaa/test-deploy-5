import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const OAuthLoginSuccessPage = lazy(() => import('@/src/pages/auth/oauth-login-success'));

const AuthRouters = () => {
  return (
    <Routes>
      <Route path="oauth/success" element={<OAuthLoginSuccessPage />} />
    </Routes>
  );
};

export default AuthRouters;
