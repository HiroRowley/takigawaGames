import Phaser from "phaser";
import DataManager from "../../managers/DataManager.js";

// ステージデータのインポート
import Stage1 from "../../stages/Stage1.js";
import Stage2 from "../../stages/Stage2.js";
import Stage3 from "../../stages/Stage3.js";
import SampleStage from "../../stages/SampleStage.js"

import Player from "../../objects/Player.js";
import Enemy from "../../objects/enemy/EnemyBase.js";
import Trap from "../../objects/traps/TrapBase.js";
import Noda from "../../objects/enemy/Noda.js";
import Yoshida from "../../objects/enemy/Yoshida.js";
import Shimba from "../../objects/enemy/Shimba.js";
import Rowley from "../../objects/enemy/Rowley.js";
import ItemBlock from "../../objects/traps/itemBlock.js";
import Ueno from "../../objects/enemy/Ueno.js"
// GameScene.js の19行目を修正
import Timer from "../../timer/Timer.js";

import Reihuuki from "../../objects/traps/reihuuki.js";
import Bane from "../../objects/traps/bane.js";

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
        this.load.image("itemBlock","asset/item/itemBlock.jpg");
        this.load.image("jousisu","asset/jousisu/jousisu.png");
        this.load.image("darkOverlay","asset/jousisu/dark.png");
        this.load.image("halo","asset/jousisu/halo.png");
        this.load.image("baneNormall","asset/item/baneNormall.png");
        this.load.image("baneStomp","asset/item/baneStomp.png");
        this.load.image("ueno","asset/ueno/ueno.png");
        this.load.image("bullet","asset/ueno/bullet.png");
        this.load.image("stage3BG","asset/BackGround/Stage3BackGround.png");
        this.load.image("rock", "asset/stageGround/rock.png");
        this.load.image("syainsyo", "asset/syainsyo/syainsyo.jpg");

        console.log("[preload] 画像アセットのロードを予約しました(yoshida含む)");
    }
    soundLoader(){
        // サウンドのロードはここで行います。
        // 例: this.load.audio("jump", "asset/sounds/jump.wav");
        this.load.audio("reihuukiNoise", "asset/sounds/reihuukiNoise.m4a");
        this.load.audio("holyMusic", "asset/sounds/holyMusic.mp3");
        this.load.audio("gameoverSound","asset/sounds/gameoverSound.mp3");
        this.load.audio("bane","asset/sounds/bane.mp3");
        this.load.audio("hit","asset/sounds/getHit.mp3");
        this.load.audio("Stage3BGM","asset/sounds/battleWithRowely.mp3");
        this.load.audio("Stage1BGM","asset/sounds/Gemini音楽1.mp3");
        this.load.audio("Stage2BGM","asset/sounds/secondStageMusic.mp3");
        this.load.audio("jumpSound","asset/sounds/jump.mp3");
        this.load.audio("enemyDown","asset/sounds/enemyDown.mp3");
        this.load.audio("shimbaStart","asset/sounds/shimbaStart.mp3");
        this.load.audio("laser","asset/sounds/laser.mp3");

    }

    spawnRandomEnemy() {//Rowley

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
            "yoshida",
            "ueno"
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
        if (this.stageNumber === 3) {

        // 画像背景
        const bg = this.add.image(
            0,
            0,
            "stage3BG"
        );

        bg.setOrigin(0, 0);

        bg.displayWidth = this.scale.width;

        bg.displayHeight = this.scale.height;

        } else {
            // 単色背景
            this.cameras.main.setBackgroundColor("#45a2c7");
        }

        
        console.log("[create] オブジェクトグループを初期化します。");
        // オブジェクトグループを静的グループ(staticGroup)として初期化
        this.grounds = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group();
        this.traps = this.physics.add.group(); // トラップ用のグループも一応初期化
        this.banes = this.physics.add.group();
        this.bullets = this.physics.add.group();
        this.uenos = this.physics.add.group();
        this.yoshidas = this.physics.add.group();

        // 1. ステージ読込
        this.loadStageData();

        // 2. 地形生成
        this.createGround();

        // 3. 各種オブジェクト生成
        this.createPlayer();
        this.createBossLaser();
        this.createEnemies();
        this.createBlocks();
        this.createTraps();
        this.createGoal();
        this.createSound();

        // ▼ ここに追加：ステージ3ならタイマーをセット
        if (this.stageNumber === 3) {
            this.timer = new Timer(this, 30); // 30秒タイマー
            
            // 30秒耐えきった時の処理
            this.timer.onTimeUp(() => {
                this.spawnGoalAndBlocks(); // ゴールを降下させるメソッドを呼ぶ
            });
        }
        
        // 4. コライダー（当たり判定）設定
        this.setupCollisions();

        // 5. プレイヤー死亡監視
        this.setupPlayerDeathListener();

        this.hpText = this.add.text(
            20,
            20,
            "",
            {
                fontSize: "28px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4
            }
        );

        this.paidHolidayText = this.add.text(
            20,
            60,
            "",
            {
                fontSize: "28px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4
            }
        );

        // カメラ固定
        this.hpText.setScrollFactor(0);
        this.paidHolidayText.setScrollFactor(0);

        // 最前面
        this.hpText.setDepth(9999);
        this.paidHolidayText.setDepth(9999);

        this.updateUI();

        this.isGameOver = false;

        this.isClearing = false; // ★ここを追加
        
        console.log("[create] シーンの初期構築がすべて完了しました。");
    
        //デバック用Gを押したらステージ３へ
        this.debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    }
    createBane(){
        this.bane = new Bane(this,500,400);
    }
    createBlocks(){
        this.blocks = this.physics.add.group();
    }
    createSound(){

    this.gameoverSound = this.sound.add("gameoverSound");
    this.baneSound = this.sound.add("bane");
    this.hitSound = this.sound.add("hit");
    this.isClearing = false; // ★ここを追加
    // =========================
    // ステージ別BGM
    // =========================

    this.stage1BGM = this.sound.add("Stage1BGM", {
        loop: true,
        volume: 0.5
    });

    this.stage2BGM = this.sound.add("Stage2BGM", {
        loop: true,
        volume: 0.5
    });

    this.stage3BGM = this.sound.add("Stage3BGM", {
        loop: true,
        volume: 0.8
    });
    this.jumpSound = this.sound.add("jumpSound", {
        volume: 0.5
    });
    this.enemyDownSound = this.sound.add("enemyDown", {
        volume: 0.6
    });
    this.shimbaStartSound = this.sound.add("shimbaStart", {
        volume: 0.7
    });

    // =========================
    // ステージごとに再生
    // =========================

    switch (this.stageNumber) {

        case 1:
            this.stage1BGM.play();
            break;

        case 2:
            this.stage2BGM.play();
            break;

        case 3:
            this.stage3BGM.play();
            break;
    }
}
    updateUI() {

        const hp =
            DataManager.getHP();

        const paidHolidays =
            DataManager.getPaidHolidays();

        this.hpText.setText(
            `HP : ${hp}`
        );

        this.paidHolidayText.setText(
            `有給 : ${paidHolidays}`
        );
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
        this.blockList = this.stageData.blockList || [];
        this.hiddenBlockList = this.stageData.hiddenBlockList || [];
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
                    trap = new Reihuuki(this, px, py);
                    // 冷風機は動的グループ (traps) に追加
                    this.traps.add(trap);
                    console.log(`[createTraps] ${data.type} を生成`);
                    break;
            case "itemBlock":
                trap = new ItemBlock(this, px, py, data.itemType);
                    // アイテムブロックは静的グループ (blocks) のみに追加
                    this.blocks.add(trap);
                    console.log(`[createTraps] ${data.type} を生成`);
                    break;
            case "bane":
                trap = new Bane(this, px, py);
                this.banes.add(trap); // ★this.traps ではなく、this.banes に追加する
                console.log(`[createTraps] ${data.type} を生成`); // ※バッククォーテーションに直しておきました
                break;
        }
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

            let texture;
 
            if (this.stageNumber === 3) {
                // ステージ3の場合はすべてrockにする
                texture = "rock";
            } else {
                // ステージ3以外は今まで通りdirtかgrass
                texture = hasGroundAbove ? "dirt" : "grass";
            }

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
        console.log("createGround切り分け",this.grounds.getChildren().length);
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
                case "ueno":
                    enemy = new Ueno(this,px,py);

                    enemy.setCustomConfig(pos.bulletTexture, pos.fireAngle);
                    break;
                default: 
                    console.warn(`[createEnemies] 未知の敵タイプ、または対応していないタイプのためスキップされました: "${pos.type}"`);
                    return; 
            }            
            this.enemies.add(enemy);
            

            if (enemy instanceof Ueno) {
                this.uenos.add(enemy);
            }

            if (enemy instanceof Yoshida) {
                this.yoshidas.add(enemy);
            }
            spawnedCount++;
            console.log(`[createEnemies] 敵 "${pos.type}" のインスタンスを生成し、グループに追加しました。`);
        });

        console.log(`[createEnemies] 敵の生成が終了しました。実際に生成された数: ${spawnedCount} / ${this.enemySpawnList.length}`);
    }

    createBossLaser() {
        this.lasers = this.physics.add.group();
    }

   // =====================================
    // ゴール生成（修正版）
    // =====================================
    createGoal() {
        if (!this.goalData) {
            console.warn("[createGoal] ゴールデータがありません。生成をスキップします。");
            return;
        }

        // タイル数からピクセル単位の幅と高さを計算
        const pWidth = (this.goalData.width || 1) * this.TILE;
        const pHeight = (this.goalData.height || 1) * this.TILE;

        // 左上のピクセル座標を計算（お持ちの getPixelX/Y はマスの中心を返すため、ここでは直接計算します）
        const startX = this.goalData.x * this.TILE;
        const startY = this.goalData.y * this.TILE;

        // PhaserのZoneは「中心座標」を基準に生成するため、範囲の中心点を計算
        const centerX = startX + pWidth / 2;
        const centerY = startY + pHeight / 2;

        // ① 画面に描画されない「Zone」オブジェクトを作成
        this.goalZone = this.add.zone(centerX, centerY, pWidth, pHeight);

        // ② 静的（static）な物理ボディを有効化して、重なり判定を可能にする（第2引数をtrueにするとstaticになります）
        this.physics.add.existing(this.goalZone, true);

        console.log(`[createGoal] 不可視のゴール範囲を配置しました。中心: (${centerX}, ${centerY}), サイズ: ${pWidth}x${pHeight}`);
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

        this.physics.add.collider(this.banes, this.grounds);

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
                if (player.body.velocity.y > 0 && player.body.bottom <= enemy.body.top + 15) {
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
        this.physics.add.overlap(
            this.player,
            this.bullets,
            this.handlePlayerDamage,
            null,
            this
        );
        if (this.goalZone) {
        this.physics.add.overlap(
            this.player,
            this.goalZone,
            () => {
                // 重なったら次ステージへの遷移処理を呼ぶ
                this.nextStage();
            },
            null,
            this
        );
    }
        this.physics.add.collider(
        this.uenos,
        this.yoshidas,
        (ueno, yoshida) => {

            yoshida.direction *= -1;

            // めり込み防止
            if (yoshida.direction === 1) {
                yoshida.x += 4;
            } else {
                yoshida.x -= 4;
            }
        },
        null,
        this
    );
    
        this.physics.add.collider(
            this.player,
            this.banes,
            (player, bane) => {

             // 上から踏んだ時だけ
            if (this.player.body.velocity.y > 0) {
                if(bane.bounce){
                    bane.bounce(player);
                }
            }

        }
    );

        this.physics.add.collider(
            this.player,
            this.traps,
            (player, trap) => {

                // 下から叩いたか
                const isHitFromBelow = player.body.touching.up && trap.body.touching.down;

                if (isHitFromBelow && trap.hit) {
                    trap.hit(player);
                }
            },
            null,
            this
        );

        // ダメージ判定 (Trap)
        // Reihuuki
        this.physics.add.overlap(
            this.player,
            this.traps,
            (player, trap) => {
            
                if (trap.activate) {
                    trap.activate(player);
                }
            }
        );

        // ItemBlock
        this.physics.add.collider(
            this.player,
            this.blocks,
            (player, block) => {
            
                const hitFromBelow = player.body.touching.up && block.body.touching.down;
            
                if (hitFromBelow && block.hit) {
                    block.hit(player);
                }
            }
        );

        
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
        this.enemyDownSound.play();

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

        // 二重実行防止
        if (this.isGameOver) {
            return;
        }
        this.sound.stopAll();

        this.gameoverSound.play({
            loop:false,
            volume:0.8
        })

        this.isGameOver = true;

        console.log("[SceneTransition] ゲームオーバー演出開始");

        // =========================
        // ヒットストップ
        // =========================

        this.physics.pause();

        // 敵停止
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.anims) {
                enemy.anims.pause();
            }
        });

        // プレイヤー停止
        this.player.setVelocity(0, 0);

        // =========================
        // 画面シェイク
        // =========================

        this.cameras.main.shake(
            300,   // 時間
            0.03   // 強さ
        );

        // =========================
        // 少し止める
        // =========================

        this.time.delayedCall(1000, () => {

            // =========================
            // 再開
            // =========================

            this.physics.resume();

            this.physics.world.timeScale = 2;

            // =========================
            // プレイヤー死亡演出
            // =========================

            this.player.body.enable = false;

            this.player.setVelocity(
                150,
                -400
            );

            this.player.setAngularVelocity(600);

            this.player.setGravityY(1200);

            // =========================
            // 少し待ってResultへ
            // =========================

             
        console.log("[SceneTransition] プレイヤーがミスしました。");
 
        if (DataManager) {

    // DataManager側に処理を集約
    DataManager.resetPlayerData();

    const remainPaidHolidays =
        DataManager.getPaidHolidays();

    console.log(
        `[有給管理] 残り有給: ${remainPaidHolidays}日`
    );

    // ResultSceneへ
    this.scene.start("ResultScene", {
        paidHolidays: remainPaidHolidays,
        stageNumber: this.stageNumber
    });

} else {

    this.scene.start("ResultScene", {
        paidHolidays: 0
    });
}

        });
    }

    // =====================================
    // 次ステージ / クリア判定
    // =====================================
   nextStage() {

        this.sound.stopAll();

        if (this._cleared) return;
        this._cleared = true;

        const nextStage = this.stageNumber + 1;

        console.log(`[SceneTransition] ステージクリア！ 次のステージ: ${nextStage}`);

<<<<<<< HEAD:project/src/scenes/GameScene/GameScene.js
        // ----------------------------------------
        // ■ 最終ステージ（ステージ3）クリア
        // ----------------------------------------
        if (this.stageNumber === 3) {

            console.log("ステージ3クリア → エンディング演出へ");

            this.physics.pause();
            this.input.enabled = false;

            // ★ここが重要：必ず演出に渡すだけ
            this.scene.launch("StageClearTransitionScene", {
                next: "OfficeScene"
            });

=======
        //エンディングへ
        if (this.stageNumber === 3) {
            console.log("ステージ3クリア → エンディングへ");

            this.scene.start("StageClearTransitionScene");
            return;
        }

        if (nextStage > 3) {
            console.log("[SceneTransition] 全ステージクリア。ResultSceneへ遷移します。");
            this.scene.start("ResultScene", { clear: true }); 
>>>>>>> 0582a82083b29ae48494097b17de6606d7e59da4:project/src/scenes/GameScene.js
            return;
        }

        // ----------------------------------------
        // ■ 全ステージクリア（念のため保険）
        // ----------------------------------------
        if (nextStage > 3) {

            console.log("[SceneTransition] 全ステージクリア → ClearScene");

            this.physics.pause();
            this.input.enabled = false;

            this.scene.launch("StageClearTransitionScene", {
                next: "ClearScene",
                data: { clear: true }
            });

            return;
        }

        // ----------------------------------------
        // ■ 通常ステージ遷移
        // ----------------------------------------
        console.log("[SceneTransition] 次ステージへ");

        this.physics.pause();
        this.input.enabled = false;

        this.scene.launch("StageClearTransitionScene", {
            next: "GameScene",
            data: { stageNumber: nextStage }
        });
    }

    // =====================================
    // update
    // =====================================
        update(time, delta) {
            if (this.isGameOver) {
                return; 
            }

            // --- デバッグ用：Gキーでステージ3へ ---
            if (this.debugKey.isDown) {
            console.log("[Debug] Gキー入力：ステージ3へスキップします");
            
            // 音を止めて、ステージ3へ遷移
            this.sound.stopAll();
            DataManager.setCurrentStage(3);
            this.scene.start("GameScene", { stageNumber: 3 });
            return; // 即座に抜ける    }
            // ------------------------------------// ...以降、既存の update 処理
            }

            // ▼ ここに追加：タイマーの更新
        if (this.timer) {
            this.timer.update();
        }

            console.log("プレイヤーの高さ",this.player.y);

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
                enemy.y > 2000 ||
                enemy.y < -2000 ||
                enemy.x < -2000 ||
                enemy.x > 2000
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
        this.bullets.getChildren().forEach(bullet => {
            if (bullet.x < -2000 || bullet.x > 2000 || bullet.y < -2000 || bullet.y > 2000) {
                console.log("[CleanUp] 弾が画面外に出たため削除します。");
                this.bullets.remove(bullet, true, true);
            }
        });
        this.updateUI();
    }

    // =====================================
    // 30秒経過時のイベント（社員証を降らせる）
    // =====================================
    spawnGoalAndBlocks() {
        console.log("[Event] 30秒経過！社員証（ゴール）がゆっくり降ってきます！");

        // 1. 座標の設定
        const dropX = this.getPixelX(23); 
        const targetY = 370; // ここに静止させたいY座標を指定してください
        const startY = -100; 

        // 2. 物理演算を使わず、単なる画像として生成
        const syainsyo = this.add.image(dropX, startY, "syainsyo");
        syainsyo.setDisplaySize(64, 64);
        syainsyo.setDepth(1000); // UIより手前に表示

        // 3. Tweenアニメーションでゆっくり降ろして止める
        this.tweens.add({
            targets: syainsyo,
            y: targetY,
            duration: 4500,        // 2.5秒かけてゆっくり降下（数値を増やすとさらに遅くなる）
            ease: 'Power2',        // 加速・減速の曲線（Power1〜3で調整可能）
            onComplete: () => {
                console.log("[Goal] 到着！取得判定を有効にします。");

                // 到着した瞬間に、物理体を有効化して重なり判定を付ける
                this.physics.add.existing(syainsyo, true);

                // 5. プレイヤーと社員証の重なり（取得）判定
                this.physics.add.overlap(
                    this.player,
                    syainsyo,
                    () => {
                        if (this.isClearing) return;
                        this.isClearing = true;
                        syainsyo.destroy(); 
                        this.nextStage();
                    },
                    null,
                    this
                );
            }
        });
    }
}