// Pull-up rep counter using vertical wrist-to-shoulder distance

export function pullupCounter(landmarks, state) {
  if (!landmarks) return state;

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  // Use average shoulder + wrist to reduce noise
  const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
  const wristY = (leftWrist.y + rightWrist.y) / 2;

  // Vertical difference
  const distance = wristY - shoulderY;

  // Thresholds (tweak as needed)
  const bottomThreshold = 0.20; // wrists clearly below shoulders
  const topThreshold = 0.02; // wrists almost at shoulder height

  // --- STATE MACHINE LOGIC ---

  // Detect bottom start position
  if (!state.inRep && distance > bottomThreshold) {
    state.stage = "bottom";
  }

  // Detect rising to the top
  if (state.stage === "bottom" && distance < topThreshold) {
    state.stage = "top";
    state.inRep = true;
  }

  // Detect complete rep when returning down
  if (state.inRep && distance > bottomThreshold) {
    state.count += 1;
    state.stage = "bottom";
    state.inRep = false;
  }

  return state;
}

export function initialPullupState() {
  return {
    count: 0,
    stage: "bottom",
    inRep: false
  };
}
