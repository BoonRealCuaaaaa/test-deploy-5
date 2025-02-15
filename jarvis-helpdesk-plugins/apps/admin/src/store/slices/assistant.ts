import type { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { IAssistantSettings } from '@/src/libs/interfaces/ai-setting';

type AssistantSliceState = {
  assistant: IAssistantSettings | undefined;
};

type AssistantSliceAction = {
  setAssistant: (assistant: IAssistantSettings) => void;
};

export type AssistantSlice = AssistantSliceState & AssistantSliceAction;

const initialState: AssistantSliceState = {
  assistant: undefined,
};

export const createAssistantSlice: StateCreator<
  AssistantSliceState & AssistantSliceAction,
  [],
  [['zustand/immer', never]]
> = immer((set) => ({
  ...initialState,
  setAssistant: (assistant: IAssistantSettings) => {
    set((state) => {
      state.assistant = assistant;
    });
  },
}));
