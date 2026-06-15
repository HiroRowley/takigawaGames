import test from "node:test";
import assert from "node:assert/strict";

import GameFlowController from "../src/scenes/game/GameFlowController.js";

function createScene(stageNumber) {
  const calls = [];
  return {
    calls,
    stageNumber,
    _cleared: false,
    sound: { stopAll: () => calls.push("stopAudio") },
    physics: { pause: () => calls.push("pause") },
    input: { enabled: true },
    scene: {
      start: (key, data) => calls.push(["start", key, data]),
      launch: (key, data) => calls.push(["launch", key, data]),
    },
  };
}

test("nextStage advances once and updates game state", () => {
  const scene = createScene(2);
  const stages = [];
  const controller = new GameFlowController(scene, {
    setCurrentStage: (stage) => stages.push(stage),
  });

  controller.nextStage();
  controller.nextStage();

  assert.deepEqual(stages, [3]);
  assert.equal(
    scene.calls.filter((call) => Array.isArray(call) && call[0] === "start")
      .length,
    1
  );
});

test("Stage 3 launches the ending transition", () => {
  const scene = createScene(3);
  const controller = new GameFlowController(scene, {});

  controller.nextStage();

  assert.equal(scene.input.enabled, false);
  assert.deepEqual(scene.calls.at(-1), [
    "launch",
    "StageClearTransitionScene",
    { next: "OfficeScene" },
  ]);
});
