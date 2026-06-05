import Phaser from "phaser";
import Stage3Map from "../stages/Stage3.js";

const TILE = 32;

export default class Stage3PreviewScene extends Phaser.Scene {
  constructor() {
    super("Stage3PreviewScene");
  }

  create() {
    console.log("Stage3Map =", Stage3Map);
   
    // =====================================================
    // カメラ（これがないと真っ黒になりやすい）
    // =====================================================
    this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.setZoom(0.8);
    this.cameras.main.centerOn(640, 480);

    // =====================================================
    // 地面
    // =====================================================
    (Stage3Map.groundList || []).forEach(p => {
      if (!p) return;

      this.add.rectangle(
        p.x * TILE + TILE / 2,
        p.y * TILE + TILE / 2,
        TILE,
        TILE,
        0x808080
      );
    });

    // =====================================================
    // 敵
    // =====================================================
    (Stage3Map.enemySpawnList || []).forEach(e => {
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
    (Stage3Map.gimmickList || []).forEach(g => {
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
    (Stage3Map.starList || []).forEach(s => {
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
    const p = Stage3Map.playerSpawn;
    if (p) {
      this.add.circle(
        p.x * TILE + TILE / 2,
        p.y * TILE + TILE / 2,
        10,
        0x00ffff
      );
    }
// =====================================================
    // 扉（追加）
    // =====================================================
    (Stage3Map.doorList || []).forEach(d => {
      if (!d) return;

      this.add.rectangle(
        d.x * TILE + TILE / 2,
        d.y * TILE + TILE / 2,
        TILE,
        TILE,
        0x333333 // 扉とわかるように茶色（あるいは目立つ色）
      );
    });

 // =====================================================
    // 扉（スマートな長方形をループで複数描画）
    // =====================================================
    (Stage3Map.doorList || []).forEach(d => {
      if (!d) return;

      // マス数からピクセル単位のサイズを計算
      const pixelWidth = d.width * TILE;
      const pixelHeight = d.height * TILE;

      this.add.rectangle(
        d.x * TILE + pixelWidth / 2,  // 中心のX座標
        d.y * TILE + pixelHeight / 2, // 中心のY座標
        pixelWidth,                   // 全体の横幅
        pixelHeight,                  // 全体の高さ
        0x404040                      // 濃い目の灰色
      );
    });

    // =====================================================
    // ゴール
    // =====================================================
    const g = Stage3Map.goal;
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