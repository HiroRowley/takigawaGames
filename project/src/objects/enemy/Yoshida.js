import EnemyBase from "./EnemyBase.js";
import Phaser from 'phaser';

export default class Yoshida extends EnemyBase {

    constructor(scene, x, y) {
        super(scene, x, y, 'yoshida');
        this.speed = 150;
        this.attackPower = 1;
        this.direction = -1;//初期の移動方向を左に設定
        this.setScale(0.5);

        // ジャンプ力を設定（値はステージの重力に合わせて調整してください）
        this.jumpVelocity = -500;

        // =====================================
        // ★プレイヤーのジャンプイベントを監視（追加）
        // =====================================
        // シーン全体で 'playerjump' イベントが発生したら、自身の respondToPlayerJump を実行する
        this.scene.events.on('playerjump', this.respondToPlayerJump, this);

        // 自身が削除（destroy）されたときに、イベントの監視を解除する処理（メモリリーク対策）
        this.on('destroy', () => {
            this.scene.events.off('playerjump', this.respondToPlayerJump, this);
        });
    }
    respondToPlayerJump() {
        // すでに死亡している、または地面に接地していない（空中）ならジャンプしない
        if (this.isDead || !this.body.blocked.down) return;

        // 上方向への速度を与えてジャンプ
        this.setVelocityY(this.jumpVelocity);
    }

    update() {
        super.update();
         // 移動
        this.setVelocityX(this.speed * this.direction);

        //衝突時に方向反転はGameSceneの実装待ち
         // 壁衝突で反転
        if (this.body.blocked.left) {
        
            this.direction = 1;
        
        }
    
        else if (this.body.blocked.right) {
        
            this.direction = -1;
        
        }
    }

}