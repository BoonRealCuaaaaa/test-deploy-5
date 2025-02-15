import { CallBackProps, Step, Styles } from 'react-joyride';
import { produce } from 'immer';
import type { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface IJoyRideState {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  tourActive: boolean;
  styles: Partial<Styles> | undefined;
  handleJoyrideCallback: (data: CallBackProps) => void;
}

type JoyrideStateSliceState = {
  joyrideState: IJoyRideState;
};

type JoyrideStateSliceAction = {
  setJoyrideState: (joyrideState: Partial<IJoyRideState>) => void;
};

export type JoyrideStateSlice = JoyrideStateSliceState & JoyrideStateSliceAction;

const initialState: JoyrideStateSliceState = {
  joyrideState: {
    run: false,
    stepIndex: 0,
    steps: [],
    tourActive: false,
    handleJoyrideCallback: () => undefined,
    styles: undefined,
  },
};

export const createJoyrideStateSlice: StateCreator<
  JoyrideStateSliceState & JoyrideStateSliceAction,
  [],
  [['zustand/immer', never]]
> = immer((set) => ({
  ...initialState,
  setJoyrideState: (joyrideState: Partial<IJoyRideState>) => {
    set(
      produce((state: JoyrideStateSliceState) => {
        state.joyrideState = { ...state.joyrideState, ...joyrideState };
      })
    );
  },
}));
