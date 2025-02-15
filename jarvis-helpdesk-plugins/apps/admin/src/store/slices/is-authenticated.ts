import type { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type IsAuthenticatedSliceState = {
  isAuthenticated: boolean;
};

type IsAuthenticatedSliceAction = {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export type IsAuthenticatedSlice = IsAuthenticatedSliceState & IsAuthenticatedSliceAction;

const initialState: IsAuthenticatedSliceState = {
  isAuthenticated: false,
};

export const createIsAuthenticatedSlice: StateCreator<
  IsAuthenticatedSliceState & IsAuthenticatedSliceAction,
  [],
  [['zustand/immer', never]]
> = immer((set) => ({
  ...initialState,
  setIsAuthenticated: (isAuthenticated: boolean) => {
    set((state) => {
      state.isAuthenticated = isAuthenticated;
    });
  },
}));
