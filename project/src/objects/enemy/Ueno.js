import EnemyBase from "./EnemyBase.js";
import Phaser from 'phaser';

export default class Ueno extends EnemyBase {

    constructor(scene, x, y) {
        super(scene, x, y, 'ueno');
        this.attackPower = 1;
        
    }

    update() {
        super.update();
         // 移動
        this.setVelocityX(this.speed * this.direction);

        //衝突時に方向反転はGameSceneの実装待ち
    }

}