import { pullupCounter, initialPullupState } from "./pose/pullupCounter";
// later you’ll add pushupCounter, squatCounter, etc.

export const exerciseCounterMap = {
  "pull-up": {
    counter: pullupCounter,
    initial: initialPullupState
  },
  "pullups": {
    counter: pullupCounter,
    initial: initialPullupState
  },
  "pull ups": {
    counter: pullupCounter,
    initial: initialPullupState
  },
};
