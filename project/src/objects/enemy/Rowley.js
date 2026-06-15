import EnemyBase from "./EnemyBase.js";
import RowleyBehavior from "./rowley/RowleyBehavior.js";
import RowleyDashAttack from "./rowley/RowleyDashAttack.js";
import RowleyLaserAttack from "./rowley/RowleyLaserAttack.js";

export default class Rowley extends EnemyBase {
  constructor(scene, x, y) {
    super(scene, x, y, "rowley", {
      animation: {
        frames: [0, 1, 0, 1],
        frameRate: 6,
      },
      idleFrame: 0,
      flipXWhenMovingRight: true,
    });

    this.setFrame(0);
    this.setDisplaySize(128, 168);
    this.body.setAllowGravity(true);

    this.speed = 300;
    this.attackPower = 100;
    this.keepDistance = 200;
    this.shakePower = 500;
    this.shakeInterval = 100;
    this.shakeTimer = 0;
    this.shakeVX = 0;
    this.shakeVY = 0;
    this.laserTimer = 0;
    this.dashTimer = 0;
    this.jumpTimer = 0;
    this.isDashing = false;

    this.laserAttack = new RowleyLaserAttack(this);
    this.dashAttack = new RowleyDashAttack(this);
    this.behavior = new RowleyBehavior(
      this,
      this.laserAttack,
      this.dashAttack
    );
  }

  die() {
    console.log("Rowleyは倒せない！");
  }

  update(player, time) {
    this.behavior.update(player, time);
  }
}
