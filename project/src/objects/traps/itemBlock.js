
import TrapBase from "./TrapBase.js";

export default class ItemBlock extends TrapBase {

        constructor(scene, x, y, type = "empty") {

        super(scene, x, y, "itemBlock");

        this.type = type;

        this.used = false;

        this.setOrigin(0.5);

        this.setDisplaySize(64, 64);

        // =========================
        // 完全固定
        // =========================

        this.body.setAllowGravity(false);

        this.body.setVelocity(0, 0);

        this.body.moves = false;

        this.body.immovable = true;

        this.body.pushable = false;
    }

    // =====================================
    // ブロックを叩いた
    // =====================================

    hit(player) {

        // 使用済みなら無視
        if (this.used) {
            return;
        }

        this.used = true;

        // 少し揺らす
        this.scene.tweens.add({

            targets: this,

            y: this.y - 10,

            duration: 80,

            yoyo: true,
        });

        // =========================
        // タイプ分岐
        // =========================

        switch (this.type) {

            case "empty":

                this.emptyEffect(player);

                break;

            case "jousisu":

                this.bossEffect(player);

                break;
        }

        // 使用済み画像
        // 必要なら usedBlock を preload
        // this.setTexture("usedBlock");
    }

    // =====================================
    // 空
    // =====================================

    emptyEffect(player) {

        console.log(
            "空のブロックがヒットしました"
        );
    }

    // =====================================
    // 上司降臨
    // =====================================

    bossEffect(player) {

        const scene = this.scene;

        // =========================
        // 暗転
        // =========================

        const dark = scene.add.rectangle(

            0,
            0,

            scene.scale.width,
            scene.scale.height,

            0x000000,
            0.6
        );

        dark.setOrigin(0);

        dark.setScrollFactor(0);

        dark.setDepth(999);

        // =========================
        // プレイヤー停止
        // =========================

        player.canMove = false;

        player.setVelocity(0, 0);

        // =========================
        // フラッシュ
        // =========================

        scene.cameras.main.flash(
            300,
            255,
            255,
            255
        );

        // =========================
        // カメラ振動
        // =========================

        scene.cameras.main.shake(
            1200,
            0.01
        );

        // =========================
        // 神BGM
        // =========================
        scene.sound.stopAll();

        scene.sound.play("holyMusic");

        // =========================
        // 降臨開始
        // =========================

        scene.time.delayedCall(1000, () => {

            // =========================
            // 後光
            // =========================

            const halo = scene.add.image(
                this.x,
                this.y - 350,
                "halo"
            );

            halo.setScale(0.5);

            halo.setAlpha(0.8);

            halo.setDepth(1000);

            // 回転
            scene.tweens.add({

                targets: halo,

                angle: 360,

                duration: 10000,

                repeat: -1
            });

            // =========================
            // 上司
            // =========================

            const boss = scene.physics.add.sprite(
                this.x,
                this.y - 350,
                "jousisu"
            );

            boss.setDepth(1001);

            boss.setScale(0.5);

            boss.body.setAllowGravity(false);

            // ゆっくり降下
            scene.tweens.add({

            targets: boss,

            y: this.y - 80,

            duration: 3500,

            ease: "Sine.easeInOut",

                onUpdate: () => {

                    halo.x = boss.x;

                    halo.y = boss.y;
                }
            });



            // =========================
            // 着地
            // =========================

            scene.time.delayedCall(3500, () => {

                scene.cameras.main.shake(
                    500,
                    0.02
                );

                // impact を preload しているなら
                // scene.sound.play("impact");

                // 遅刻状態
                player.isLate = true;

                console.log(
                    "上司が降臨した"
                );
                

                // =========================
                // 終了
                // =========================

                scene.time.delayedCall(3000, () => {

                    dark.destroy();

                    halo.destroy();

                    boss.destroy();
                    player.emit("late");

                    player.canMove = true;

                });
            });
        });
    }
}

