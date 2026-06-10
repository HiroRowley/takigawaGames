
// objects/Player.js

import Phaser from "phaser";
import DataManager from "../managers/DataManager.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        /**
         * 親クラスのコンストラクタ
         */
        super(scene, x, y, "player");

        // Sceneへ登録
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // =========================
        // プレイヤー設定
        // =========================

        this.moveSpeed = 400;
        this.jumpPower = 500;

        // 状態管理
        this.isLate = false;
        this.isInvincible = false;
        this.canMove = true;
        this.setDisplaySize(40,60);

        // 摩擦（必要なら有効化）
        // this.setDragX(600);
        console.log("プレイヤーサイズ",this.body.width, this.body.height);
    }

    // =========================
    // update
    // =========================
    update(cursors) {

        // 遅刻後は操作不可
        if (this.isLate) {
            return;
        }

        // 被弾硬直中
        if (!this.canMove) {
            return;
        }

        // =========================
        // 左移動
        // =========================
        if (cursors.left.isDown) {

            this.setVelocityX(-this.moveSpeed);

            // 左向き
            this.setFlipX(true);

        }

        // =========================
        // 右移動
        // =========================
        else if (cursors.right.isDown) {

            this.setVelocityX(this.moveSpeed);

            // 右向き
            this.setFlipX(false);

        }

        // =========================
        // 停止
        // =========================
        else {

            this.setVelocityX(0);

        }

        // =========================
        // ジャンプ
        // =========================
        if (
            cursors.up.isDown &&
            this.isGrounded()
        ) {

            this.setVelocityY(-this.jumpPower);
            this.scene.events.emit('playerjump');
        }

        // =========================
        // 画面外判定
        // =========================
        if (this.y > 2000 || this.y < -730) {

            this.triggerLate();

        }
    }

    // =========================
    // ダメージ処理
    // =========================
    takeDamage(amount, damageSource) {

        // 遅刻済み
        if (this.isLate) {
            return;
        }

        // 無敵中
        if (this.isInvincible) {
            return;
        }

        // =========================
        // HP減少
        // =========================

        const currentHP = DataManager.getHP();

        DataManager.setHP(currentHP - amount);

        // =========================
        // ノックバック
        // =========================

        this.applyKnockback(damageSource);

        // =========================
        // 被弾硬直
        // =========================

        this.canMove = false;

        this.scene.time.delayedCall(200, () => {

            this.canMove = true;

        });

        // =========================
        // 無敵開始
        // =========================

        this.startInvincible();

        // =========================
        // 被弾演出
        // =========================

        this.playDamageAnimation();

        // =========================
        // HP確認
        // =========================

        if (DataManager.getHP() <= 0) {

            this.triggerLate();

        }
    }

    // =========================
    // ノックバック
    // =========================
    applyKnockback(damageSource) {

        // ダメージ元がない場合は無視
        if (!damageSource) {
            return;
        }

        // 左側から攻撃
        if (this.x < damageSource.x) {

            this.setVelocity(-250, -200);

        }

        // 右側から攻撃
        else {

            this.setVelocity(250, -200);

        }
    }

    // =========================
    // 無敵開始
    // =========================
    startInvincible() {

        this.isInvincible = true;

        this.scene.time.delayedCall(1000, () => {

            this.endInvincible();

        });
    }

    // =========================
    // 無敵終了
    // =========================
    endInvincible() {

        this.isInvincible = false;

        // 色戻す
        this.clearTint();

        // 透明度戻す
        this.setAlpha(1);

        // Tween停止
        this.scene.tweens.killTweensOf(this);
    }

    // =========================
    // 被弾演出
    // =========================
    playDamageAnimation() {

        // 古いTween削除
        this.scene.tweens.killTweensOf(this);

        // 赤色
        this.setTint(0xff6666);

        // 点滅
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 80,
            yoyo: true,
            repeat: 5
        });
    }

    // =========================
    // 遅刻通知
    // =========================
    triggerLate() {

        // 多重防止
        if (this.isLate) {
            return;
        }

        this.isLate = true;

        this.emit("late");
    }

    // =========================
    // 接地判定
    // =========================
    isGrounded() {

        return this.body.blocked.down;

    }
}

