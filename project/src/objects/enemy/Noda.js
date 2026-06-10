import EnemyBase from "./EnemyBase.js";

export default class Noda extends EnemyBase {
    constructor(scene, x, y) {
        // 親クラス（EnemyBase）のコンストラクタを呼び出すことで、
        // 自動的に 'noda' キーのアニメーションが生成されます
        super(scene, x, y, 'noda');
        
        this.speed = 150;
        this.attackPower = 1;
        this.direction = -1; // 初期移動方向を左に設定
        this.setDisplaySize(42, 64);
    }

    update(player) {
        // 親クラスの画面外チェックなどを実行
        super.update(player);
    
        // 死亡していなければ、EnemyMovementのWalker用の移動ロジックを実行
        if (!this.isDead) {
            this.movement.moveWalker(this);
        }
    }
}