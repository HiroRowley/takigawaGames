function requireFiniteNumber(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }

  return value;
}

function requireStageNumber(value) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError("stage must be a positive integer.");
  }

  return value;
}

export default class GameState {
  constructor({ maxHP, paidHolidays, startStage }) {
    this.maxHP = Math.max(0, requireFiniteNumber(maxHP, "maxHP"));
    this.hp = this.maxHP;
    this.paidHolidays = requireFiniteNumber(paidHolidays, "paidHolidays");
    this.currentStage = requireStageNumber(startStage);
    this.respawnStage = this.currentStage;
    this.holidayCounter = 1;
    this.lateCount = 0;
  }

  getHP() {
    return this.hp;
  }

  setHP(value) {
    this.hp = 3//Math.max(0, requireFiniteNumber(value, "hp"));
  }

  getPaidHolidays() {
    return this.paidHolidays;
  }

  setPaidHolidays(value) {
    this.paidHolidays = requireFiniteNumber(value, "paidHolidays");
  }

  getCurrentStage() {
    return this.currentStage;
  }

  setCurrentStage(value) {
    const stage = requireStageNumber(value);
    this.currentStage = stage;
    this.respawnStage = stage;
  }

  resetPlayerData() {
    this.paidHolidays--;
    this.hp = this.maxHP;
    this.currentStage = this.respawnStage;
    this.lateCount++;
  }

  getLateCount() {
    return this.lateCount;
  }
}
