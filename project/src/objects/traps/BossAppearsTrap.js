//ブロックを叩いたら上司が出現

import Phaser from "phaser";
import TrapBase from "./TrapBase.js";

export default class BossSpawnBlockTrap extends TrapBase {
  constructor(scene) {
    super(scene);
  }

  onHit(player) {
    // 上司出現
  }
}