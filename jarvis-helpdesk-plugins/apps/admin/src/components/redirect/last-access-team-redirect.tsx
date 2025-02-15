import { Navigate } from 'react-router-dom';

import useTeams from '@/src/hooks/use-teams';

import FullscreenLoader from '../full-screen-loader';

const LastAccessTeamRedirect = () => {
  const { currentTeam, isLoadingTeams } = useTeams();

  if (isLoadingTeams) {
    return <FullscreenLoader />;
  }

  return currentTeam ? (
    <Navigate to={`/team/${currentTeam.team.id}/ai-settings`} replace />
  ) : (
    <Navigate to="/team" replace />
  );
};

export default LastAccessTeamRedirect;
