import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AuthGuard from '../components/auth/guard';
import AcceptInvitationRedirect from '../components/redirect/accept-invitation-redirect';
import LastAccessTeamRedirect from '../components/redirect/last-access-team-redirect';
import RoleGuard from '../components/role/guard';
import useTeams from '../hooks/use-teams';
import { TeamRole } from '../libs/constants/team';
import AiSettingLayout from '../pages/ai-setting/layout';
import KnowledgeLayout from '../pages/knowledge/layout';
import RootLayout from '../pages/layout';
import MemberLayout from '../pages/members/layout';
import TeamLayout from '../pages/team/layout';

import AiSettingRouters from './ai-setting';
import AuthRouters from './auth';
import KnowledgeRouters from './knowledge';
import MemberRouters from './member';
import TeamRouters from './team';

const Interrupts = lazy(() => import('@/src/pages/errors/interrupts'));
const Forbidden = lazy(() => import('@/src/pages/errors/forbidden'));
const NotFound = lazy(() => import('@/src/pages/errors/not-found'));

const AppRouter = () => {
  const { currentTeam } = useTeams();

  return (
    <Routes>
      <Route path="auth/*" element={<AuthRouters />} />

      <Route element={<AuthGuard />}>
        <Route element={<AcceptInvitationRedirect />}>
          <Route element={<RootLayout />}>
            <Route index element={<LastAccessTeamRedirect />} />
            <Route path="team" element={<TeamLayout />}>
              <Route index element={<TeamRouters />} />
              <Route path=":team">
                <Route index element={<Navigate to="ai-settings" replace />} />
                <Route element={<AiSettingLayout />}>
                  <Route path="ai-settings/*" element={<AiSettingRouters currentTeam={currentTeam} />} />
                </Route>
                <Route element={<RoleGuard allowedRoles={[TeamRole.ADMIN]} userRole={currentTeam?.role ?? null} />}>
                  <Route element={<KnowledgeLayout />}>
                    <Route path="knowledge/*" element={<KnowledgeRouters />} />
                  </Route>
                </Route>
                <Route element={<MemberLayout />}>
                  <Route path="members/*" element={<MemberRouters />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="/interrupts" element={<Interrupts />} />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
