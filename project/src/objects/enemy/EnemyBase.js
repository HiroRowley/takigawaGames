import Phaser from 'phaser';
import EnemyMovement from '../EnemyMovement.js'; // ★追加

export default class EnemyBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        // シーンに追加
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // 基本ステータス
        this.speed = 100; 
        this.attackPower = 1; 
        this.direction = -1; // 初期方向（-1: 左, 1: 右）
        this.isDead = false; 

        // ★追加: 移動・アニメーション制御コンポーネントの生成と登録
        this.movement = new EnemyMovement(scene);
        this.movement.createAnimations(texture); 
    }
    
    // 自身の攻撃力を返す
    getDamage() {
        return this.attackPower;
    }

    // =====================================
    // 敵の死亡処理
    // =====================================
    die() {
        if (this.isDead) return; 
        this.isDead = true;

        // アニメーションを止める
        this.anims.stop();

        // 1. 当たり判定を無くす
        this.body.enable = false;

        // 2. 死亡時の演出（上に跳ねて、くるくる回りながら落ちる）
        this.scene.tweens.add({
            targets: this,
            y: this.y - 50,          
            angle: 180,              
            duration: 200,           
            ease: 'Power1.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    y: 800,          
                    angle: 360,      
                    duration: 500,   
                    ease: 'Power1.easeIn',
                    onComplete: () => {
                        this.destroy(); // 削除
                    }
                });
            }
        });
    }

    update(player) {
        // すでに死んでいる場合はスキップ
        if (this.isDead) return;

        // 画面外に出たら削除
        if (this.x < -100 || this.x > 900 || this.y < -100 || this.y > 750) {
            this.destroy();
        }
    }
}