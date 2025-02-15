import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import RoleGuard from '@/src/components/role/guard';
import { TeamRole } from '@/src/libs/constants/team';
import { ITeam } from '@/src/libs/interfaces/team';
import AiSettingPage from '@/src/pages/ai-setting';

const GeneralPage = lazy(() => import('@/src/pages/ai-setting/pages/general'));
const IntegrationsPage = lazy(() => import('@/src/pages/ai-setting/pages/integrations'));
const RulesPage = lazy(() => import('@/src/pages/ai-setting/pages/rules'));
const TemplatesPage = lazy(() => import('@/src/pages/ai-setting/pages/templates'));
const NotFoundPage = lazy(() => import('@/src/pages/errors/not-found'));

type AiSettingRoutersProps = {
  currentTeam: ITeam | null;
};

const AiSettingRouters = (props: AiSettingRoutersProps) => {
  const { currentTeam } = props;
  return (
    <Routes>
      <Route element={<AiSettingPage />}>
        <Route index element={<Navigate to="general" replace />} />
        <Route path="general" element={<GeneralPage />} />
        <Route element={<RoleGuard allowedRoles={[TeamRole.ADMIN]} userRole={currentTeam?.role ?? null} />}>
          <Route path="rules" element={<RulesPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="templates" element={<TemplatesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AiSettingRouters;
