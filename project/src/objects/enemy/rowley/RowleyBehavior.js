import Phaser from "phaser";

export default class RowleyBehavior {
  constructor(owner, laserAttack, dashAttack) {
    this.owner = owner;
    this.laserAttack = laserAttack;
    this.dashAttack = dashAttack;
  }

  update(player, time) {
    const owner = this.owner;
    if (!player || owner.isDashing) return;

    if (time > owner.laserTimer) {
      owner.laserTimer = time + 2000;
      this.laserAttack.fire("vertical", player);
    }

    const dx = player.x - owner.x;
    const dy = player.y - owner.y;
    const distance = Math.hypot(dx, dy);

    if (distance > owner.keepDistance) {
      owner.body.setVelocityX((dx / distance) * owner.speed);
      this.tryJump(time);
    } else {
      this.shake(time);
    }

    owner.setFlipX(dx < 0);

    if (time > owner.dashTimer) {
      owner.dashTimer = time + 3000;
      this.dashAttack.start(player);
    }
  }

  tryJump(time) {
    const owner = this.owner;
    if (time <= owner.jumpTimer || !owner.body.blocked.down) return;

    owner.jumpTimer = time + Phaser.Math.Between(800, 2000);
    owner.body.setVelocityY(-700);
  }

  shake(time) {
    const owner = this.owner;
    if (time > owner.shakeTimer) {
      owner.shakeTimer = time + owner.shakeInterval;
      owner.shakeVX = Phaser.Math.Between(-owner.shakePower, owner.shakePower);
      owner.shakeVY = Phaser.Math.Between(-owner.shakePower, owner.shakePower);
    }

    owner.body.setVelocity(owner.shakeVX, owner.shakeVY);
  }
}
