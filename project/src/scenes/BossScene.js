import Phaser from "phaser";

export default class BossScene extends Phaser.Scene {
  constructor() {
    super("BossScene");
  }

  preload() {
    this.load.image("boss", "asset/rowley/animation/rowley01.png");
    this.load.image("player", "asset/takigawa/Animation/takigawaWalk10.png");
  }

  create() {
    // 状態管理
    this.defeated = false;

    // プレイヤー
    this.player = this.add.image(200, 300, "player");
    this.player.setScale(1);

    // ボス
    this.boss = this.add.image(600, 250, "boss");
    this.boss.setScale(2.5);

    // ちょい演出（登場感）
    this.cameras.main.fadeIn(300, 0, 0, 0);

    // デバッグ用（クリックで撃破）
    this.input.on("pointerdown", () => {
      this.playBossDefeat();
    });
  }

  update(time, delta) {
    // ここに後でRowleySystemつなげてもOK
  }

  playBossDefeat() {
    if (this.defeated) return;
    this.defeated = true;

    // ■①画面フラッシュ（勝利感）
    this.cameras.main.flash(150, 255, 255, 255);

    // ■②ボスしぼむ演出
    this.tweens.add({
      targets: this.boss,
      scale: 0.2,
      y: this.boss.y + 40,
      duration: 800,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.boss.destroy();
      }
    });

    // ■③プレイヤー拡大（勝利感）
    this.tweens.add({
      targets: this.player,
      scale: 1.4,
      duration: 500,
      ease: "Back.Out"
    });

    // ■④画面ちょい揺れ
    this.cameras.main.shake(200, 0.005);

    // ■⑤やったー表示
    this.time.delayedCall(600, () => {
      this.showVictory();
    });
  }

  showVictory() {
    const text = this.add.text(400, 120, "やったー！", {
      fontSize: "48px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);

    // テキスト跳ねる
    this.tweens.add({
      targets: text,
      y: text.y - 20,
      duration: 300,
      yoyo: true,
      repeat: 1,
      ease: "Sine.easeOut"
    });

    // プレイヤーも軽くジャンプ
    this.tweens.add({
      targets: this.player,
      y: this.player.y - 15,
      duration: 200,
      yoyo: true,
      repeat: 1,
      ease: "Sine.easeOut"
    });

    // ■⑥CLEAR表示
    this.time.delayedCall(1000, () => {
      this.add.text(400, 220, "CLEAR", {
        fontSize: "32px",
        color: "#ffff00"
      }).setOrigin(0.5);
    });

    // ■⑦少し待ってGameSceneへ戻す（任意）
    this.time.delayedCall(2500, () => {
      // this.scene.start("GameScene");
      // ↑必要なら有効化
    });
  }
}