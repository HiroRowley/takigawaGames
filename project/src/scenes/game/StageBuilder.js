export default class StageBuilder {
  constructor(scene) {
    this.scene = scene;
  }

  getPixelX(x) {
    return x * this.scene.TILE + this.scene.TILE / 2;
  }

  getPixelY(y) {
    return y * this.scene.TILE + this.scene.TILE / 2;
  }

  build() {
    const scene = this.scene;
    const hiddenGroundTiles = new Set();

    for (const decoration of scene.groundDecorationList) {
      if (decoration.hideGroundTiles === false) continue;

      const width = decoration.width || 1;
      const height = decoration.height || 1;
      for (let y = decoration.y; y < decoration.y + height; y++) {
        for (let x = decoration.x; x < decoration.x + width; x++) {
          hiddenGroundTiles.add(`${x},${y}`);
        }
      }
    }

    const groundTiles = new Set(
      scene.groundList.map((position) => `${position.x},${position.y}`)
    );

    for (const position of scene.groundList) {
      const texture =
        scene.stageNumber === 3
          ? "rock"
          : groundTiles.has(`${position.x},${position.y - 1}`)
            ? "dirt"
            : "grass";

      const ground = scene.physics.add.staticImage(
        this.getPixelX(position.x),
        this.getPixelY(position.y),
        texture
      );
      ground.setDisplaySize(scene.TILE, scene.TILE).refreshBody();

      if (hiddenGroundTiles.has(`${position.x},${position.y}`)) {
        ground.setVisible(false);
      }

      scene.grounds.add(ground);
    }

    for (const data of scene.pipeWarpList) {
      const zone = scene.add.zone(
        this.getPixelX(data.enterX),
        this.getPixelY(data.enterY) - 1,
        scene.TILE,
        scene.TILE
      );
      scene.physics.add.existing(zone, true);
      zone.warpData = data;
      scene.pipeWarps.add(zone);
    }

    for (const decoration of scene.groundDecorationList) {
      if (!decoration.texture) continue;

      const width = decoration.width || 1;
      const height = decoration.height || 1;
      const image = scene.add.image(
        (decoration.x + width / 2) * scene.TILE,
        (decoration.y + height / 2) * scene.TILE,
        decoration.texture
      );
      image.setDisplaySize(
        (decoration.displayWidth || width) * scene.TILE,
        (decoration.displayHeight || height) * scene.TILE
      );
      image.setDepth(decoration.depth ?? 0);
    }
  }
}
