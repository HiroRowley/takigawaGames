import Phaser from "phaser";
import Stage2Map from "../stages/Stage2.js";

const TILE = 32;

export default class Stage2PreviewScene extends Phaser.Scene {
  constructor() {
    super("Stage2PreviewScene");
  }

  create() {
    console.log("Stage2Map =", Stage2Map);
    this.add.rectangle(100, 100, 50, 50, 0xff0000);
    // =====================================================
    // カメラ（これがないと真っ黒になりやすい）
    // =====================================================
    this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.setZoom(0.8);
    this.cameras.main.centerOn(640, 480);

    // =====================================================
    // 地面
    // =====================================================
    (Stage2Map.groundList || []).forEach(p => {
      if (!p) return;

      this.add.rectangle(
        p.x * TILE + TILE / 2,
        p.y * TILE + TILE / 2,
        TILE,
        TILE,
        0x8b5a2b
      );
    });

    // =====================================================
    // 敵
    // =====================================================
    (Stage2Map.enemySpawnList || []).forEach(e => {
      if (!e) return;

      this.add.circle(
        e.x * TILE + TILE / 2,
        e.y * TILE + TILE / 2,
        10,
        0xff0000
      );
    });

    // =====================================================
    // ギミック
    // =====================================================
    (Stage2Map.gimmickList || []).forEach(g => {
      if (!g) return;

      this.add.rectangle(
        g.x * TILE + TILE / 2,
        g.y * TILE + TILE / 2,
        TILE,
        TILE,
        0x00ffff
      );
    });

    // =====================================================
    // スター
    // =====================================================
    (Stage2Map.starList || []).forEach(s => {
      if (!s) return;

      this.add.star(
        s.x * TILE + TILE / 2,
        s.y * TILE + TILE / 2,
        5,
        6,
        12,
        0xffff00
      );
    });

    // =====================================================
    // プレイヤー
    // =====================================================
    const p = Stage2Map.playerSpawn;
    if (p) {
      this.add.circle(
        p.x * TILE + TILE / 2,
        p.y * TILE + TILE / 2,
        10,
        0x00ffff
      );
    }

    // =====================================================
    // ゴール
    // =====================================================
    const g = Stage2Map.goal;
    if (g) {
      this.add.star(
        g.x * TILE + TILE / 2,
        g.y * TILE + TILE / 2,
        5,
        6,
        12,
        0xffaa00
      );
    }
  }
}