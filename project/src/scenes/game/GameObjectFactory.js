import Player from "../../objects/Player.js";
import Noda from "../../objects/enemy/Noda.js";
import Yoshida from "../../objects/enemy/Yoshida.js";
import Shimba from "../../objects/enemy/Shimba.js";
import Rowley from "../../objects/enemy/Rowley.js";
import Ueno from "../../objects/enemy/Ueno.js";
import ItemBlock from "../../objects/traps/itemBlock.js";
import Reihuuki from "../../objects/traps/reihuuki.js";
import Bane from "../../objects/traps/bane.js";
import Cloud from "../../objects/traps/cloud.js";

export default class GameObjectFactory {
  constructor(scene, stageBuilder) {
    this.scene = scene;
    this.stageBuilder = stageBuilder;
  }

  createGroups() {
    const { physics } = this.scene;
    this.scene.grounds = physics.add.staticGroup();
    this.scene.enemies = physics.add.group();
    this.scene.traps = physics.add.group();
    this.scene.banes = physics.add.group();
    this.scene.bullets = physics.add.group();
    this.scene.uenos = physics.add.group();
    this.scene.yoshidas = physics.add.group();
    this.scene.pipeWarps = physics.add.staticGroup();
    this.scene.clouds = physics.add.group();
    this.scene.blocks = physics.add.group();
    this.scene.hiddenBlocks = physics.add.group();
    this.scene.lasers = physics.add.group();
  }

  createPlayer() {
    const { playerSpawn } = this.scene;
    const x = this.stageBuilder.getPixelX(playerSpawn.x);
    const y = this.stageBuilder.getPixelY(playerSpawn.y);
    this.scene.player = new Player(this.scene, x, y);
    this.scene.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  createEnemies() {
    for (const data of this.scene.enemySpawnList) {
      const enemy = this.createEnemy(data);
      if (!enemy) continue;

      this.scene.enemies.add(enemy);
      if (enemy instanceof Ueno) this.scene.uenos.add(enemy);
      if (enemy instanceof Yoshida) this.scene.yoshidas.add(enemy);
    }
  }

  createEnemy(data) {
    const x = this.stageBuilder.getPixelX(data.x);
    const y = this.stageBuilder.getPixelY(data.y);

    switch (data.type) {
      case "noda":
        return new Noda(this.scene, x, y);
      case "yoshida":
        return new Yoshida(this.scene, x, y);
      case "shimba":
        return new Shimba(this.scene, x, y);
      case "rowley":
        return new Rowley(this.scene, x, y);
      case "ueno": {
        const enemy = new Ueno(this.scene, x, y);
        enemy.setCustomConfig(data.bulletTexture, data.fireAngle);
        return enemy;
      }
      default:
        console.warn(`Unknown enemy type: ${data.type}`);
        return null;
    }
  }

  createTraps() {
    for (const data of this.scene.trapList) {
      const x = this.stageBuilder.getPixelX(data.x);
      const y = this.stageBuilder.getPixelY(data.y);

      switch (data.type) {
        case "reihuuki":
          this.scene.traps.add(new Reihuuki(this.scene, x, y));
          break;
        case "itemBlock":
          this.scene.blocks.add(
            new ItemBlock(
              this.scene,
              x,
              y,
              data.itemType,
              data.hidden || false
            )
          );
          break;
        case "bane":
          this.scene.banes.add(new Bane(this.scene, x, y));
          break;
        case "cloud":
          this.scene.clouds.add(new Cloud(this.scene, x, y));
          break;
        default:
          console.warn(`Unknown trap type: ${data.type}`);
      }
    }
  }

  createGoal() {
    const { goalData, TILE } = this.scene;
    if (!goalData) return;

    const width = (goalData.width || 1) * TILE;
    const height = (goalData.height || 1) * TILE;
    const centerX = goalData.x * TILE + width / 2;
    const centerY = goalData.y * TILE + height / 2;

    this.scene.goalZone = this.scene.add.zone(
      centerX,
      centerY,
      width,
      height
    );
    this.scene.physics.add.existing(this.scene.goalZone, true);
  }

  createTextureFrames() {
    this.addTextureFrame("rowley", 0, 294, 284, 400, 600);
    this.addTextureFrame("rowley", 1, 824, 284, 400, 600);
  }

  addTextureFrame(textureKey, frameKey, x, y, width, height) {
    const texture = this.scene.textures.get(textureKey);
    if (!texture || texture.has(frameKey)) return;
    texture.add(frameKey, 0, x, y, width, height);
  }
}
