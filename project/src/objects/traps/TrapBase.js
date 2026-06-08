import Phaser from 'phaser';

export default class TrapBase extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.attackPower = 1; // デフォルトダメージ
  }

  // =========================
  // ダメージ処理
  // =========================
  getDamage(player) {
    return this.attackPower;
  }

  // =========================
  // 接触時
  // =========================
  onHit(player) {
    player.takeDamage(this.attackPower);
  }

  // =========================
  // 接触開始
  // =========================
  onEnter(player) {}

  // =========================
  // 接触中
  // =========================
  onStay(player) {}

  // =========================
  // 接触終了
  // =========================
  onExit(player) {}

  // =========================
  // 更新処理
  // =========================
  update() {}
}