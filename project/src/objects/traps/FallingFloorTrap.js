//落下する床

import Phaser from "phaser";
import TrapBase from "./TrapBase.js";

export default class FallingFloorTrap extends TrapBase {
  constructor(scene) {
    super(scene);
  }

  getDamage() {
    return 1;
  }

  onHit(player) {
    // 落下開始
  }
}