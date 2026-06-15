export default class GameHUD {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
  }

  create() {
    this.hpText = this.createText(20, 20, 5);
    this.paidHolidayText = this.createText(20, 60, 4);
    this.update();
  }

  createText(x, y, strokeThickness) {
    return this.scene.add
      .text(x, y, "", {
        fontSize: "28px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness,
      })
      .setScrollFactor(0)
      .setDepth(9999);
  }

  update() {
    this.hpText?.setText(`HP : ${this.gameState.getHP()}`);
    this.paidHolidayText?.setText(
      `有給 : ${this.gameState.getPaidHolidays()}`
    );
  }
}
