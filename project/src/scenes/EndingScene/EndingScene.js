import Phaser from "phaser";

export default class EndingScene extends Phaser.Scene {
  constructor() {
    super("EndingScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    const normalStyle = { fontSize: "24px", color: "#ffffff", align: "center" };
    const titleStyle = {
      fontSize: "32px",
      color: "#aaaaaa",
      align: "center",
      fontStyle: "italic",
    };
    const emphasisStyle = {
      fontSize: "36px",
      color: "#ffff00",
      align: "center",
      fontStyle: "bold",
    };

    const credits = this.add.container(this.scale.width / 2, this.scale.height, [
      this.add
        .text(
          0,
          0,
          "作成者\n\n田崎：stagesクラス enemyクラス\n\nローリー：ZOSSローリー レビュー全般\n\n上野：scenesクラス isu.js",
          normalStyle
        )
        .setOrigin(0.5),
      this.add
        .text(0, 250, "使用言語：JavaScript\n\nフレームワーク：Phaser", normalStyle)
        .setOrigin(0.5),
      this.add
        .text(0, 400, "使用素材：魔王魂 効果音ラボ", normalStyle)
        .setOrigin(0.5),
      this.add.text(0, 550, "- Special Thanks -", titleStyle).setOrigin(0.5),
      this.add
        .text(0, 650, "滝川 雅晴 さん\n\nテストプレイしてくれた26卒の皆様", emphasisStyle)
        .setOrigin(0.5),
    ]);

    this.tweens.add({
      targets: credits,
      y: -1000,
      duration: 15000,
      onComplete: () => this.scene.start("VideoScene"),
    });
  }
}
