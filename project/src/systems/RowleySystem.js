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
    // プレイヤー
    this.player = this.add.image(200, 300, "player");
    this.player.setScale(1);

    // ボス
    this.boss = this.add.image(600, 250, "boss");
    this.boss.setScale(2.5);

    // デバッグ用：クリックで撃破演出
    this.input.on("pointerdown", () => {
      this.playBossDefeat();
    });
  }

  playBossDefeat() {
    // 連打防止
    if (this.defeated) return;
    this.defeated = true;

    // ①ボスしぼむ（核心演出）
    this.tweens.add({
      targets: this.boss,
      scale: 0.2,
      y: this.boss.y + 30,
      duration: 800,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.boss.destroy();
      }
    });

    // ②プレイヤーちょい拡大（勝利感）
    this.tweens.add({
      targets: this.player,
      scale: 1.4,
      duration: 500,
      ease: "Back.Out"
    });

    // ③軽い“ポヨン”演出（画面弾み感）
    this.cameras.main.shake(200, 0.005);

    // ④少し遅れて「やったー！」
    this.time.delayedCall(600, () => {
      this.showVictoryText();
    });
  }

  showVictoryText() {
    const text = this.add.text(400, 120, "やったー！", {
      fontSize: "48px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);

    // ニコニコ感のジャンプ
    this.tweens.add({
      targets: text,
      y: text.y - 20,
      duration: 300,
      yoyo: true,
      repeat: 1,
      ease: "Sine.easeOut"
    });

    // プレイヤーも軽く跳ねる
    this.tweens.add({
      targets: this.player,
      y: this.player.y - 10,
      duration: 200,
      yoyo: true,
      repeat: 1,
      ease: "Sine.easeOut"
    });

    // ⑤最後に軽く“余韻”
    this.time.delayedCall(1200, () => {
      this.add.text(400, 200, "CLEAR", {
        fontSize: "32px",
        color: "#ffff00"
      }).setOrigin(0.5);
    });
  }
}