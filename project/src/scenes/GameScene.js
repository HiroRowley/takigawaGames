import Phaser from "phaser";
import DataManager from "../managers/DataManager.js";
import createGameSceneState from "./createGameSceneState.js";
import CollisionManager from "./game/CollisionManager.js";
import GameAssetLoader from "./game/GameAssetLoader.js";
import GameAudioController from "./game/GameAudioController.js";
import GameFlowController from "./game/GameFlowController.js";
import GameHUD from "./game/GameHUD.js";
import GameObjectFactory from "./game/GameObjectFactory.js";
import Stage3Controller from "./game/Stage3Controller.js";
import StageBuilder from "./game/StageBuilder.js";
import StageRepository from "./game/StageRepository.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.stageRepository = new StageRepository();
  }

  init(data) {
    Object.assign(this, createGameSceneState(data?.stageNumber ?? 1));
  }

  preload() {
    GameAssetLoader.preload(this);
  }

  create() {
    this.physics.resume();
    this.physics.world.timeScale = 1;
    this.input.enabled = true;
    this.createBackground();

    this.applyStage(this.stageRepository.get(this.stageNumber));
    this.stageBuilder = new StageBuilder(this);
    this.objectFactory = new GameObjectFactory(this, this.stageBuilder);
    this.objectFactory.createGroups();
    this.objectFactory.createTextureFrames();

    this.stageBuilder.build();
    this.objectFactory.createPlayer();
    this.objectFactory.createEnemies();
    this.objectFactory.createTraps();
    this.objectFactory.createGoal();

    this.audioController = new GameAudioController(this);
    this.audioController.create(this.stageNumber);
    this.gameFlow = new GameFlowController(this, DataManager);
    this.gameFlow.registerPlayerEvents();

    this.collisionManager = new CollisionManager(this);
    this.collisionManager.register();

    this.stage3Controller = new Stage3Controller(this);
    this.stage3Controller.create();

    this.hud = new GameHUD(this, DataManager);
    this.hud.create();
  }

  createBackground() {
    if (this.stageNumber !== 3) {
      this.cameras.main.setBackgroundColor("#45a2c7");
      return;
    }

    const background = this.add.image(0, 0, "stage3BG").setOrigin(0, 0);
    background.displayWidth = this.scale.width;
    background.displayHeight = this.scale.height;
  }

  applyStage(stage) {
    this.stageData = stage.raw;
    this.TILE = stage.tileSize;
    this.groundList = stage.groundList;
    this.groundDecorationList = stage.groundDecorationList;
    this.pipeWarpList = stage.pipeWarpList;
    this.blockList = stage.blockList;
    this.hiddenBlockList = stage.hiddenBlockList;
    this.enemySpawnList = stage.enemySpawnList;
    this.trapList = stage.trapList;
    this.playerSpawn = stage.playerSpawn;
    this.goalData = stage.goal;
  }

  getPixelX(x) {
    return this.stageBuilder.getPixelX(x);
  }

  getPixelY(y) {
    return this.stageBuilder.getPixelY(y);
  }

  handleEnemyStomp(enemy, player) {
    this.gameFlow.handleEnemyStomp(enemy, player);
  }

  handlePlayerDamage(player, damageSource) {
    this.gameFlow.handlePlayerDamage(player, damageSource);
  }

  enterPipe(warpData) {
    this.gameFlow.enterPipe(warpData);
  }

  gameOver() {
    this.gameFlow.gameOver();
  }

  nextStage() {
    this.gameFlow.nextStage();
  }

  update(time) {
    if (this.isGameOver) return;

    this.player?.update(this.cursors);
    this.updateEnemies(time);
    this.removeOffscreenBullets();
    this.stage3Controller.update(time);
    this.hud.update();
  }

  updateEnemies(time) {
    for (const enemy of this.enemies.getChildren()) {
      enemy.update?.(this.player, time);

      if (this.isOffscreen(enemy)) {
        this.enemies.remove(enemy, true, true);
      }
    }
  }

  removeOffscreenBullets() {
    for (const bullet of this.bullets.getChildren()) {
      if (this.isOffscreen(bullet)) {
        this.bullets.remove(bullet, true, true);
      }
    }
  }

  isOffscreen(gameObject) {
    return (
      gameObject.y > 2000 ||
      gameObject.y < -2000 ||
      gameObject.x < -2000 ||
      gameObject.x > 2000
    );
  }
}
