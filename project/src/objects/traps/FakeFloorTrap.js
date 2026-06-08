//フェイク床

import Phaser from "phaser";
import TrapBase from "./TrapBase.js";

export default class FakeSafeFloorTrap extends TrapBase {
  constructor(scene) {
    super(scene);
  }

  onHit(player) {
    // 落下 or ダメージ
  }
}