import Phaser from 'phaser';

export default class EnemyBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        //x,yは敵の初期位置、textureは敵のスプライト画像
        super(scene, x, y, texture);
        //シーンにゾスを追加
        scene.add.existing(this);
        //物理の有効化
        scene.physics.add.existing(this);
        this.speed = 100;//速度
        
        this.attackPower = 1;//攻撃力
    }
    
    getDamage(player) {
        //プレイヤーにダメージを与える処理PlayerクラスにtakeDamageメソッドがあるので呼び出す
        player.takeDamage(this.attackPower);
    }



    update() {


        //画面外に出たら消す。
        if(this.x < -100 ||
           this.x > 900 ||
           this.y < -100 ||
           this.y > 700) {

            this.destroy();
        }

    }
}