
const Stage1 = {

    TILE: 64,

    // プレイヤー開始位置
    playerSpawn: {
        x: 2,
        y: 5
    },

    // 敵
    enemySpawnList: [
        {
            x: 8,
            y: 8,
            type: "noda"
        }
    ],

    // 地面
    groundList: [

        // 横一列
        { x: 0, y: 10 },
        { x: 1, y: 10 },
        { x: 2, y: 10 },
        { x: 3, y: 10 },
        { x: 4, y: 10 },
        { x: 5, y: 10 },
        { x: 6, y: 10 },
        { x: 7, y: 10 },
        { x: 8, y: 10 },
        { x: 9, y: 10 },
        { x: 10, y: 10 },
        { x: 11, y: 10 },
        { x: 12, y: 10 }

    ],

    // ゴール
    goalPosition: {
        x: 12,
        y: 8
    }

};

export default Stage1;

