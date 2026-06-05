import EnemyBase from "./EnemyBase.js";
import Phaser from 'phaser';

export default class Noda extends EnemyBase {

    constructor(scene, x, y) {
        super(scene, x, y, 'noda');
        this.speed = 150;
        this.attackPower = 1;
        this.direction = -1;//初期の移動方向を左に設定
        this.setScale(0.05);
    }

  
    update() {
    
        super.update();
    
        // 移動
        this.setVelocityX(this.speed * this.direction);
    
        // 壁衝突で反転
        if (this.body.blocked.left) {
        
            this.direction = 1;
        
        }
    
        else if (this.body.blocked.right) {
        
            this.direction = -1;
        
        }
    }



}