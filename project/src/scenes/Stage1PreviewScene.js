import Phaser from "phaser";
import Stage1Map from "../stages/Stage1.js";

const TILE = 32;

export default class Stage1PreviewScene extends Phaser.Scene {
  constructor() {
    super("Stage1PreviewScene");
  }

  create() {
    console.log("Stage1Map =", Stage1Map);
    // =====================================================
    // カメラ（これがないと真っ黒になりやすい）
    // =====================================================
    this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.setZoom(0.8);
    this.cameras.main.centerOn(640, 480);

    // =====================================================
    // 地面
    // =====================================================
    (Stage1Map.groundList || []).forEach(p => {
      if (!p) return;

      this.add.rectangle(
        p.x * TILE + TILE / 2,
        p.y * TILE + TILE / 2,
        TILE,
        TILE,
        0x8b5a2b
      );
    });

 (Stage1Map.starList || []).forEach(p => {
      if (!p) return;

      this.add.star(
        p.x * TILE + TILE / 2,
        p.y * TILE + TILE / 2,
        5,
        TILE,
        TILE,
        0xffd700
      );
    });
    // =====================================================
    // 敵
    // =====================================================
    (Stage1Map.enemySpawnList || []).forEach(e => {
      if (!e) return;

      this.add.circle(
        e.x * TILE + TILE / 2,
        e.y * TILE + TILE / 2,
        10,
        0xff0000
      );
    });


    // =====================================================
    // プレイヤー
    // =====================================================
    const p = Stage1Map.playerSpawn;
    if (p) {
      this.add.circle(
        p.x * TILE + TILE / 2,
        p.y * TILE + TILE / 2,
        10,
        0x00ffff
      );
    }
// =====================================================
    // 追加：壊せるブロック
    // =====================================================
    (Stage1Map.blockList || []).forEach(b => {
      if (!b) return;

      const screenX = b.x * TILE + TILE / 2;
      const screenY = b.y * TILE + TILE / 2;

      // 1. ベースとなるレンガブロック（茶色系・外枠つきの矩形）
      this.add.rectangle(screenX, screenY, TILE - 2, TILE - 2, 0xd2691e);
    });
    // =====================================================
    // 追加：土管（緑の四角）
    // =====================================================
    (Stage1Map.pipeList || []).forEach(pipe => {
      if (!pipe) return;

      // 土管全体のピクセル幅と高さを計算
      const pipeWidth = pipe.width * TILE;
      const pipeHeight = pipe.height * TILE;

      // Phaserのrectangleは「中心座標」を指定する必要があるため、
      // 左上（x, y）から中心までの距離（幅・高さの半分）を足します。
      const screenX = pipe.x * TILE + pipeWidth / 2;
      const screenY = pipe.y * TILE + pipeHeight / 2;

      // 緑色（0x00ff00）で土管を描画（輪郭が見やすくなるよう全体より1〜2ピクセル小さくしています）
      this.add.rectangle(
        screenX,
        screenY,
        pipeWidth - 2,
        pipeHeight - 2,
        0x00aa00 // やや濃いめのマリオ風の緑（お好みで 0x00ff00 に変更してください）
      );
    });
    // =====================================================
    // 追加：ジャンプ台（罠ギミックを黄色の三角形で表示）
    // =====================================================
    (Stage1Map.trampolineList || []).forEach(t => {
      if (!t) return;

      const screenX = t.x * TILE + TILE / 2;
      const screenY = t.y * TILE + TILE / 2;

      // Phaserの三角形（Polygon）を使って、上向きのトゲ/ジャンプ台っぽく表現
      // 座標は中心（screenX, screenY）からの相対位置
      this.add.polygon(
        screenX, 
        screenY, 
        [
          0, -TILE / 2,           // 頂点（上中央）
          -TILE / 2, TILE / 2,    // 左下
          TILE / 2, TILE / 2      // 右下
        ], 
        0xffd700 // 金色・黄色
      );
    });
    // Stage1PreviewScene.js の create() 内に追加

    // =====================================================
    // 追加：隠しブロック（開発者向けに半透明でプレビュー表示）
    // =====================================================
    (Stage1Map.hiddenBlockList || []).forEach(hb => {
      if (!hb) return;

      const screenX = hb.x * TILE + TILE / 2;
      const screenY = hb.y * TILE + TILE / 2;

      // 通常のブロック（0xd2691e）とは違う色にして、
      // .setAlpha(0.4) で半透明にすることで「隠し要素」だとわかりやすくします
      const previewBlock = this.add.rectangle(
        screenX, 
        screenY, 
        TILE - 2, 
        TILE - 2, 
        0xff00ff // 目立つマゼンタ色
      );
      
      previewBlock.setAlpha(0.4); // 半透明化（0.0 が完全透明、1.0 が不透明）
    });

    // =====================================================
    // 追加：ハテナブロック（罠入り）
    // =====================================================
    (Stage1Map.questionBlockList || []).forEach(qb => {
      if (!qb) return;

      const screenX = qb.x * TILE + TILE / 2;
      const screenY = qb.y * TILE + TILE / 2;

      // 1. ブロックの土台（オレンジ色）
      this.add.rectangle(screenX, screenY, TILE - 2, TILE - 2, 0xffa500);

      // 2. 「？」の文字を真ん中に入れる
      this.add.text(screenX, screenY, "?", {
        fontSize: "20px",
        fontStyle: "bold",
        fill: "#ffffff"
      }).setOrigin(0.5); // 文字の中心をブロックの中心に合わせる
    });
    
    // =====================================================
    // ゴール
    // =====================================================
    
  }
}