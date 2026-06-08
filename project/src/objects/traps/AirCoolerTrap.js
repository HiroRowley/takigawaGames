//冷風機

import Phaser from "phaser";
import TrapBase from "./TrapBase.js";

export default class ColdFanTrap extends TrapBase {
  constructor(scene) {
    super(scene);
  }

  getDamage() {
    return 1;
  }

  onStay(player) {
    // 水・風を出す
  }
}