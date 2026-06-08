//椅子（居眠り）

import Phaser from "phaser";
import TrapBase from "./TrapBase.js";

export default class ChairSleepTrap extends TrapBase {
  constructor(scene) {
    super(scene);
    this.sleepCount = 0;
  }

  onEnter(player) {
    // 座る
  }

  onStay(player) {
    // 居眠り増加
  }

  onExit(player) {
    // 離れる
  }
}