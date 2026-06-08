//初期地点に戻る

import Phaser from "phaser";
import TrapBase from "./TrapBase.js";

export default class ResetPositionTrap extends TrapBase {
  constructor(scene) {
    super(scene);
  }

  onHit(player) {
    // 初期位置へ戻す
  }
}