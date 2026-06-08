//天空に飛ばされる

import Phaser from "phaser";
import TrapBase from "./TrapBase.js";

export default class SkyBounceTrap extends TrapBase {
  constructor(scene) {
    super(scene);
  }

  onHit(player) {
    // 上に吹き飛ばす
  }
}