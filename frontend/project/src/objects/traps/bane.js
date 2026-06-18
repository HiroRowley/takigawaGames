import Phaser from "phaser";
import TrapBase from "./TrapBase";

import GameScene from "../../scenes/GameScene/GameScene";

export default class Bane extends TrapBase {

    constructor(scene, x, y) {

        super(scene, x, y, "baneNormall");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 動かないようにする
        this.body.setImmovable(true);
        this.body.allowGravity = false;

        // サイズ調整
        this.setDisplaySize(64,64);
        this.body.setSize(64,64);//当たり判定調整。

        // 元画像
        this.normalTexture = "baneNormall";

        // 踏まれた画像
        this.pushTexture = "baneStomp";

        // 多重発動防止
        this.isPushed = false;

        this.body.setImmovable(true);
        this.body.allowGravity = false;
    }

    bounce(player) {

        // 連続発動防止
        if (this.isPushed) return;

        this.scene.sound.play("bane",{
            loop:false,
            volume:0.5
        })

        this.isPushed = true;

        // プレイヤーを上へ吹っ飛ばす
        player.setVelocityY(-5000);

        // 踏まれた画像へ変更
        this.setTexture(this.pushTexture);
        
        this.body.setSize(64,64);

        // 少しだけエフェクト感
        
        this.setDisplaySize(60.8, 44.8);
        
        // エフェクト中も当たり判定のサイズは64x64のまま維持
        this.body.setSize(64, 64);

        
        // 音
        this.scene.sound.play("bane");

        // 0.2秒後に戻す
        this.scene.time.delayedCall(200, () => {

            this.setTexture(this.normalTexture);

            this.setDisplaySize(64,64);

            this.isPushed = false;

        });
    }
}