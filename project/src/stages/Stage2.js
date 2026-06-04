const TILE = 32;

const Stage2 = {
  groundList: [
    // y=32〜33 フル床
    ...Array.from({ length: 2 }, (_, y) =>
      Array.from({ length: 46 }, (_, x) => ({
        x: x * TILE,
        y: (32 + y) * TILE,
      }))
    ).flat(),

    // y=27〜31 左側地面
    ...Array.from({ length: 5 }, (_, y) =>
      Array.from({ length: 17 }, (_, x) => ({
        x: x * TILE,
        y: (27 + y) * TILE,
      }))
    ).flat(),

    // y=23〜26 左右＋中央空洞
    ...Array.from({ length: 4 }, (_, y) => {
      const arr = [];

      // 左
      for (let x = 0; x <= 16; x++) {
        arr.push({ x: x * TILE, y: (23 + y) * TILE });
      }

      // 右
      for (let x = 20; x <= 45; x++) {
        arr.push({ x: x * TILE, y: (23 + y) * TILE });
      }

      return arr;
    }).flat(),
  ],

  enemySpawnList: [
    { type: "noda", x: 15 * TILE, y: 10 * TILE },
    { type: "ueno", x: 30 * TILE, y: 10 * TILE },
  ],

  gimmickList: [
    { type: "reihuuki", x: 25 * TILE, y: 12 * TILE },
    { type: "isu", x: 18 * TILE, y: 16 * TILE },
  ],

  starList: [
    { x: 25 * TILE, y: 18 * TILE },
  ],

  playerSpawn: {
    x: 2 * TILE,
    y: 30 * TILE,
  },
};

export default Stage2;