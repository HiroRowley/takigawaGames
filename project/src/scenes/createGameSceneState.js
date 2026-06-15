export default function createGameSceneState(stageNumber) {
  if (!Number.isInteger(stageNumber) || stageNumber < 1) {
    throw new RangeError("stageNumber must be a positive integer.");
  }

  return {
    stageNumber,
    _cleared: false,
    isGameOver: false,
    isClearing: false,
    isWarping: false,
    enemySpawnTimer: 0,
    timer: null,
    stageData: null,
    goalData: null,
  };
}
