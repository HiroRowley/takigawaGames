import System from "../systems/System.js";
import GameState from "./GameState.js";

const instance = new GameState({
  maxHP: System.CONFIG.PLAYER.MAX_HP,
  paidHolidays: System.CONFIG.PLAYER.PAID_HOLIDAYS,
  startStage: System.CONFIG.START_STAGE,
});

export default instance;
