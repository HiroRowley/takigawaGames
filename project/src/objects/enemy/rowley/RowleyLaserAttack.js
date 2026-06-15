import Phaser from "phaser";

const WARNING_DURATION = 800;
const LASER_DURATION = 1000;

export default class RowleyLaserAttack {
  constructor(owner) {
    this.owner = owner;
  }

  fire(type, player) {
    if (!this.owner.active || !player?.body) return;

    switch (type) {
      case "vertical":
        this.fireVertical(player);
        break;
      case "horizontal":
        this.fireHorizontal();
        break;
      case "diagonal":
        this.fireDiagonal();
        break;
      default:
        throw new RangeError(`Unknown Rowley laser type: ${type}`);
    }
  }

  fireVertical(player) {
    const scene = this.owner.scene;
    const futureX = player.x + player.body.velocity.x * 0.5;
    const x = Phaser.Math.Clamp(
      futureX + Phaser.Math.Between(-100, 100),
      100,
      2000
    );
    const warning = scene.add.rectangle(x, 300, 4, 600, 0xff0000, 0.4);

    scene.time.delayedCall(WARNING_DURATION, () => {
      if (!this.canActivate(warning)) return;

      warning.destroy();
      scene.sound.play("laser", { volume: 1 });
      this.activate(scene.add.rectangle(x, 300, 40, 600, 0xff0000, 1));
    });
  }

  fireHorizontal() {
    const scene = this.owner.scene;
    const y = Phaser.Math.Between(100, 500);
    const warning = scene.add.rectangle(400, y, 800, 4, 0xff0000, 0.4);

    scene.time.delayedCall(WARNING_DURATION, () => {
      if (!this.canActivate(warning)) return;

      warning.destroy();
      this.activate(scene.add.rectangle(400, y, 800, 40, 0xff0000, 1));
    });
  }

  fireDiagonal() {
    const scene = this.owner.scene;
    const warnings = [];

    for (let index = -5; index <= 5; index++) {
      const warning = scene.add.rectangle(
        400 + index * 40,
        300 + index * 40,
        80,
        4,
        0xff0000,
        0.4
      );
      warning.rotation = Phaser.Math.DegToRad(45);
      warnings.push(warning);
    }

    scene.time.delayedCall(WARNING_DURATION, () => {
      warnings.forEach((warning) => warning.active && warning.destroy());
      if (!this.owner.active) return;

      for (let index = -5; index <= 5; index++) {
        const laser = scene.add.rectangle(
          400 + index * 40,
          300 + index * 40,
          120,
          20,
          0xff0000,
          1
        );
        laser.rotation = Phaser.Math.DegToRad(45);
        this.activate(laser);
      }
    });
  }

  canActivate(warning) {
    return this.owner.active && warning.active;
  }

  activate(laser) {
    const scene = this.owner.scene;
    scene.physics.add.existing(laser);
    laser.body.setAllowGravity(false);
    laser.getDamage = () => 9999;
    scene.lasers.add(laser);

    scene.time.delayedCall(LASER_DURATION, () => {
      if (laser.active) laser.destroy();
    });
  }
}
