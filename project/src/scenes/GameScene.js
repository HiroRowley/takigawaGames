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
import Ueno from "../objects/enemy/Ueno.js";

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
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


    imageLoader() {
        // 全ステージで使う画像をロード
        this.load.spritesheet("player", "asset/takigawa/takigawaWalk10.png", {
            frameWidth: 597,
            frameHeight: 592
        });

        this.load.image("noda", "asset/noda/noda.png");
        this.load.image("yoshida", "asset/yoshida/yoshida.png");
        // ※ もしground画像を用意した場合は、ここでロードしてください。
        // 例: this.load.image("ground", "asset/ground.png");
        this.load.image("shimba", "asset/shimba/shimba.png");
        this.load.image("ueno", "asset/ueno/ueno.png"); // 砲台本体
        this.load.image("bullet", "asset/ueno/bullet.png"); // 弾（とりあえずのデフォルト）
        // もしハンマーなどを投げさせたいなら、それもロード
        // this.load.image("hammer", "asset/ueno/hammer.png");
        console.log("[preload] 画像アセットのロードを予約しました(yoshida含む)");
    }
    soundLoader() {
        // サウンドのロードはここで行います。
        // 例: this.load.audio("jump", "asset/sounds/jump.wav");
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

        // ★★★ ここを追加：弾専用の物理グループを作成 ★★★
        this.bullets = this.physics.add.group();
        // 1. ステージ読込
        this.loadStageData();

        // 2. 地形生成
        this.createGround();

        // 3. 各種オブジェクト生成
        this.createPlayer();
        this.createEnemies();
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
        if (this.enemySpawnList.length > 0) {
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

    // =====================================
    // 地形生成
    // =====================================
    createGround() {
        console.log(`[createGround] 地形生成を開始します。配置予定数: ${this.groundList.length}`);
        this.groundList.forEach(pos => {
            const px = this.getPixelX(pos.x);
            const py = this.getPixelY(pos.y);

            let ground;

            if (this.stageNumber === 1 || this.stageNumber === 2) {
                // 画像アセットがある場合は、スプライトを生成してグループに追加
                const hasGroundAbove = this.groundList.some(otherPos => {
                    return otherPos.x === pos.x && otherPos.y === pos.y - 1;
                });
                if (hasGroundAbove) {
                    ground = this.add.sprite(px, py, "dirt");
                } else {
                    ground = this.add.sprite(px, py, "grass");
                }
                ground.setOrigin(0.5, 0.5); // タイルの中心を基準にする
            } else {
                // 画像アセットがない場合は、茶色の四角(Rectangle)を生成してグループに追加
                ground = this.add.rectangle(px, py, this.TILE, this.TILE, 0x654321);
            }

            // 静的グループに登録して物理化する
            this.grounds.add(ground);

            // 物理ボディのサイズを四角に合わせる
            ground.body.setSize(this.TILE, this.TILE);
        });
        console.log("[createGround] 地形生成が完了しました。");
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
                case "ueno":
                    enemy = new Ueno(this, px, py);
                    // もしステージデータ側でカスタム設定（弾の種類や角度）があれば適用する
                    enemy.setCustomConfig(pos.bulletTexture, pos.fireAngle);
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
    // Collider設定
    // =====================================
    setupCollisions() {
        console.log("[setupCollisions] 当たり判定（コライダー・オーバーラップ）を設定します。");
        this.physics.add.collider(this.player, this.grounds);
        this.physics.add.collider(this.enemies, this.grounds);

        // プレイヤーと敵の重なり判定
        this.physics.add.overlap(
            this.player,
            this.enemies,
            (player, enemy) => {
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

        // プレイヤーと弾の当たり判定
        this.physics.add.overlap(
            this.player,
            this.bullets,
            this.handlePlayerDamage,
            null,
            this
        );

        // ダメージ判定 (Trap)
        this.physics.add.overlap(
            this.player,
            this.traps,
            this.handlePlayerDamage,
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
        if (DataManager && DataManager.resetPlayerData) {
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
    update() {
        if (this.player && this.player.update) {
            this.player.update(this.cursors);
        }

        this.enemies.getChildren().forEach(enemy => {
            enemy.update?.();
        });

        // 敵の画面外チェック（完全に独立させました）
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.y > 750 || enemy.y < -100 || enemy.x < -100 || enemy.x > 900) {
                console.log(`[CleanUp] 敵が画面外に出たため削除します。タイプ: ${enemy.constructor.name}`);
                this.enemies.remove(enemy, true, true);
            }
        });

        // ★修正: 弾の画面外削除（入れ子バグを完全に解消し独立化）
        this.bullets.getChildren().forEach(bullet => {
            if (bullet.x < -50 || bullet.x > 950 || bullet.y < -50 || bullet.y > 750) {
                console.log("[CleanUp] 弾が画面外に出たため削除します。");
                this.bullets.remove(bullet, true, true);
            }
        });
    }
}
