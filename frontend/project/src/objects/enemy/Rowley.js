import EnemyBase from "./EnemyBase.js";
import Phaser from "phaser";

export default class Rowley extends EnemyBase {

    constructor(scene, x, y) {

        super(scene, x, y, "rowley", {
            animation: {
                frames: [0, 1, 0, 1],
                frameRate: 6,
            },
            idleFrame: 0,
            flipXWhenMovingRight: true,
        });

        // =========================
        // 基本設定
        // =========================

        this.setFrame(0);

        this.speed = 300;
        this.attackPower = 100;

        this.setDisplaySize(128,168);

        // =========================
        // 行動設定
        // =========================

        this.keepDistance = 200;

        this.shakePower = 500;

        this.shakeInterval = 100;

        this.shakeTimer = 0;

        this.shakeVX = 0;
        this.shakeVY = 0;

        // レーザー発射タイマー
        this.laserTimer = 0;

        // 空中敵
        this.body.setAllowGravity(true);
        
        this.dashTimer = 0;

        this.jumpTimer = 0;

        this.isDashing = false;

        this.phase = "move";

        this.phaseTimer = 0;
    }

    // =========================
    // 撃破不能
    // =========================

    die() {

        console.log("Rowleyは倒せない！");
    }

    // =========================
    // レーザー共通処理
    // =========================

    activateLaser(laser) {

        const scene = this.scene;

        if (!scene) {
            return;
        }

        scene.physics.add.existing(laser);

        laser.body.setAllowGravity(false);

        // ダメージ関数
        laser.getDamage = () => 9999;

        // グループ追加
        scene.lasers.add(laser);

        // 消滅
        scene.time.delayedCall(1000, () => {

            if (laser && laser.active) {
                laser.destroy();
            }
        });
    }

    // =========================
    // レーザー発射
    // =========================

    spawnLaser(type = "vertical",player) {

        const scene = this.scene;

        if (!scene) {
            return;
        }

        const centerX = 400;
        const centerY = 300;

        // =========================
        // 縦レーザー
        // =========================

        if (type === "vertical") {

    // =========================
    // 未来位置予測
    // =========================

    const predictTime = 0.5;

    const futureX =
        player.x +
        player.body.velocity.x * predictTime;

    // 少しランダムを混ぜる
    const randomOffset =
        Phaser.Math.Between(-100, 100);

    let x =
        futureX + randomOffset;

    // 画面外防止
    x = Phaser.Math.Clamp(
        x,
        100,
        2000
    );

    // =========================
    // 警告線
    // =========================

    const warning = scene.add.rectangle(
        x,
        centerY,
        4,
        600,
        0xff0000,
        0.4
    );

    // =========================
    // 本レーザー
    // =========================

    scene.time.delayedCall(800, () => {

        if (!scene || !warning.active) {
            return;
        }

        warning.destroy();
        scene.sound.play("laser", {
            volume: 1
        });

        const laser = scene.add.rectangle(
            x,
            centerY,
            40,
            600,
            0xff0000,
            1
        );

        this.activateLaser(laser);
    });
}

        // =========================
        // 横レーザー
        // =========================

        else if (type === "horizontal") {

            const y = Phaser.Math.Between(100, 500);

            const warning = scene.add.rectangle(
                centerX,
                y,
                800,
                4,
                0xff0000,
                0.4
            );

            scene.time.delayedCall(800, () => {

                if (!scene || !warning.active) {
                    return;
                }

                warning.destroy();

                const laser = scene.add.rectangle(
                    centerX,
                    y,
                    800,
                    40,
                    0xff0000,
                    1
                );

                this.activateLaser(laser);
            });
        }

        // =========================
        // 斜めレーザー
        // =========================

        else if (type === "diagonal") {

            const warnings = [];

            // 警告線
            for (let i = -5; i <= 5; i++) {

                const warning = scene.add.rectangle(
                    centerX + i * 40,
                    centerY + i * 40,
                    80,
                    4,
                    0xff0000,
                    0.4
                );

                warning.rotation = Phaser.Math.DegToRad(45);

                warnings.push(warning);
            }

            // 本レーザー
            scene.time.delayedCall(800, () => {

                warnings.forEach(w => {

                    if (w && w.active) {
                        w.destroy();
                    }
                });

                for (let i = -5; i <= 5; i++) {

                    const laser = scene.add.rectangle(
                        centerX + i * 40,
                        centerY + i * 40,
                        120,
                        20,
                        0xff0000,
                        1
                    );

                    laser.rotation = Phaser.Math.DegToRad(45);

                    this.activateLaser(laser);
                }
            });
        }
    }
    
