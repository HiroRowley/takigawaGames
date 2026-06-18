import EnemyBase from "./EnemyBase.js";
import Phaser from 'phaser';
import DataManager from "../../managers/DataManager.js"
 
 
export default class Shimba extends EnemyBase {
 
    constructor(scene, x, y) {
       
        super(scene, x, y, 'shimba');
       
        this.speed = 1100; // 上に飛び出す速度（好みに合わせて数値を調整してください）
        this.attackPower = 1;
       
        this.setDisplaySize(60, 90); // サイズ調整（必要なければ削除、または数値を変更してください）
   
        // =====================================
        // トリガー用のフラグと設定
        // =====================================
        this.isActivated = false; // すでに飛び出したかどうかのフラグ
        this.activationRange = 100; // プレイヤーが何ピクセル以内に近づいたら起動するか
 
        // 重力をゼロにする（これをしないと、重力で下に落ちてきてしまいます）
        if (this.body) {
            this.body.setAllowGravity(false);
            this.body.enable = false;
        }
 
        // 初期速度を真上（Y軸のマイナス方向）に設定
        
        this.setVelocityY(-this.speed);
    }
 
    die() {
        // 親クラスのdie()を呼ばず、中身を空っぽにすることで
        // 踏まれてもアニメーションが起きず、死ななくなります（無敵）
        console.log("[Shimba] 無敵なので効きません！");
    }
 
   update() {
        // すでに死亡フラグが立っている場合は何もしない（一応の安全策）
        if (this.isDead) return;
 
        // 起動前の処理（プレイヤーとの距離を測る）
        if (!this.isActivated) {
            this.checkPlayerDistance();
            return; // 起動するまではこれ以降の移動処理（super.updateなど）はしない
        }
 
        // 起動後の処理（上空へ進む）
        super.update();
    }
    // プレイヤーとの距離を測り、近づいたら起動する関数
    checkPlayerDistance() {
        const player = this.scene.player;
        if (!player) return;
 
        // 【修正点】X座標（横軸）の距離だけで判定する
        // Math.abs() で絶対値を取ることで、左右どちらから近づいても反応します
        const distanceX = Math.abs(this.x - player.x);
 
        // 必要に応じてY座標（縦軸）の条件も追加すると確実です
        // （例: プレイヤーがShimbaより上にいる場合のみ発動するなど）
        // const isPlayerAbove = player.y < this.y;
 
        // X座標の距離が設定範囲内 (例: 100px) に入ったらトリガー発動！
        if (distanceX < this.activationRange) {
            this.activate();
        }
    }
    // 飛び出す処理
    activate() {
    this.isActivated = true;

    this.scene.sound.play("shimbaStart", {
        volume: 1
    });

    if (this.body) {
        this.body.enable = true;
        this.body.setAllowGravity(false);

        if (DataManager.holidayCounter % 2 === 0) {
            this.setVelocityX(-this.speed);
        } else {
            this.setVelocityY(-this.speed);
        }
        //しんば用のカウンター
        DataManager.holidayCounter++;
    }
}
}
 