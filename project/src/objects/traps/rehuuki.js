import TrapBase from "./TrapBase.js";

export default class Reihuuki
extends TrapBase {

    constructor(scene, x, y) {

    super(scene, x, y, "reihuuki");

    this.setOrigin(0, 0);

    this.setDisplaySize(128, 128);

    this.body.allowGravity = false;

    this.body.moves = false;

    this.setImmovable(true);

    this.isActive = false;
}

    activate(player) {

        // =========================
        // 多重発動防止
        // =========================

        if (this.isActive) {
            return;
        }

        this.isActive = true;

        // =========================
        // 画像変更
        // =========================

        this.setTexture("reihuukiSpill");

        this.setDisplaySize(128, 128);

        this.body.moves = false;

        // =========================
        // 全音停止
        // =========================

        this.scene.sound.stopAll();

        // =========================
        // 爆音
        // =========================

        this.scene.sound.play(
            "reihuukiNoise",
            {
                volume: 1.5
            }
        );

        // =========================
        // 吹き飛ばし
        // =========================

        player.setVelocity(0, 0);

        player.setVelocityX(-500);

        // =========================
        // カメラ演出
        // =========================

        this.scene.cameras.main.shake(
            1500,
            0.01
        );

        this.scene.cameras.main.flash(
            300,
            255,
            255,
            255
        );
    }
}