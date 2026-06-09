import EnemyBase from "./EnemyBase.js";
import UenoBullet from "./UenoBullet.js";
import Phaser from 'phaser';

export default class Ueno extends EnemyBase {

    constructor(scene, x, y) {
        // 'ueno' は砲台自体の画像キー
        super(scene, x, y, 'ueno');
        
        // 固定砲台なので動かない
        this.speed = 0;
        this.attackPower = 1; // 本体に触れてもダメージ

        if (this.body) {
            this.body.setAllowGravity(false); // 空中砲台もできるように重力オフ
            this.body.setImmovable(true);     // プレイヤーがぶつかっても位置がズレないように固定
        }

        // =====================================
        // 砲台の設定（カスタマイズ可能）
        // =====================================
        this.fireInterval = 2000;       // 弾を撃つ間隔（ミリ秒、2000 = 2秒）
        this.bulletTexture = "bullet";   // ★投げるものの画像キー（デフォルト）
        this.fireAngle = 180;           // ★発射する角度（デフォルトは 180 = 左向き）

        // 定期的に弾を撃つタイマーを設定
        this.fireTimer = this.scene.time.addEvent({
            delay: this.fireInterval,
            callback: this.fire,
            callbackScope: this,
            loop: true
        });
    }

    // ステージデータ等から、弾の画像や、撃つ方向を後から変更できるようにする関数
    // 例: enemy.setCustomConfig("hammer", 0); // 右向きにハンマーを投げる砲台になる
    setCustomConfig(bulletTexture, fireAngle) {
        if (bulletTexture) this.bulletTexture = bulletTexture;
        if (fireAngle !== undefined) this.fireAngle = fireAngle;
    }

    // 弾を発射する処理
    fire() {
    if (this.isDead || !this.active) return;

    console.log(`[Ueno] 弾を発射します。画像: ${this.bulletTexture}, 角度: ${this.fireAngle}`);

  // =======================================================
    // 弾を生成するY座標（高さ）を調整する
    // 「this.y + 20」のように足し算をすると、その分だけ発射位置が下がります。
    // =======================================================
    const spawnY = this.y + 20; // ★20ピクセル下げる（見た目を見ながら 15 や 30 など調整してください）

    // 第3引数を this.y から spawnY に変更します
    const bullet = new UenoBullet(this.scene, this.x, spawnY, this.bulletTexture, this.fireAngle);
    
    // 2. 先にグループに追加する（ここでPhaserが速度をリセットしてしまうのを防ぐため）
    this.scene.bullets.add(bullet);

    // 3. グループ追加後に、弾の動かす関数（新設）を呼び出す！
    bullet.startMoving();
}

    // 砲台本体も踏まれて壊れないように無敵化（必要ならここを書き換えて、踏んだら壊れるようにもできます）
    die() {
        console.log("[Ueno] 砲台本体は頑丈なので壊れません！");
    }

    // 破壊された時（ステージ遷移時など）にタイマーも一緒に消去する
    destroy(fromScene) {
        if (this.fireTimer) {
            this.fireTimer.remove();
        }
        super.destroy(fromScene);
    }

    update() {
        // 動かないので親クラスの画面外削除チェックなどだけ行う
        super.update();
    }
}