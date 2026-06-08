import Phaser from "phaser";

export default class Isu extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.healAmount = 1;     // 回復量
    this.isUsed = false;     // 1回だけ回復させるフラグ
  }

  // =========================
  // 座った瞬間
  // =========================
  onSit(player) {
    if (this.isUsed) return;

    this.heal(player);
    this.isUsed = true;
  }

  // =========================
  // 回復処理本体
  // =========================
  heal(player) {
    // player.heal(this.healAmount); を想定
  }

  // =========================
  // 更新処理
  // =========================
  update() {}
}