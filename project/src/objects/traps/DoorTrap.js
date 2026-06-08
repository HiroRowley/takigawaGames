//どこでもドア

import Phaser from "phaser";
import TrapBase from "./TrapBase.js";

export default class AnywhereDoorTrap extends TrapBase {
  constructor(scene) {
    super(scene);
  }

  onHit(player) {
    // タイへワープ
  }
}