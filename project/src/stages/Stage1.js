const TILE = 32;

const W = 46;
const H = 34;

const ground = [];
const block = [];
const hiddenBlock = [];
const questionBlock = [];

// =====================================================
// 地面タイル管理用
// =====================================================
const groundMap = new Map();

function key(x, y) {
  return `${x},${y}`;
}

// =====================================================
// ヘルパー（範囲塗りつぶし）
// =====================================================
function fill(x1, x2, y1, y2) {

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {

      const tile = {
        x,
        y,

        // デフォルト
        collideUp: true,
        collideDown: true,
        collideLeft: true,
        collideRight: true,
      };

      // Mapにも保存
      groundMap.set(key(x, y), tile);

      // ★これが重要
      ground.push(tile);
    }
  }
}

// =====================================================
// ?ブロック
// =====================================================
function fillQuestionBlocks(x1, x2, y1, y2) {

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {

      questionBlock.push({
        x,
        y,
        itemType: "trap",
        isHit: false
      });
    }
  }
}

// =========================
// 地面生成
// =========================

// --- 1. 最下部 ---
fill(0, 44, 25, 31);
fill(47, 49, 25, 31);

fill(9, 44, 24, 24);
fill(10, 44, 23, 23);
fill(11, 44, 22, 22);
fill(13, 44, 21, 21);

fill(18, 21, 17, 20);

fill(27, 44, 18, 20);
fill(28, 44, 17, 18);

fill(35, 44, 14, 17);

fill(39, 41, 11, 14);

fill(47, 49, 8, 30);

// 土管
fill(28, 30, 14, 16);

// =========================
// デバッグ確認
// =========================
console.log("[Stage1] ground count =", ground.length);

// =========================
// ステージデータ
// =========================

const Stage1 = {

  TILE,

  groundList: ground,

  blockList: block,

  hiddenBlockList: hiddenBlock,

  // =========================
  // プレイヤー初期位置
  // =========================
  playerSpawn: {
    x: 5,
    y: 22,
  },

  pipeWarpList: [

        {
            enterX: 29,
            enterY: 14,

            exitX: 2,
            exitY: -10
        },
        {
            enterX: 28,
            enterY: 14,

            exitX: 2,
            exitY: -10
        },
        {
            enterX: 30,
            enterY: 14,

            exitX: 2,
            exitY: -10
        }

    ],

  // =========================
  // 敵
  // =========================
  enemySpawnList: [

    {
      x: 17,
      y: 19,
      type: "noda"
    },

    {
      x: 29,
      y: 15,
      type: "shimba"
    },

    {
      x: 33,
      y: 15,
      type: "yoshida"
    },
  ],

  // =========================
  // 土管
  // =========================
  pipeList: [

    {
      x: 28,
      y: 14,
      width: 3,
      height: 3,
    }
  ],

  // =========================
  // トラップ
  // =========================
  trapList: [
    {
      x: 2,
      y: 5,
      type: "cloud"
    },

    {
      x: 26,
      y: 19,
      type: "bane"
    },

    /*{
      x: 20,
      y: 11,
      type: "itemBlock",
      itemType: "empty"
    },*/
    {
      x: 42.5,
      y: 7,
      type: "itemBlock",
      itemType: "empty",
      hidden: true
    },
    {
      x: 41.5,
      y: 7,
      type: "itemBlock",
      itemType: "empty",
      hidden: true
    },


    {
      x: 41.5,
      y: 9.5,
      type: "itemBlock",
      itemType: "empty",
      hidden: true
    },
    {
      x: 42.5,
      y: 9.5,
      type: "itemBlock",
      itemType: "empty",
      hidden: true
    },
    {
      x: 43.5,
      y: 9.5,
      type: "itemBlock",
      itemType: "empty",
      hidden: true
    },
    {
      x: 44.5,
      y: 9.5,
      type: "itemBlock",
      itemType: "empty",
      hidden: true
    },
    {
      x: 45.5,
      y: 9.5,
      type: "itemBlock",
      itemType: "empty",
      hidden: true
    },

    {
      x: 40.5,
      y: 7,
      type: "itemBlock",
      itemType: "jousisu"
    }
  ],

  // =========================
  // ゴール
  // =========================
  goal: {

    x: 50,
    y: -5,

    width: 0.3,
    height: 30,

    isVisible: false
  },
};

export default Stage1;