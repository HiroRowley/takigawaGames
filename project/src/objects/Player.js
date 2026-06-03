// objects/Player.js

import Phaser from "phaser";
import DataManager from "../manager/DataManager.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(GameScene, x, y,texture) {/**
        親クラスのコンストラクタを呼び出す。
        Phaser.Physics.Arcade.Spriteは、ゲームシーン、x座標、y座標、スプライトのキーを引数に取る。
        x,yはプレイヤーの初期位置、textureはプレイヤーのスプライト画像を指定するための引数である。
        */
        super(GameScene, x, y, texture);

        GameScene.add.existing(this);
        GameScene.physics.add.existing(this);

        this.moveSpeed = 200;
        this.jumpPower = 400;
        //this.setDragX(600); ←停止時の地面での摩擦を追加する場合は有効にする
    }

    /**
     * プレイヤー操作
     */
    update(cursors) {

        // 左移動
        if (cursors.left.isDown) {

            this.setVelocityX(-this.moveSpeed);

            

        }
        // 右移動
        else if (cursors.right.isDown) {

            this.setVelocityX(this.moveSpeed);

            

        }
        // 停止
        else {

            this.setVelocityX(0);
            //徐々に停止する場合はからにする。

            

        }

        // ジャンプ
        if (
            cursors.up.isDown &&
            this.isGrounded()
        ) {

            this.setVelocityY(-this.jumpPower);

        }

        if (this.y > 600) {//画面下に落ちた場合は遅刻とする
            this.emit("late");//プレイヤーが遅刻したことを通知するイベントを発火させるGameSceneへ通知
        }
        if (this.y < -100) {//画面上に出た場合は遅刻とする
            this.emit("late");//プレイヤーが遅刻したことを通知するイベントを発火させるGameSceneへ通知
        }

    }

    /**
     * ダメージ処理
     * ほかのオブジェクトから呼び出されることを想定している。
     */
    takeDamage(amount) {

        const currentHP = DataManager.getHP();

        const newHP = currentHP - amount;

        DataManager.setHP(newHP);

        if (newHP <= 0) {

            this.emit("late");//プレイヤーが遅刻したことを通知するイベントを発火させるGameSceneへ通知

        }

    }

    /**
     * 接地判定
     */
    isGrounded() {

        return this.body.blocked.down;

    }

}