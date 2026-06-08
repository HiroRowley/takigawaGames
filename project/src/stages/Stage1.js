// Stage1.js
 
const TILE = 32;
 
const ground = [];
 
// =========================
// ヘルパー
// =========================
function fill(x1, x2, y1, y2) {
    for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
            ground.push({ x, y });
        }
    }
}
 
// =========================
// 地面
// =========================
 
// メイン地面
fill(0, 50, 20, 22);
 
// 左端の壁
fill(0, 0, 0, 22);
 
// 小さな足場
fill(8, 12, 7, 7);
fill(18, 22, 13, 13);
fill(30, 35, 10, 10);
 
// ゴール前の高台
fill(42, 46, 17, 17);
 
// =========================
// ステージデータ
// =========================
 
const Stage1 = {
    TILE,
 
    // 地形
    groundList: ground,
 
    // プレイヤー開始位置
    playerSpawn: {
        x: 2,
        y: 18,
    },
 
    // 敵
    enemySpawnList: [
        {
            x: 15,
            y: 17,
            type: "shimba",
        },
    ],
 
    // ゴール
    goal: {
        x: 48,
        y: 16,
    },
};
 
export default Stage1;