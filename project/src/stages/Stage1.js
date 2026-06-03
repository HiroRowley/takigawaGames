const TILE = 32;

/**
 * Stage1（完全一致版）
 * =========================================================
 * ■ 役割
 * - 画像ベース地形を1マス単位で完全再現
 * - GameSceneでそのままCollider生成可能
 */

const Stage1 = {
  // =====================================================
  // プレイヤースポーン
  // =====================================================
  playerSpawn: {
    x: 1 * TILE,
    y: 20 * TILE,
  },

  // =====================================================
  // 敵
  // =====================================================
  enemySpawnList: [
    {
      type: "GoombaEnemy",
      name: "noda",
      x: 7 * TILE,
      y: 18 * TILE,
    },
    {
      type: "GoombaEnemy",
      name: "yoshida",
      x: 21 * TILE,
      y: 18 * TILE,
    },
  ],

  // =====================================================
  // トラップ
  // =====================================================
  trapList: [
    {
      type: "DeathJumpPad",
      name: "jam",
      x: 13 * TILE,
      y: 19 * TILE,
    },
    {
      type: "HiddenTrap",
      name: "kakushi",
      x: 31 * TILE,
      y: 19 * TILE,
      visible: false,
    },
  ],

  // =====================================================
  // コイン
  // =====================================================
  coins: [
    {
      name: "coin_1",
      x: 10 * TILE,
      y: 15 * TILE,
    },
  ],

  // =====================================================
  // 土管（地形）
  // =====================================================
  pipes: [
    {
      name: "pipe_shimba",
      x: 16 * TILE,
      y: 16 * TILE,
      width: TILE,
      height: 2 * TILE,
    },
  ],

  // =====================================================
  // 地面（完全一致変換済み）
  // =====================================================
  groundList: [
    // =========================
    // y = 21（メイン床）
    // =========================
    { x: 0 * TILE, y: 21 * TILE },
    { x: 1 * TILE, y: 21 * TILE },
    { x: 2 * TILE, y: 21 * TILE },
    { x: 3 * TILE, y: 21 * TILE },
    { x: 4 * TILE, y: 21 * TILE },
    { x: 6 * TILE, y: 21 * TILE },
    { x: 7 * TILE, y: 21 * TILE },
    { x: 9 * TILE, y: 21 * TILE },
    { x: 10 * TILE, y: 21 * TILE },
    { x: 11 * TILE, y: 21 * TILE },
    { x: 12 * TILE, y: 21 * TILE },
    { x: 13 * TILE, y: 21 * TILE },
    { x: 17 * TILE, y: 21 * TILE },
    { x: 18 * TILE, y: 21 * TILE },
    { x: 21 * TILE, y: 21 * TILE },
    { x: 22 * TILE, y: 21 * TILE },
    { x: 23 * TILE, y: 21 * TILE },
    { x: 24 * TILE, y: 21 * TILE },
    { x: 25 * TILE, y: 21 * TILE },
    { x: 27 * TILE, y: 21 * TILE },
    { x: 28 * TILE, y: 21 * TILE },
    { x: 29 * TILE, y: 21 * TILE },
    { x: 30 * TILE, y: 21 * TILE },
    { x: 31 * TILE, y: 21 * TILE },
    { x: 33 * TILE, y: 21 * TILE },
    { x: 34 * TILE, y: 21 * TILE },
    { x: 35 * TILE, y: 21 * TILE },

    // =========================
    // y = 20（段差）
    // =========================
    { x: 6 * TILE, y: 20 * TILE },
    { x: 7 * TILE, y: 20 * TILE },
    { x: 16 * TILE, y: 20 * TILE },
    { x: 17 * TILE, y: 20 * TILE },
    { x: 18 * TILE, y: 20 * TILE },
    { x: 19 * TILE, y: 20 * TILE },
    { x: 20 * TILE, y: 20 * TILE },
    { x: 23 * TILE, y: 20 * TILE },
    { x: 24 * TILE, y: 20 * TILE },
    { x: 25 * TILE, y: 20 * TILE },
    { x: 26 * TILE, y: 20 * TILE },

    // =========================
    // y = 19（中段）
    // =========================
    { x: 6 * TILE, y: 19 * TILE },
    { x: 7 * TILE, y: 19 * TILE },
    { x: 16 * TILE, y: 19 * TILE },
    { x: 17 * TILE, y: 19 * TILE },
    { x: 26 * TILE, y: 19 * TILE },
    { x: 27 * TILE, y: 19 * TILE },
    { x: 28 * TILE, y: 19 * TILE },
    { x: 29 * TILE, y: 19 * TILE },
    { x: 31 * TILE, y: 19 * TILE },
    { x: 32 * TILE, y: 19 * TILE },
    { x: 33 * TILE, y: 19 * TILE },
    { x: 34 * TILE, y: 19 * TILE },
    { x: 35 * TILE, y: 19 * TILE },

    // =========================
    // y = 18（高台）
    // =========================
    { x: 31 * TILE, y: 18 * TILE },
    { x: 32 * TILE, y: 18 * TILE },
    { x: 33 * TILE, y: 18 * TILE },
    { x: 34 * TILE, y: 18 * TILE },
    { x: 35 * TILE, y: 18 * TILE },

    // =========================
    // 縦柱
    // =========================
    { x: 35 * TILE, y: 17 * TILE },
    { x: 35 * TILE, y: 16 * TILE },
    { x: 35 * TILE, y: 15 * TILE },
    { x: 35 * TILE, y: 14 * TILE },
    { x: 35 * TILE, y: 13 * TILE },
    { x: 35 * TILE, y: 12 * TILE },
    { x: 35 * TILE, y: 11 * TILE },
    { x: 35 * TILE, y: 10 * TILE },
    { x: 35 * TILE, y: 9 * TILE },
  ],

  // =====================================================
  // ゴール
  // =====================================================
  goalPosition: {
    x: 33 * TILE,
    y: 14 * TILE,
  },

  // =====================================================
  // ステージ設定
  // =====================================================
  timeLimit: 60,
};

export default Stage1;