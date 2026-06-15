const CHARGE_DURATION = 1000;
const DASH_DURATION = 350;
const RECOVERY_DURATION = 300;
const DASH_SPEED = 1000;

export default class RowleyDashAttack {
  constructor(owner) {
    this.owner = owner;
  }

  start(player) {
    const owner = this.owner;
    if (!player || owner.isDashing || !owner.active) return;

    owner.isDashing = true;
    owner.body.setVelocity(0, 0);
    owner.setTint(0xff0000);
    owner.chargeTween = owner.scene.tweens.add({
      targets: owner,
      x: owner.x + 8,
      duration: 40,
      yoyo: true,
      repeat: -1,
    });

    owner.scene.time.delayedCall(CHARGE_DURATION, () => {
      if (!owner.active) return;

      owner.chargeTween?.stop();
      owner.x = Math.round(owner.x);
      owner.clearTint();

      const dx = player.x - owner.x;
      const dy = player.y - owner.y;
      const distance = Math.hypot(dx, dy);
      if (distance === 0) {
        owner.isDashing = false;
        return;
      }

      owner.body.setVelocity(
        (dx / distance) * DASH_SPEED,
        (dy / distance) * DASH_SPEED
      );

      owner.scene.time.delayedCall(DASH_DURATION, () => {
        if (!owner.active) return;
        owner.body.setVelocity(0, 0);

        owner.scene.time.delayedCall(RECOVERY_DURATION, () => {
          if (owner.active) owner.isDashing = false;
        });
      });
    });
  }
}
