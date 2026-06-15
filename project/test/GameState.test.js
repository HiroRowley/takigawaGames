import test from "node:test";
import assert from "node:assert/strict";

import GameState from "../src/managers/GameState.js";

function createState() {
  return new GameState({ maxHP: 3, paidHolidays: 1, startStage: 1 });
}

test("setHP decreases HP and clamps it at zero", () => {
  const state = createState();

  state.setHP(state.getHP() - 1);
  assert.equal(state.getHP(), 2);

  state.setHP(-100);
  assert.equal(state.getHP(), 0);
});

test("numeric setters reject null, empty strings, NaN, and infinity", () => {
  const state = createState();

  for (const value of [null, "", Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => state.setHP(value), TypeError);
    assert.throws(() => state.setPaidHolidays(value), TypeError);
  }
});

test("paid holidays may become negative after repeated deaths", () => {
  const state = createState();

  state.resetPlayerData();
  state.resetPlayerData();

  assert.equal(state.getPaidHolidays(), -1);
});

test("stage numbers must be positive integers", () => {
  const state = createState();

  for (const value of [null, "", 0, -1, 1.5, Number.NaN]) {
    assert.throws(() => state.setCurrentStage(value));
  }

  state.setCurrentStage(3);
  assert.equal(state.getCurrentStage(), 3);
});
