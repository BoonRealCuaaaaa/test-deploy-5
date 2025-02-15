import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { TeamKey } from '@/src/libs/constants/team';
import { ITeam } from '@/src/libs/interfaces/team';

type TeamStateSlice = {
  currentTeam: ITeam | null;
  teams: ITeam[];
};

type TeamSliceActions = {
  setCurrentTeam: (team: ITeam | null) => void;
  setTeams: (teams: ITeam[]) => void;
};

export type TeamSlice = TeamStateSlice & TeamSliceActions;

const initialState: TeamStateSlice = {
  currentTeam: null,
  teams: [],
};

export const createTeamSlice: StateCreator<TeamSlice, [], [['zustand/immer', never]]> = immer((set) => ({
  ...initialState,
  setCurrentTeam: (team: ITeam | null) => {
    set((state) => {
      state.currentTeam = team;
    });
    localStorage.setItem(TeamKey.LAST_ACCESSED_TEAM, team?.team.id ?? '');
  },
  setTeams: (teams: ITeam[]) => {
    set((state) => {
      state.teams = [...teams];
    });
  },
}));
