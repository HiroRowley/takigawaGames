import test from "node:test";
import assert from "node:assert/strict";

import StageRepository from "../src/scenes/game/StageRepository.js";

test("StageRepository returns normalized stage data", () => {
  const repository = new StageRepository();
  const stage = repository.get(2);

  assert.equal(stage.tileSize, 32);
  assert.ok(Array.isArray(stage.groundList));
  assert.ok(Array.isArray(stage.enemySpawnList));
  assert.ok(Array.isArray(stage.trapList));
  assert.deepEqual(stage.playerSpawn, { x: 2, y: 18 });
});

test("StageRepository rejects unregistered stages", () => {
  const repository = new StageRepository();
  assert.throws(() => repository.get(99), /not registered/);
});
