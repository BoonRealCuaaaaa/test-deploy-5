import type { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { IKnowledge } from '@/src/libs/interfaces/knowledge';

type KnowledgeSliceState = {
  knowledge: IKnowledge | undefined;
};

type KnowledgeSliceAction = {
  setKnowledge: (knowledge: IKnowledge) => void;
};

export type KnowledgeSlice = KnowledgeSliceState & KnowledgeSliceAction;

const initialState: KnowledgeSliceState = {
  knowledge: undefined,
};

export const createKnowledgeSlice: StateCreator<
  KnowledgeSliceState & KnowledgeSliceAction,
  [],
  [['zustand/immer', never]]
> = immer((set) => ({
  ...initialState,
  setKnowledge: (knowledge: IKnowledge) => {
    set((state) => {
      state.knowledge = knowledge;
    });
  },
}));