    startDash(player) {

    if (!player) {
        return;
    }

    // 既に突進中なら無視
    if (this.isDashing) {
        return;
    }

    // =========================
    // 溜め開始
    // =========================

    this.isDashing = true;

    // 完全停止
    this.body.setVelocity(0, 0);

    // 赤色
    this.setTint(0xff0000);

    // 小刻み振動
    this.chargeTween = this.scene.tweens.add({

        targets: this,

        x: this.x + 8,

        duration: 40,

        yoyo: true,

        repeat: -1
    });

    // =========================
    // 溜め時間
    // =========================

    this.scene.time.delayedCall(1000, () => {

        // 消えていたら中断
        if (!this.active) {
            return;
        }

        // 振動停止
        if (this.chargeTween) {
            this.chargeTween.stop();
        }

        // 元位置へ
        this.x = Math.round(this.x);

        // 色戻す
        this.clearTint();

        // =========================
        // プレイヤー方向
        // =========================

        const dx = player.x - this.x;
        const dy = player.y - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const nx = dx / distance;
        const ny = dy / distance;

        // =========================
        // 突進
        // =========================

        const dashSpeed = 1000;

        this.body.setVelocity(
            nx * dashSpeed,
            ny * dashSpeed
        );

        // =========================
        // 突進終了
        // =========================

        this.scene.time.delayedCall(350, () => {

            if (!this.active) {
                return;
            }

            // 停止
            this.body.setVelocity(0, 0);

            // 硬直
            this.scene.time.delayedCall(300, () => {

                if (!this.active) {
                    return;
                }

                this.isDashing = false;
            });
        });
    });
}

    // =========================
    // update
    // =========================

    update(player, time) {
        // =========================
// フェーズ切り替え
// =========================

        if (time > this.phaseTimer) {
        
            if (this.phase === "move") {
            
                this.phase = "laser";
            
                this.phaseTimer = time + 6000;
            }
        
            else if (this.phase === "laser") {
            
                this.phase = "dash";
            
                this.phaseTimer = time + 4000;
            }
        
            else {
            
                this.phase = "move";
            
                this.phaseTimer = time + 5000;
            }
        }

        if (!player) {
            return;
        }
        if (this.isDashing) {
            return;
        }

        // =========================
        // レーザー定期発射
        // =========================

        if (time > this.laserTimer) {

            this.laserTimer = time + 2000;

            const patterns = [
                "vertical"
            ];

            const randomType =
                Phaser.Utils.Array.GetRandom(patterns);

            this.spawnLaser(randomType,player);
        }

        // =========================
        // 距離計算
        // =========================

        const dx = player.x - this.x;
        const dy = player.y - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // =========================
        // 接近
        // =========================

        if (distance > this.keepDistance) {

    const nx = dx / distance;

    // 横移動のみ
    this.body.setVelocityX(
        nx * this.speed
    );

    // =========================
    // ランダムジャンプ
    // =========================

    if (
        time > this.jumpTimer &&
        this.body.blocked.down
        ) {

        this.jumpTimer =
            time + Phaser.Math.Between(800, 2000);

        this.body.setVelocityY(-700);
        }
    }

        // =========================
        // 振動
        // =========================

        else {

            if (time > this.shakeTimer) {

                this.shakeTimer =
                    time + this.shakeInterval;

                this.shakeVX =
                    Phaser.Math.Between(
                        -this.shakePower,
                        this.shakePower
                    );

                this.shakeVY =
                    Phaser.Math.Between(
                        -this.shakePower,
                        this.shakePower
                    );
            }

            this.body.setVelocity(
                this.shakeVX,
                this.shakeVY
            );
        }

        // =========================
        // 向き変更
        // =========================

        this.setFlipX(dx < 0);
            // =========================
        // 突進
        // =========================

        if (time > this.dashTimer) {

            this.dashTimer = time + 3000;

            this.startDash(player);
        }
    }
}
