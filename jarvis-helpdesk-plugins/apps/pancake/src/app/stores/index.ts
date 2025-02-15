import { create } from 'zustand';

import { createExampleSlice, ExampleSlice } from './slices/example';
import { createUserSlice, UserSlice } from './slices/user';

type AppStore = ExampleSlice & UserSlice;

const useAppStore = create<AppStore>((...args) => ({
  ...createExampleSlice(...args),
  ...createUserSlice(...args),
}));

export default useAppStore;
