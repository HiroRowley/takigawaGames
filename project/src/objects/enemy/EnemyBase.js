import Phaser from 'phaser';

export default class EnemyBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        // x,yは敵の初期位置、textureは敵のスプライト画像
        super(scene, x, y, texture);
        // シーンに敵を追加
        scene.add.existing(this);
        // 物理の有効化
        scene.physics.add.existing(this);
        
        this.speed = 100; // 速度
        this.attackPower = 1; // 攻撃力
        this.isDead = false; // 死亡フラグ（二重処理防止）
    }
    
    // 自身の攻撃力を返す（GameScene側から呼ばれる用）
    getDamage() {
        return this.attackPower;
    }

    // =====================================
    // 敵の死亡処理（追加）
    // =====================================
    die() {
        if (this.isDead) return; // すでに死んでいたら何もしない
        this.isDead = true;

        // 1. 当たり判定を無くす（物理ボディを無効化）
        this.body.enable = false;

        // 2. 死亡時の演出（少し上に跳ねて、くるくる回りながら落ちる設定）
        // ※物理がオフなので、Tweenアニメーションで下に落とします
        this.scene.tweens.add({
            targets: this,
            y: this.y - 50,          // 50ピクセル上に跳ねる
            angle: 180,              // 180度回転
            duration: 200,           // 0.2秒かけて上昇
            ease: 'Power1.easeOut',
            yoyo: false,
            onComplete: () => {
                // 上昇が終わったら、画面下に真っ逆さまに落ちていく
                this.scene.tweens.add({
                    targets: this,
                    y: 800,          // 画面外（下）へ
                    angle: 360,      // さらに回転
                    duration: 500,   // 0.5秒かけて落ちる
                    ease: 'Power1.easeIn',
                    onComplete: () => {
                        this.destroy(); // 画面外に落ちきったら削除
                    }
                });
            }
        });
    }

    update() {
        // すでに死んでいる場合は画面外判定などのアップデートをスキップ
        if (this.isDead) return;

        
    }
}