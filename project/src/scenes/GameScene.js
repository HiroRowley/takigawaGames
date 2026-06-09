import Phaser from "phaser";
import DataManager from "../managers/DataManager.js";

// ステージデータのインポート
import Stage1 from "../stages/Stage1.js";
import Stage2 from "../stages/Stage2.js";
import Stage3 from "../stages/Stage3.js";

import Player from "../objects/Player.js";
import Enemy from "../objects/enemy/EnemyBase.js";
import Trap from "../objects/traps/TrapBase.js";
import Noda from "../objects/enemy/Noda.js";
import Yoshida from "../objects/enemy/Yoshida.js";
import Shimba from "../objects/enemy/Shimba.js";
import Rowley from "../objects/enemy/Rowley.js";

import Reihuuki from "../objects/traps/rehuuki.js";

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
        this.enemySpawnTimer = 0;
    }

    // =====================================
    // init
    // =====================================
    init(data) {
        // もし引数dataからステージ番号が渡ってくる構成なら、そちらを優先するようケアしておきます
        this.stageNumber = (data && data.stageNumber) || 1;
        console.log(`[init] ゲームシーンを開始しました。ステージ番号: ${this.stageNumber}`);
    }

    // =====================================
    // preload
    // =====================================
    preload() {
        console.log("[preload] アセットのロードを開始します...");
        this.imageLoader();
        this.soundLoader();
    }
    

    imageLoader(){
        // 全ステージで使う画像をロード
        this.load.image("player", "asset/takigawa/player.png");
        this.load.image("noda", "asset/noda/noda.png");
        this.load.image("yoshida", "asset/yoshida/yoshida.png");
        this.load.image("rowley", "asset/rowley/rowley.png");
        // ※ もしground画像を用意した場合は、ここでロードしてください。
        // 例: this.load.image("ground", "asset/ground.png");
        this.load.image("shimba", "asset/shimba/shimba.png");
        this.load.image("dirt", "asset/stageGround/dirt.png");
        this.load.image("grass", "asset/stageGround/grass.png");
        this.load.image("reihuuki", "asset/reihuuki/reihuuki.png");
        this.load.image("reihuukiSpill", "asset/reihuuki/reihuukiSpillWater.png");
        console.log("[preload] 画像アセットのロードを予約しました(yoshida含む)");
    }
    soundLoader(){
        // サウンドのロードはここで行います。
        // 例: this.load.audio("jump", "asset/sounds/jump.wav");
        this.load.audio("reihuukiNoise", "asset/sounds/reihuukiNoise.m4a");
    }
    spawnRandomEnemy() {

    // =========================
    // ランダム座標
    // =========================

    const x = Phaser.Math.Between(100, 700);

    // 上空から落とす
    const y = 0;

    // =========================
    // ランダム雑魚
    // =========================

    const types = [
        "noda",
        "yoshida"
    ];

    const type =
        Phaser.Utils.Array.GetRandom(types);

    let enemy;

    switch (type) {

        case "noda":
            enemy = new Noda(this, x, y);
            break;

        case "yoshida":
            enemy = new Yoshida(this, x, y);
            break;
    }

    if (!enemy) {
        return;
    }

    this.enemies.add(enemy);

    console.log(
        `[Spawn] 雑魚敵生成: ${type}`
    );
}

    // =====================================
    // create
    // =====================================
    create() {
        
        console.log("[create] オブジェクトグループを初期化します。");
        // オブジェクトグループを静的グループ(staticGroup)として初期化
        this.grounds = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group();
        this.traps = this.physics.add.group(); // トラップ用のグループも一応初期化

        // 1. ステージ読込
        this.loadStageData();

        // 2. 地形生成
        this.createGround();

        // 3. 各種オブジェクト生成
        this.createPlayer();
        this.createBossLaser();
        this.createEnemies();
        this.createTraps();
        this.createGoal();
        
        // 4. コライダー（当たり判定）設定
        this.setupCollisions();

        // 5. プレイヤー死亡監視
        this.setupPlayerDeathListener();
        
        
        
        console.log("[create] シーンの初期構築がすべて完了しました。");
    }

    // =====================================
    // ステージ読込とデータ整形
    // =====================================
    loadStageData() {
        console.log(`[loadStageData] Stage${this.stageNumber} データの読み込みを開始します。`);
        switch (this.stageNumber) {
            case 1:
                this.stageData = Stage1;
                break;
            case 2:
                this.stageData = Stage2;
                break;
            case 3:
                this.stageData = Stage3;
                break;
            default:
                console.error(`ステージ ${this.stageNumber} のデータが見つかりません。`);
                return;
        }

        // タイルサイズの取得（ステージデータにTILEプロパティがない場合は64をデフォルトとする）
        this.TILE = this.stageData.TILE || 64;

        // データが存在しないプロパティは空配列 [] で初期化
        this.groundList = this.stageData.groundList || [];
        this.enemySpawnList = this.stageData.enemySpawnList || [];
        this.trapList = this.stageData.trapList || [];

        // 必須データの取得
        this.playerSpawn = this.stageData.playerSpawn;
        this.goalData = this.stageData.goalPosition || this.stageData.goal;

        console.log(`[loadStageData] 読み込み結果 -> TILE: ${this.TILE}, 地形数: ${this.groundList.length}件, 敵データ数: ${this.enemySpawnList.length}件`);
        if(this.enemySpawnList.length > 0) {
            console.log("[loadStageData] 敵配置データ内訳:", JSON.stringify(this.enemySpawnList));
        }
    }

    // =====================================
    // 座標変換ヘルパー関数 タイル座標 → ピクセル座標変換
    // =====================================
    getPixelX(x) {
        return this.TILE ? (x * this.TILE + this.TILE / 2) : x;
    }

    getPixelY(y) {
        return this.TILE ? (y * this.TILE + this.TILE / 2) : y;
    }
    
    createTraps() {

    console.log(
        `[createTraps] トラップ生成開始`
    );

    this.trapList.forEach(data => {

        const px = this.getPixelX(data.x);

        const py = this.getPixelY(data.y);

        let trap;

        switch (data.type) {

            case "reihuuki":
                trap =new Reihuuki(this,px,py);
                break;
        }

        if (!trap) {
            return;
        }

        this.traps.add(trap);

        console.log(
            `[createTraps] ${data.type} を生成`
        );
    });
}

    // =====================================
    // 地形生成
    // =====================================
        createGround() {

        console.log(`[createGround] 地形生成開始`);

        this.groundList.forEach(pos => {

            const px = this.getPixelX(pos.x);
            const py = this.getPixelY(pos.y);

            // =========================
            // 上にブロックがあるか判定
            // =========================

            const hasGroundAbove =
                this.groundList.some(other => {
                    return (
                        other.x === pos.x &&
                        other.y === pos.y - 1
                    );
                });

            // =========================
            // 画像選択
            // =========================

            const texture =
                hasGroundAbove
                    ? "dirt"
                    : "grass";

            // =========================
            // staticImage生成
            // =========================

            const ground =
                this.physics.add.staticImage(
                    px,
                    py,
                    texture
                );

            ground.setDisplaySize(
                this.TILE,
                this.TILE
            );

            ground.refreshBody();

            this.grounds.add(ground);
        });

        console.log("[createGround] 完了");
    }

    // =====================================
    // Player生成
    // =====================================
    createPlayer() {
        if (!this.playerSpawn) {
            console.error("[createPlayer] プレイヤーの初期位置（playerSpawn）がステージデータに定義されていません！");
            return;
        }
        const px = this.getPixelX(this.playerSpawn.x);
        const py = this.getPixelY(this.playerSpawn.y);

        this.player = new Player(this, px, py);
        this.cursors = this.input.keyboard.createCursorKeys();
        console.log(`[createPlayer] プレイヤーを生成しました。位置: (${px}, ${py})`);
    }

    // =====================================
    // Enemy生成
    // =====================================
    createEnemies() {
        console.log(`[createEnemies] 敵の生成処理に入りました。データ総数: ${this.enemySpawnList.length}`);
        
        let spawnedCount = 0;

        this.enemySpawnList.forEach((pos, index) => {
            const px = this.getPixelX(pos.x);
            const py = this.getPixelY(pos.y);
            

            let enemy; 
            console.log(`[createEnemies] データ[${index}] を解析中... type: "${pos.type}", 位置: (${px}, ${py})`);

            switch (pos.type) {
                case "noda": 
                    enemy = new Noda(this, px, py);
                    break; 
                
                case "yoshida":
                    enemy = new Yoshida(this, px, py);
                    break;
                case "shimba":
                    enemy = new Shimba(this, px, py);
                    break;
                case "rowley": 
                    enemy = new Rowley(this, px, py);
                    break;
                default: 
                    console.warn(`[createEnemies] 未知の敵タイプ、または対応していないタイプのためスキップされました: "${pos.type}"`);
                    return; 
            }            
            this.enemies.add(enemy);
            spawnedCount++;
            console.log(`[createEnemies] 敵 "${pos.type}" のインスタンスを生成し、グループに追加しました。`);
        });

        console.log(`[createEnemies] 敵の生成が終了しました。実際に生成された数: ${spawnedCount} / ${this.enemySpawnList.length}`);
    }

    createBossLaser() {
        this.lasers = this.physics.add.group();
    }

    // =====================================
    // ゴール生成
    // =====================================
    createGoal() {
        if (!this.goalData) {
            console.warn("[createGoal] ゴールデータがありません。生成をスキップします。");
            return;
        }

        const px = this.getPixelX(this.goalData.x);
        const py = this.getPixelY(this.goalData.y);

        this.goalSprite = this.physics.add.staticSprite(px, py, "goal");
        console.log(`[createGoal] ゴールを配置しました。位置: (${px}, ${py})`);
    }

    // =====================================
    // Collider設定（追加・修正版）
    // =====================================
    setupCollisions() {
        console.log("[setupCollisions] 当たり判定（コライダー・オーバーラップ）を設定します。");
        // 【重要】プレイヤーと地面の衝突判定を追加（これで床に立ちます）
        this.physics.add.collider(this.player, this.grounds);

        // 敵と地面の衝突判定も追加（敵が下に落ちていかないようにする）
        this.physics.add.collider(this.enemies, this.grounds);

        // プレイヤーと敵の重なり（踏みつけ・被ダメージ）判定
        this.physics.add.overlap(
            this.player,
            
            this.enemies,
            
            (player, enemy) => {
                // ★★★ ここを追加・修正 ★★★
            // 相手がShimba（クラス名で判定）の場合は、踏みつけを無視して一発ダメージ
            if (enemy.constructor.name === "Shimba") {
                this.handlePlayerDamage(player, enemy);
                return; 
            }
                if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
                    this.handleEnemyStomp(enemy, player);
                } else {
                    this.handlePlayerDamage(player, enemy);
                }
            },
            null,
            this
        );
        this.physics.add.overlap(
            this.player,
            this.lasers,
            this.handlePlayerDamage,
            null,
            this
        );

        // ダメージ判定 (Trap)
        this.physics.add.overlap(
    this.player,
    this.traps,
    (player, trap) => {

        if (trap.activate) {
            trap.activate(player);
        }
    },
    null,
    this
);

        // ゴール判定
        if (this.goalSprite) {
            this.physics.add.overlap(
                this.player,
                this.goalSprite,
                () => { this.nextStage(); },
                null,
                this
            );
        }
    }

    // =====================================
    // Player死亡監視
    // =====================================
    setupPlayerDeathListener() {
        this.player.on("late", () => {
            console.log("[Event] プレイヤー死亡イベントを受け取りました。");
            this.gameOver();
        });
    }

    // =====================================
    // 敵を踏みつけたときの処理
    // =====================================
    handleEnemyStomp(enemy, player) {
        console.log("[Combat] 敵を踏みつけました。");

        player.setVelocityY(-300); 

        if (enemy.die) {
            enemy.die();
        } else {
            enemy.destroy(); 
        }
    }

    // =====================================
    // ダメージ処理
    // =====================================
    handlePlayerDamage(player, damageSource) {
        if (!damageSource.getDamage) return;
        const damage = damageSource.getDamage();
        console.log(`[Combat] プレイヤーがダメージを受けます。ソース: ${damageSource.constructor.name}, ダメージ量: ${damage}`);
        player.takeDamage(damage);
    }

    // =====================================
    // ゲームオーバー
    // =====================================
    gameOver() {
        console.log("[SceneTransition] ゲームオーバー。ResultSceneへ遷移します。");
        if(DataManager && DataManager.resetPlayerData) {
            DataManager.resetPlayerData();
        }
        this.scene.start("ResultScene");
    }

    // =====================================
    // 次ステージ / クリア判定
    // =====================================
    nextStage() {
        const nextStage = this.stageNumber + 1;
        console.log(`[SceneTransition] ステージクリア！ 次のステージ: ${nextStage}`);

        if (nextStage > 3) {
            console.log("[SceneTransition] 全ステージクリア。ResultSceneへ遷移します。");
            this.scene.start("ResultScene", { clear: true }); 
            return;
        }

        DataManager.setCurrentStage(nextStage);
        this.scene.start("GameScene", { stageNumber: nextStage });
    }

    // =====================================
    // update
    // =====================================
        update(time, delta) {

        // =========================
        // プレイヤー更新
        // =========================

        if (this.player && this.player.update) {
            this.player.update(this.cursors);
        }

        // =========================
        // 敵更新
        // =========================

        this.enemies.getChildren().forEach(enemy => {

            if (enemy.update) {

                // player と time を渡す
                enemy.update(this.player, time);
            }

            // =========================
            // 画面外削除
            // =========================

            if (
                enemy.y > 750 ||
                enemy.y < -900 ||
                enemy.x < -900 ||
                enemy.x > 1300
            ) {

                console.log(
                    `[CleanUp] 敵が画面外に出たため削除します。タイプ: ${enemy.constructor.name}`
                );

                this.enemies.remove(enemy, true, true);
            }
        });
        const hasRowley =
            this.enemies.getChildren().some(
                enemy => enemy instanceof Rowley
            );

        if (hasRowley && time > this.enemySpawnTimer) {

            this.enemySpawnTimer =
            time + 4000;

            this.spawnRandomEnemy();
        }
    }
}