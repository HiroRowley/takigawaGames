import Phaser from 'phaser';
export default class TrapBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.attackPower = 1;//攻撃力
    }
    getDamage(player) {
        //プレイヤーにダメージを与える処理PlayerクラスにtakeDamageメソッドがあるので呼び出す
        player.takeDamage(this.attackPower);
    }

    update() {
        
    }
}