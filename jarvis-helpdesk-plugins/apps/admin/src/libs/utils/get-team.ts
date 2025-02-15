import { TeamKey } from '../constants/team';

export const getLastAccessedTeam = () => {
  return localStorage.getItem(TeamKey.LAST_ACCESSED_TEAM);
};

export const removeTeamData = () => {
  localStorage.removeItem(TeamKey.LAST_ACCESSED_TEAM);
};
