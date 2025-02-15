import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type UserSlice = {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  isRegisteredDomain: boolean;
  setIsRegisteredDomain: (isRegisteredDomain: boolean) => void;
};

export const createUserSlice: StateCreator<UserSlice, [], [['zustand/immer', never]]> = immer((set) => ({
  isLogin: false,
  setIsLogin: (isLogin: boolean) => {
    set((state: UserSlice) => {
      state.isLogin = isLogin;
    });
  },
  isRegisteredDomain: false,
  setIsRegisteredDomain: (isRegisteredDomain: boolean) => {
    set((state: UserSlice) => {
      state.isRegisteredDomain = isRegisteredDomain;
    });
  },
}));
