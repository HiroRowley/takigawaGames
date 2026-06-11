

const TILE = 32;

const W = 46;
const H = 34;

const ground = [];
const block = [];
const hiddenBlock = [];
const questionBlock = [];

// =========================
// ヘルパー（範囲塗りつぶし）
// =========================
function fill(x1, x2, y1, y2) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      ground.push({ x, y });
    }
  }
}
// ↓ 追加：壊せるブロック用の範囲塗りつぶしヘルパー
function fillBlocks(x1, x2, y1, y2) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      block.push({ x, y });
    }
  }
}

// ★修正：隠しブロック用も「縦の範囲」を指定できるように統一！
/*function fillHiddenBlocks(x1, x2, y1, y2) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      hiddenBlock.push({ x, y, isRevealed: false });
    }
  }
}*/

function fillQuestionBlocks(x1, x2, y1, y2) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      // 中身のタイプを "trap"（罠）にしておく
      questionBlock.push({ x, y, itemType: "trap", isHit: false });
    }
  }
}
// =========================
// 地面生成（画像から正確にトレース）
// =========================

// --- 1. 最下部 ---
fill(0, 44, 25, 31);       // 最下段左1
fill(47, 49, 25, 31);       // 最下段右2
fill(9, 44, 24, 24);      // 下段左3
fill(10, 44, 23, 23);       // 左端の縦壁4
fill(11, 44, 22, 22);     // 右端の縦壁5 (reihuuki右側の通路より右)
fill(13, 44, 21, 21);      // start地点の左側にある凹み壁6
fill(18, 21, 17, 20);      // nodaの左側にある緑の小高くなった壁7
fill(27, 44, 18, 20);     // noda・nodaが歩く長いメインの床（土部分）8
fill(28, 44, 17, 18);     // nodaの右側にある緑の小高くなった壁9
fill(35, 44, 14, 17);      // startの下、中央左側の広大な土壁10
fill(39, 41, 11, 14);    // プレイヤーの足場の下、中央の巨大な土壁11
fill(47, 49, 8, 30);    // reihuukiの右下、isuの右側の土壁12
//fill(28, 30, 14, 16);  //土管



// =====================================================
// 【追加】壊せるブロックの配置データ定義
// =====================================================
//fillBlocks(39, 39, 7, 7);
//fillBlocks(41,41, 7, 7);

// 例：x=15 から x=18 まで、y=13 の高さに4個横並びで配置 kakushi
//fillHiddenBlocks(42, 46, 10,10);
//fillHiddenBlocks(42, 43, 7,7);

// 例：プレイヤーの初期位置の近く（x=5, y=15）に1個配置してみる ?
//fillQuestionBlocks(40, 40, 7, 7);
//fillQuestionBlocks(20, 20, 13, 13);

// =========================
// ステージデータ
// =========================

const Stage1 = {
  TILE,

  groundList: ground,
  blockList: block,
  hiddenBlockList: hiddenBlock,
  


  // プレイヤーの初期位置 (y=19の緑の地面の上に立たせるため、足元をy=19に設定)
  playerSpawn: {
    x: 5,
    y: 23,
  },

  // 敵 (画像内の黒丸の位置)
  enemySpawnList: [
    { x: 17, y: 19, type: "noda" },     // 1体目のnoda (x:21, y:7付近)
    { x: 29, y: 14, type: "shimba" },     // 2体目のnoda (x:28, y:7付近)
    { x: 33, y: 15, type: "yoshida" },    // 右下のueno (x:42, y:29付近)
  ],

  // 回復・アイテム (画像内の四角や星の位置)
  //starList: [
    //{ x: 8, y: 24, type: "isu" },     // 中央下のisu (x:28, y:19の白い四角)
    //{ x: 37, y: 13, type: "isu" },    // 最下層右側の星1 (x:36, y:32)
  //],

 

  // =========================
  // 追加：ジャンプ台（罠ギミック）
  // =========================
  trapList: [
    {
      x: 26,          // 配置したい横の位置（マス数）
      y: 19,          // 配置したい縦の位置（マス数）   
      type: "bane"
    },
    {
      x:20,
      y:11,
      type:"itemBlock",
      itemType:"empty"
    },
    {
      x:40,
      y:5,
      type:"itemBlock",
      itemType:"jousisu"
    }
    
  ],
  
  
  // =========================
  // ゴール設定（不可視の範囲オブジェクト）
  // =========================
  goal: {
    x: 50,           // ゴールエリアの左上のX座標（マス数）
    y: -5,           // ゴールエリアの左上のY座標（マス数）
    width: 0.3,        // ゴールの横幅（マス数）
    height: 30,       // ゴールの縦幅（マス数）
    isVisible: false // 画面に描画しない（不可視）フラグ
  },
  // =========================
  // 追加：土管（マリオ風の移動・障害物ギミック）
  // =========================
  pipeList: [
    { 
      x: 29,          // マスのX座標
      y: 15,          // マスのY座標
      offsetX: -1,     // 【追加】ピクセル単位のX微調整（+で右、-で左にズレる）
      offsetY: -16,   // 【追加】ピクセル単位のY微調整（+で下、-で上にズレる）
      scale: 0.17,     // 【追加】画像の拡大縮小率（1.0でそのまま、2.0で2倍サイズ）

      // ★追加：当たり判定の微調整データ
      hitboxWidth: 40,    // 【調整してね】当たり判定の横幅（ピクセル）
      hitboxHeight: 80,   // 【調整してね】当たり判定の縦幅（ピクセル）
      hitboxOffsetX: 12,  // 【調整してね】画像左上から右へどれくらいズラすか
      hitboxOffsetY: -20   // 【調整してね】画像左上から下へどれくらいズラすか
    }
  ],
};



export default Stage1;