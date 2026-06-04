import EnemyBase from "./EnemyBase.js";
import Phaser from 'phaser';

export default class Noda extends EnemyBase {

    constructor(scene, x, y) {
        super(scene, x, y, 'noda');
        this.speed = 150;
        this.attackPower = 1;
        this.direction = -1;//初期の移動方向を左に設定
    }

    update() {
        super.update();
         // 移動
        this.setVelocityX(this.speed * this.direction);

        //衝突時に方向反転はGameSceneの実装待ち
    }

}