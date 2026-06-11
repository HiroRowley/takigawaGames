import EnemyBase from "./EnemyBase.js";
import Phaser from 'phaser';

export default class UenoBullet extends EnemyBase {
    /**
     * @param {Phaser.Scene} scene シーン
     * @param {number} x 発射位置X
     * @param {number} y 発射位置Y
     * @param {string} texture 弾の画像キー（DataManagerやStageデータから指定可能に）
     * @param {number} angleDeg 発射する角度（度数法: 180なら左、0なら右）
     */
    constructor(scene, x, y, texture, angleDeg = 180) {
        // 指定された画像キーで初期化
        super(scene, x, y, texture);
        
        this.speed = 300; // 弾の飛ぶ速度
        this.attackPower = 1; // 弾のダメージ
        this.angleDeg = angleDeg; // 【重要】あとで速度計算に使うため、クラスに記憶させておく

        // =====================================
        // 1. サイズを小さくする設定
        // =====================================
        this.setScale(0.1); // 0.1倍の大きさに縮小

        // 弾は重力の影響を受けずにまっすぐ飛ばす
        if (this.body) {
            this.body.setAllowGravity(false);
            this.body.isSensor = true; // 地形をすり抜ける設定（その場で引っかからないようにする）
        }
    }

    // =====================================
    // 2. 動き始めるための関数（コンストラクタの外に独立させました）
    // =====================================
    startMoving() {
        if (!this.body) return;


        // ★★★ グループに追加された後に、強制的に重力をオフに上書きする！ ★★★
        this.body.setAllowGravity(false);

        
        // 記憶しておいた角度（度）をラジアンに変換して、進む方向の速度を計算
        const angleRad = Phaser.Math.DegToRad(this.angleDeg);
        const vx = Math.cos(angleRad) * this.speed;
        const vy = Math.sin(angleRad) * this.speed;

        this.setVelocity(vx, vy);

        // 必要に応じて弾の向きを画像の進行方向に合わせる（キラーみたいに反転させたい場合など）
        if (vx < 0) {
            this.setFlipX(false); // 左向き
        } else {
            this.setFlipX(true);  // 右向き
        }
        console.log(`[UenoBullet] 速度を設定しました: vx=${vx}, vy=${vy}`);
    }

    // 砲台の弾も上から踏まれて壊れたらおかしいので、dieを空にして無敵（相殺不可）にします
    die() {
        // 何もしない（プレイヤーは踏んでもダメージを受ける）
    }

    update() {
        // 親クラスのupdateを呼ぶことで、画面外に出たら自動削除（destroy）されます
        super.update();
    }
}