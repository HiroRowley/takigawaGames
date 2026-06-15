import test from "node:test";
import assert from "node:assert/strict";

import Stage1 from "../src/stages/Stage1.js";
import Stage2 from "../src/stages/Stage2.js";
import Stage3 from "../src/stages/Stage3.js";
import validateStageData from "../src/stages/validateStageData.js";

test("all registered stage data is valid", () => {
  assert.equal(validateStageData(Stage1, 1), Stage1);
  assert.equal(validateStageData(Stage2, 2), Stage2);
  assert.equal(validateStageData(Stage3, 3), Stage3);
});

test("missing player spawn fails with a clear error", () => {
  assert.throws(
    () => validateStageData({ TILE: 32, groundList: [] }, 9),
    /playerSpawn/
  );
});

test("invalid arrays and goal dimensions are rejected", () => {
  assert.throws(() =>
    validateStageData(
      { TILE: 32, playerSpawn: { x: 0, y: 0 }, groundList: null },
      9
    )
  );

  assert.throws(() =>
    validateStageData(
      {
        TILE: 32,
        playerSpawn: { x: 0, y: 0 },
        goal: { x: 1, y: 1, width: 0, height: 1 },
      },
      9
    )
  );
});
