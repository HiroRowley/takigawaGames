export default class GameAssetLoader {
  static preload(scene) {
    const { load } = scene;

    load.spritesheet("player", "asset/takigawa/takigawaWalk10.png", {
      frameWidth: 597,
      frameHeight: 592,
    });
    load.spritesheet("noda", "asset/noda/noda.png", {
      frameWidth: 100,
      frameHeight: 128,
    });

    const images = {
      yoshida: "asset/yoshida/yoshida01.png",
      "yoshida-walk-2": "asset/yoshida/animation/yoshidaWalk02.png",
      "yoshida-walk-3": "asset/yoshida/animation/yoshidaWalk03.png",
      "yoshida-walk-4": "asset/yoshida/animation/yoshidaWalk04.png",
      rowley: "asset/rowley/rowleyWalking.png",
      shimba: "asset/shimba/shimba.png",
      dirt: "asset/stageGround/dirt.png",
      grass: "asset/stageGround/grass.png",
      pipe: "asset/stageGround/pipe.png",
      reihuuki: "asset/reihuuki/reihuuki.png",
      reihuukiSpill: "asset/reihuuki/reihuukiSpillWater.png",
      itemBlock: "asset/item/itemBlock.jpg",
      jousisu: "asset/jousisu/jousisu.png",
      darkOverlay: "asset/jousisu/dark.png",
      halo: "asset/jousisu/halo.png",
      baneNormall: "asset/item/baneNormall.png",
      baneStomp: "asset/item/baneStomp.png",
      ueno: "asset/ueno/ueno.png",
      bullet: "asset/ueno/bullet.png",
      stage3BG: "asset/BackGround/Stage3BackGround.png",
      rock: "asset/stageGround/rock.png",
      syainsyo: "asset/syainsyo/syainsyo.jpg",
      normalCloud: "asset/cloud/normalCloud.png",
      ZossCloud: "asset/cloud/ZossCloud.png",
    };

    for (const [key, path] of Object.entries(images)) {
      load.image(key, path);
    }

    const audio = {
      reihuukiNoise: "asset/sounds/reihuukiNoise.m4a",
      holyMusic: "asset/sounds/holyMusic.mp3",
      gameoverSound: "asset/sounds/gameoverSound.mp3",
      bane: "asset/sounds/bane.mp3",
      hit: "asset/sounds/getHit.mp3",
      Stage3BGM: "asset/sounds/battleWithRowely.mp3",
      Stage1BGM: "asset/sounds/Gemini音楽1.mp3",
      Stage2BGM: "asset/sounds/secondStageMusic.mp3",
      jumpSound: "asset/sounds/jump.mp3",
      enemyDown: "asset/sounds/enemyDown.mp3",
      shimbaStart: "asset/sounds/shimbaStart.mp3",
      laser: "asset/sounds/laser.mp3",
    };

    for (const [key, path] of Object.entries(audio)) {
      load.audio(key, path);
    }
  }
}
