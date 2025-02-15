import { create } from 'zustand';

import { AssistantSlice, createAssistantSlice } from './slices/assistant';
import { createIsAuthenticatedSlice, IsAuthenticatedSlice } from './slices/is-authenticated';
import { createJoyrideStateSlice, JoyrideStateSlice } from './slices/joyride-state';
import { createKnowledgeSlice, KnowledgeSlice } from './slices/knowledge';
import { createTeamSlice, TeamSlice } from './slices/team';
import { createUserSlice, UserSlice } from './slices/user';

type AppStore = UserSlice & AssistantSlice & KnowledgeSlice & IsAuthenticatedSlice & JoyrideStateSlice & TeamSlice;

const useAppStore = create<AppStore>((...args) => ({
  ...createUserSlice(...args),
  ...createAssistantSlice(...args),
  ...createKnowledgeSlice(...args),
  ...createIsAuthenticatedSlice(...args),
  ...createJoyrideStateSlice(...args),
  ...createTeamSlice(...args),
}));

export default useAppStore;
