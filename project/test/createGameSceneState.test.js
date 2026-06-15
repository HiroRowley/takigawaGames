import test from "node:test";
import assert from "node:assert/strict";

import createGameSceneState from "../src/scenes/createGameSceneState.js";

test("each stage starts with transient scene state reset", () => {
  const state = createGameSceneState(2);

  assert.deepEqual(state, {
    stageNumber: 2,
    _cleared: false,
    isGameOver: false,
    isClearing: false,
    isWarping: false,
    enemySpawnTimer: 0,
    timer: null,
    stageData: null,
    goalData: null,
  });
});

test("invalid stage numbers are rejected", () => {
  for (const value of [null, "", 0, -1, 1.5, Number.NaN]) {
    assert.throws(() => createGameSceneState(value));
  }
});
