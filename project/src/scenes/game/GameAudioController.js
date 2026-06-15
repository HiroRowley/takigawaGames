export default class GameAudioController {
  constructor(scene) {
    this.scene = scene;
  }

  create(stageNumber) {
    this.scene.gameoverSound = this.scene.sound.add("gameoverSound");
    this.scene.baneSound = this.scene.sound.add("bane");
    this.scene.hitSound = this.scene.sound.add("hit");
    this.scene.jumpSound = this.scene.sound.add("jumpSound", { volume: 0.5 });
    this.scene.enemyDownSound = this.scene.sound.add("enemyDown", {
      volume: 0.6,
    });
    this.scene.shimbaStartSound = this.scene.sound.add("shimbaStart", {
      volume: 0.7,
    });

    const bgmConfig = {
      1: ["Stage1BGM", 0.5],
      2: ["Stage2BGM", 0.5],
      3: ["Stage3BGM", 0.8],
    };
    const config = bgmConfig[stageNumber];
    if (!config) return;

    const [key, volume] = config;
    this.bgm = this.scene.sound.add(key, { loop: true, volume });
    this.bgm.play();
  }

  stopAll() {
    this.scene.sound.stopAll();
  }
}
