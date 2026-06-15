// objects/Player.js

import Phaser from "phaser";
import DataManager from "../managers/DataManager.js";
import PlayerMovement from "./PlayerMovement.js"; // ★追加: 作成した移動クラスをインポート

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

        this.moveSpeed = 300;
        this.jumpPower = 600;

        // 状態管理
        this.isLate = false;
        this.isInvincible = false;
        this.canMove = true;
        this.setDisplaySize(64, 64);
        this.setOrigin(0,0);
        // 当たり判定
        this.body.setSize(200, 450);
        this.body.setOffset(200, 100);

        // 摩擦（必要なら有効化）
        // this.setDragX(600);
        this.movement = new PlayerMovement(scene);
        this.movement.createAnimations(); // アニメーションの生成
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

        // ★修正: 元の移動処理をすべて置き換え、PlayerMovementに丸投げする
        // 第二引数(player)として `this` を渡します
        this.movement.move(this, cursors);

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
    takeDamage(amount) {

        if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
            throw new TypeError("Damage must be a non-negative finite number.");
        }

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

        this.scene.hitSound?.play();

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
