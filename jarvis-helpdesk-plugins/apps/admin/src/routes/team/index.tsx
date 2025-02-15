import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const NotFoundPage = lazy(() => import('@/src/pages/errors/not-found'));
const TeamPage = lazy(() => import('@/src/pages/team'));

const TeamRouters = () => {
  return (
    <Routes>
      <Route index element={<TeamPage />} />
      <Route path="/" element={<TeamPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default TeamRouters;
