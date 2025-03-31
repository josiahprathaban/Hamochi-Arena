import { GameObjects, Scene } from "phaser";

export class GameEnd extends Scene {
  prompt: GameObjects.Text;
  isWon: Boolean;

  constructor() {
    super("GameEnd");
  }

  init(data) {
    this.isWon = data.isWon
  }

  async create() {

    this.add
      .rectangle(
        0,
        0,
        Number(this.game.config.width),
        Number(this.game.config.height),
        0x000000
      ).setAlpha(0.1).setOrigin(0)



    this.prompt = this.add
      .text(Number(this.game.config.width) / 2, 1550, "", {
        fontFamily: "Arial",
        fontSize: "64px",
        color: "#a64245",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    if (this.isWon) {
      this.prompt.setText("You Win!");
    } else {
      this.prompt.setText("You Lost!");
    }

    this.add
      .text(Number(this.game.config.width) / 2, 1680, "Restart", {
        fontFamily: "Arial",
        fontSize: "64px",
        backgroundColor: "#a64245",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", async () => {
        location.reload();
      });
  }
}
