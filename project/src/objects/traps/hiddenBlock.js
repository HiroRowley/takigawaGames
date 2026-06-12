import TrapBase from "./TrapBase.js";

export default class HiddenBlock extends TrapBase {

    constructor(scene, x, y) {

        super(scene, x, y, "itemBlock");

        this.revealed = false;

        // 最初は見えない
        this.setVisible(false);

        // 最初は当たり判定なし
        this.body.enable = false;

        this.setDisplaySize(64, 64);
    }

    hit(player) {

        // 既に出現済み
        if (this.revealed) {
            return;
        }

        this.revealed = true;

        // 可視化
        this.setVisible(true);

        // 当たり判定ON
        this.body.enable = true;

        // 少し跳ねる
        this.scene.tweens.add({

            targets: this,

            y: this.y - 10,

            duration: 80,

            yoyo: true
        });

        console.log("隠しブロック出現");
    }
}