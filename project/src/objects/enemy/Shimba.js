import EnemyBase from "./EnemyBase.js";
import Phaser from 'phaser';

export default class Shimba extends EnemyBase {

    constructor(scene, x, y) {
       
        super(scene, x, y, 'shimba');
        
        this.speed = 1100; // 上に飛び出す速度（好みに合わせて数値を調整してください）
        this.attackPower = 1;
        
        this.setScale(0.3); // サイズ調整（必要なければ削除、または数値を変更してください）
    
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

        // プレイヤーとShimbaの距離を計算（三平方の定理）
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        // 設定した距離（200px）以内に入ったらトリガー発動！
        if (distance < this.activationRange) {
            this.activate();
        }
    }

    // 飛び出す処理
    activate() {
        this.isActivated = true;
        console.log("[Shimba] プレイヤーを感知！土管から飛び出します。");

        // 物理判定を有効化して、真上に発射
        if (this.body) {
            this.body.enable = true;
            this.setVelocityY(-this.speed);
        }
    }
}