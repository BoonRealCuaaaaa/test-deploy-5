import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const MemberPage = lazy(() => import('@/src/pages/members'));
const NotFoundPage = lazy(() => import('@/src/pages/errors/not-found'));

const MemberRouters = () => {
  return (
    <Routes>
      <Route index element={<MemberPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default MemberRouters;
