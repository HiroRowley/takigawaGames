import Phaser from "phaser";
import Stage1 from "../stages/Stage1.js";

export default class StagePreviewScene extends Phaser.Scene {
  constructor() {
    super("StagePreviewScene");
  }

  create() {
    const stage = Stage1;
    const TILE = 32;

    // =====================================================
    // 地面
    // =====================================================
    stage.groundList.forEach((g) => {
      this.add.rectangle(
        g.x,
        g.y,
        g.width,
        g.height,
        0x666666,
        0.6
      );
    });

    // =====================================================
    // プレイヤー
    // =====================================================
    this.add.circle(stage.playerSpawn.x, stage.playerSpawn.y, 10, 0x00ff00);

    // =====================================================
    // 敵
    // =====================================================
    stage.enemySpawnList.forEach((obj) => {
      this.add.circle(obj.x, obj.y, 10, 0xff0000);
      this.add.text(obj.x + 5, obj.y, obj.name, { fontSize: "10px" });
    });

    // =====================================================
    // トラップ
    // =====================================================
    stage.trapList.forEach((obj) => {
      this.add.rectangle(
        obj.x,
        obj.y,
        20,
        20,
        obj.type === "HiddenTrap" ? 0x0000ff : 0xffff00,
        obj.visible === false ? 0.3 : 0.8
      );

      this.add.text(obj.x + 5, obj.y, obj.name, { fontSize: "10px" });
    });

    // =====================================================
    // コイン
    // =====================================================
    stage.coins.forEach((coin) => {
      this.add.circle(coin.x, coin.y, 6, 0xffd700);
      this.add.text(coin.x + 5, coin.y, "coin", { fontSize: "10px" });
    });

    // =====================================================
    // 土管
    // =====================================================
    stage.pipes.forEach((pipe) => {
      this.add.rectangle(
        pipe.x,
        pipe.y,
        pipe.width,
        pipe.height,
        0x008000,
        0.8
      );

      this.add.text(pipe.x - 10, pipe.y - 10, "pipe", {
        fontSize: "10px",
      });
    });

    // =====================================================
    // ゴール
    // =====================================================
    this.add.star(
      stage.goalPosition.x,
      stage.goalPosition.y,
      5,
      10,
      20,
      0x00ffff
    );
  }
}