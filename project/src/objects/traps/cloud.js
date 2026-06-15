import TrapBase from "./TrapBase.js";

export default class Cloud extends TrapBase {

    constructor(scene, x, y) {

        super(scene, x, y, "normalCloud");

        this.scene = scene;
        

        // =========================
        // 状態管理
        // =========================
        this.isActivated = false;

        // =========================
        // 表示サイズ
        // =========================
        this.setDisplaySize(96, 96);

        // =========================
        // 当たり判定
        // =========================
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.moves = false;
        this.body.pushable = false;

        
    }

    // =========================
    // プレイヤー接触
    // =========================
    onPlayerOverlap(player) {

        // 多重発火防止
        if (this.isActivated) {
            return;
        }

        this.isActivated = true;

        // =========================
        // 雲画像変更
        // =========================
        this.setTexture("ZossCloud");

        // =========================
        // 決め台詞
        // =========================
        const serif = this.scene.add.text(

            this.x + 30,
            this.y - 60,

            "ゾス‼",

            {
                fontSize: "33px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 5,
                fontStyle: "bold"
            }
        );

        serif.setDepth(999);

        

        // =========================
        // 999ダメージ
        // =========================
        if (typeof player.takeDamage === "function") {

            player.takeDamage(999, this);

        } else {

            // damage関数がない場合の保険
            player.setTint(0xff0000);

            player.setVelocity(0, -400);

            player.isDead = true;
        }

        // =========================
        // ヒット演出
        // =========================
        this.scene.cameras.main.shake(250, 0.01);

        // 点滅
        this.scene.tweens.add({

            targets: this,

            alpha: 0.3,

            duration: 100,

            yoyo: true,

            repeat: 3
        });
    }

}
