// V4 Choice of attack

import { GameObjects, Scene } from "phaser";
import questions from "../questions.json";

export class Game extends Scene {
  background: GameObjects.Image | undefined;
  imgHero: GameObjects.Image | undefined;
  imgOpponent: GameObjects.Image | undefined;
  imgMaskHero: GameObjects.Image | undefined;
  imgMaskOpponent: GameObjects.Image | undefined;
  imgOpponentThinking: GameObjects.Image | undefined;
  sptDustHero: GameObjects.Sprite | undefined;
  sptDustOpponent: GameObjects.Sprite | undefined;
  gameCamera: Phaser.Cameras.Scene2D.Camera | undefined;
  optionButtons: GameObjects.Container[] = [];
  questionBubble: GameObjects.Container | undefined;
  currentQuestion: number = 0;
  playersTween: Phaser.Tweens.Tween | undefined;
  player: String = "";
  enterBtn: GameObjects.Text;
  prompt: GameObjects.Text;
  indicator: GameObjects.Image;
  isGameEnded: Boolean = false;
  theme: String
  barWidth: number = 300;
  barHeight: number = 15;
  heroProgressBar: GameObjects.Graphics;
  heroProgressBarBg: GameObjects.Rectangle;
  heroTimer: Phaser.Time.TimerEvent;
  heroProgress: number = 0;
  opponentProgress: number = 0;
  opponentTimer: Phaser.Time.TimerEvent;
  opponentProgressBarBg: GameObjects.Rectangle;
  opponentProgressBar: GameObjects.Graphics;
  questions: Array<any>;
  isHeroLastQuestionCorrect: Boolean = true
  isOpponentLastQuestionCorrect: Boolean = true

  constructor() {
    super("Game");
  }

  async create() {
    this.questions = this.shuffleArray(questions)
    const params = new URLSearchParams(window.location.search);
    this.theme = params.get('theme') ?? "market";
    // animations
    this.anims.create({
      key: "animDust",
      frames: this.anims.generateFrameNumbers("sptDust", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "animDust2",
      frames: this.anims.generateFrameNumbers("sptDust", {
        frames: [6, 7, 8, 9],
      }),
      frameRate: 5,
    });

    this.background = this.add
      .image(0, 0, this.theme == "study" ? "background2" : "background")
      .setOrigin(0.32, 0.3)
    this.add
      .rectangle(
        Number(this.game.config.width) / 2,
        100,
        Number(this.game.config.width) - 80,
        30,
        0xffffff
      )
      .setScrollFactor(0);

    this.add
      .rectangle(
        Number(this.game.config.width) / 2,
        1650,
        Number(this.game.config.width),
        600,
        0xf9dcb0
      )
      .setScrollFactor(0);
    this.add
      .rectangle(
        Number(this.game.config.width) / 2,
        1240,
        Number(this.game.config.width),
        220,
        0xdb4b31
      )
      .setScrollFactor(0);

    this.add
      .rectangle(
        100,
        1265,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);
    this.add
      .rectangle(
        200,
        1265,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);
    this.add
      .rectangle(
        300,
        1265,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);

    this.add
      .rectangle(
        Number(this.game.config.width) - 100,
        1265,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);
    this.add
      .rectangle(
        Number(this.game.config.width) - 200,
        1265,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);
    this.add
      .rectangle(
        Number(this.game.config.width) - 300,
        1265,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);


    this.indicator = this.add
      .image(Number(this.game.config.width) / 2, 70, "imgIndicator")
      .setOrigin(0.5)
      .setScale(0.5)
      .setScrollFactor(0)
      .setAlpha(0);

    this.imgHero = this.add
      .image(200, 1000, "imgHero")
      .setDepth(100)
      .setScale(1.5)
      .setFlipX(true)
      .setAlpha(0);
    this.sptDustHero = this.add
      .sprite(0, 0, "sptDust")
      .setOrigin(0)
      .setDepth(2000)
      .setScale(2)
      .setFlipX(true)
      .setFrame(9);

    this.imgOpponent = this.add
      .image(Number(this.game.config.width) - 200, 1000, "imgOpponent")
      .setDepth(99)
      .setScale(1.5)
      .setAlpha(0);
    this.sptDustOpponent = this.add
      .sprite(0, 0, "sptDust")
      .setOrigin(0)
      .setDepth(2000)
      .setScale(2)
      .setFrame(9);
    this.imgOpponentThinking = this.add
      .sprite(0, 0, "imgTimer")
      .setOrigin(0)
      .setDepth(2000)
      .setScale(0.3)
      .setAlpha(0);

    this.playersTween = this.tweens.add({
      targets: [this.imgHero, this.imgOpponent],
      scaleX: 1.45,
      scaleY: 1.55,
      y: this.imgHero.y - 5,
      duration: 1000,
      ease: "Linear",
      repeat: -1,
      yoyo: true,
    });

    this.gameCamera = this.cameras.main;
    this.gameCamera.setLerp(0.1, 0.1);

    this.prompt = this.add
      .text(Number(this.game.config.width) / 2, 1550, "", {
        fontFamily: "Arial",
        fontSize: "64px",
        color: "#a64245",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.heroAppears();
    await this.timeDelay(1000);
    this.opponentAppears();

    this.enterBtn = this.add
      .text(Number(this.game.config.width) / 2, 1680, "Enter the Ring", {
        fontFamily: "Arial",
        fontSize: "64px",
        backgroundColor: "#a64245",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.start();
      });

    this.heroProgressBar = this.add.graphics().setDepth(999).setScrollFactor(0);

    this.heroProgressBarBg = this.add.rectangle(
      200, 1180,
      this.barWidth + 12, this.barHeight + 10,
      0xffffff
    ).setScrollFactor(0)

    this.opponentProgressBar = this.add.graphics().setDepth(999).setScrollFactor(0);

    this.opponentProgressBarBg = this.add.rectangle(
      Number(this.game.config.width) - 200, 1180,
      this.barWidth + 12, this.barHeight + 10,
      0xffffff
    ).setScrollFactor(0)


  }

  startHeroTimer(duration: number) {
    // this.heroProgressBarBg.visible = true
    this.heroTimer = this.time.addEvent({
      delay: 20,
      repeat: duration * 50,
      callback: async () => {
        this.heroProgress += 1 / (duration * 50);
        this.heroProgressBar.clear();
        this.heroProgressBar.fillStyle(0x00ff00, 1);
        this.heroProgressBar.fillRect(200 - this.barWidth / 2, 1173, this.barWidth * this.heroProgress, this.barHeight);

        if (this.heroProgress >= 1) {
          // this.heroProgressBar.clear()
          this.heroProgress = 0
          // this.heroProgressBarBg.visible = false
          this.heroTimer.destroy()
          this.currentQuestion = (this.currentQuestion + 1) % this.questions.length
          await this.createQuestion();
          this.createAnswerPanel();
        }
      },
      callbackScope: this,
    });
  }

  startOpponentTimer(duration: number) {
    // this.opponentProgressBarBg.visible = true
    this.opponentTimer = this.time.addEvent({
      delay: 20,
      repeat: duration * 50,
      callback: async () => {
        this.opponentProgress += 1 / (duration * 50);
        this.opponentProgressBar.clear();
        this.opponentProgressBar.fillStyle(0xff0000, 1);
        this.opponentProgressBar.fillRect(Number(this.game.config.width) - 200 - this.barWidth / 2, 1173, this.barWidth * this.opponentProgress, this.barHeight);

        if (this.opponentProgress >= 1) {
          // this.opponentProgressBar.clear()
          this.opponentProgress = 0
          // this.opponentProgressBarBg.visible = false
          this.opponentTimer.destroy()
          const params = new URLSearchParams(window.location.search);
          const bot_vocab_accuracy = params.get('bot_vocab_accuracy') ?? 0.5;
          this.imgOpponentThinking!.setAlpha(1);
          await this.timeDelay(2000);
          this.imgOpponentThinking!.setAlpha(0);
          if (Math.random() < Math.min(Number(bot_vocab_accuracy), 1)) {
            this.isOpponentLastQuestionCorrect = true
            await this.opponentAttack();
          } else {
            this.isOpponentLastQuestionCorrect = false
            if (this.imgMaskOpponent) {
              this.imgMaskOpponent.destroy();
            }
            this.imgMaskOpponent = this.add
              .image(0, 0, "imgMask6")
              .setDepth(100)
              .setScale(0.4)
              .setFlipX(true);
            await this.timeDelay(1000);
            this.imgMaskOpponent.destroy();
          }
          if (this.imgHero!.x < -500) {
            this.opponentWins();
          } else if (!this.isGameEnded) {
            this.opponentMove();
          }
        }
      },
      callbackScope: this,
    });
  }

  async start() {
    this.enterBtn.setAlpha(0);
    await this.heroIntro();
    await this.opponentIntro();
    this.gameCamera!.startFollow(
      this.imgHero!,
      false,
      undefined,
      undefined,
      -90,
      40
    ).setZoom(1);
    this.indicator.setAlpha(1);
    this.heroMove();
    this.opponentMove();
  }

  update() {
    if (this.sptDustHero && this.imgHero) {
      this.sptDustHero!.y = this.imgHero!.y - 50;
      this.sptDustHero!.x = this.imgHero!.x - 200;
    }
    if (this.imgMaskHero && this.imgHero) {
      this.imgMaskHero!.y = this.imgHero!.y;
      this.imgMaskHero!.x = this.imgHero!.x;
    }
    if (this.questionBubble && this.imgHero) {
      this.questionBubble.x = this.imgHero.x;
    }

    if (this.sptDustOpponent && this.imgOpponent) {
      this.sptDustOpponent!.y = this.imgOpponent!.y - 50;
      this.sptDustOpponent!.x = this.imgOpponent!.x;
    }
    if (this.imgOpponentThinking && this.imgOpponent) {
      this.imgOpponentThinking!.y = this.imgOpponent!.y - 120;
      this.imgOpponentThinking!.x = this.imgOpponent!.x - 40;
    }
    if (this.imgMaskOpponent && this.imgOpponent) {
      this.imgMaskOpponent!.y = this.imgOpponent!.y;
      this.imgMaskOpponent!.x = this.imgOpponent!.x;
    }
  }

  async heroIntro() {
    this.sptDustHero!.play("animDust2");
    await this.movePlayer([this.imgHero], 250, "Expo");
  }

  async opponentIntro() {
    this.sptDustOpponent!.play("animDust2");
    await this.movePlayer([this.imgOpponent], -250, "Expo");
  }

  heroAppears() {
    this.imgHero?.setAlpha(1);
    this.tweens.add({
      targets: [this.imgHero],
      alpha: 0,
      ease: "Linear",
      duration: 100,
      repeat: 2,
      yoyo: true,
    });
  }

  opponentAppears() {
    this.imgOpponent?.setAlpha(1);
    this.tweens.add({
      targets: [this.imgOpponent],
      alpha: 0,
      ease: "Linear",
      duration: 100,
      repeat: 2,
      yoyo: true,
    });
  }

  async timeDelay(time: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      this.time.delayedCall(time, () => {
        resolve();
      });
    });
  }

  async cameraZoomIn(): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.gameCamera,
        zoom: 1.4,
        duration: 500,
        ease: "Power2",
        onComplete: () => {
          resolve();
        },
      });

      const targetOffset = { x: -100, y: 400 };
      this.tweens.add({
        targets: this.gameCamera!.followOffset,
        x: targetOffset.x,
        y: targetOffset.y,
        duration: 500,
        ease: "Power2",
        onUpdate: () => {
          this.gameCamera!.setFollowOffset(
            this.gameCamera!.followOffset.x,
            this.gameCamera!.followOffset.y
          );
        },
      });
    });
  }

  async cameraZoomOut(): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.gameCamera,
        zoom: 1,
        duration: 1000,
        ease: "Linear",
        onComplete: () => {
          resolve();
        },
      });

      const targetOffset = { x: -100, y: 100 };
      this.tweens.add({
        targets: this.gameCamera!.followOffset,
        x: targetOffset.x,
        y: targetOffset.y,
        duration: 100,
        ease: "Linear",
        onUpdate: () => {
          this.gameCamera!.setFollowOffset(
            this.gameCamera!.followOffset.x,
            this.gameCamera!.followOffset.y
          );
        },
      });
    });
  }

  async movePlayer(
    gameObjects: Array<any>,
    value: number,
    ease: string = "Expo"
  ): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: gameObjects,
        x: `+=${value}`,
        ease: ease, // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 1000,
        repeat: 0,
        yoyo: false,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  async bubbleUp(
    gameObjects: Array<any>,
    scaleX: number,
    scaleY: number
  ): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: gameObjects,
        scaleX: scaleX,
        scaleY: scaleY,
        ease: "Back", // 'Cubic', 'Elastic', 'Bounce', 'Back', 'Linear'
        duration: 300,
        repeat: 0,
        yoyo: false,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  async bubbleDown(gameObjects: Array<any>): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: gameObjects,
        scaleX: 0,
        scaleY: 0,
        ease: "Back", // 'Cubic', 'Elastic', 'Bounce', 'Back', 'Linear'
        duration: 500,
        repeat: 0,
        yoyo: false,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  createAnswerPanel() {
    const buttonSpacingX = Number(this.game.config.width) / 4 - 10;
    const buttonSpacingY = 200;
    const startX = Number(this.game.config.width) / 2 - buttonSpacingX;
    const startY = Number(this.game.config.height) - 420;

    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);

      const buttonX = startX + col * buttonSpacingX * 2;
      const buttonY = startY + row * buttonSpacingY;

      const buttonImage = this.add
        .image(0, 0, "imgOption")
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(300)
        .setScale(0.25)
        .setName("image");

      const buttonResult = this.add
        .image(
          220,
          0,
          this.questions[this.currentQuestion].options[i] ==
            this.questions[this.currentQuestion].answer
            ? "imgCorrect"
            : "imgWrong"
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(300)
        .setScale(0)
        .setName("result");

      const buttonText = this.add
        .text(0, -10, this.questions[this.currentQuestion].options[i], {
          fontFamily: "Arial",
          fontSize: 50,
          color: "#fff",
          align: "center",
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(300)
        .setName("text");

      const buttonContainer = this.add
        .container(buttonX, buttonY, [buttonImage, buttonText, buttonResult])
        .setScale(0);
      buttonImage.setInteractive({ useHandCursor: true });

      buttonImage.on("pointerover", () => {
        buttonContainer.setScale(1);
      });

      buttonImage.on("pointerout", () => {
        buttonContainer.setScale(0.9);
      });

      buttonImage.on("pointerdown", () => {
        this.clickOption(i);
      });

      this.optionButtons.push(buttonContainer);
    }
    this.bubbleUp(this.optionButtons, 0.9, 0.9);
  }

  async clickOption(optionIndex: number) {
    if (
      this.questions[this.currentQuestion].options[optionIndex] ===
      this.questions[this.currentQuestion].answer
    ) {
      const resultImg: GameObjects.Image =
        this.optionButtons[optionIndex].getByName("result");
      resultImg.setScale(0.25);
    } else {
      const correctAnswerIndex = this.questions[
        this.currentQuestion
      ].options.findIndex(
        (option) => option === this.questions[this.currentQuestion].answer
      );
      const correctResultImg: GameObjects.Image =
        this.optionButtons[correctAnswerIndex].getByName("result");
      correctResultImg.setScale(0.25);
      const wrongResultImg: GameObjects.Image =
        this.optionButtons[optionIndex].getByName("result");
      wrongResultImg.setScale(0.25);
    }

    this.optionButtons.forEach((option) => {
      option.getByName("image").removeInteractive();
    });

    if (
      this.questions[this.currentQuestion].options[optionIndex] ===
      this.questions[this.currentQuestion].answer
    ) {
      this.isHeroLastQuestionCorrect = true
      await this.heroAttack();
    } else {
      this.isHeroLastQuestionCorrect = false
      if (this.imgMaskHero) {
        this.imgMaskHero.destroy();
      }
      this.imgMaskHero = this.add
        .image(0, 0, "imgMask6")
        .setDepth(100)
        .setScale(0.4);
      await this.timeDelay(500);
      await this.destroyQuestion()
    }
    if (this.imgHero!.x > 1400) {
      this.heroWins();
    } else if (!this.isGameEnded) {
      this.heroMove();
    }
  }

  async destroyQuestion() {
    this.bubbleDown([this.questionBubble]);
    await this.bubbleDown(this.optionButtons);
    this.imgMaskHero?.destroy();
    this.questionBubble?.destroy();
    this.optionButtons.forEach((option) => option.destroy());
    this.optionButtons = [];
  }

  async heroMove() {
    this.startHeroTimer(this.isHeroLastQuestionCorrect ? 2 : 4);
  }

  async opponentMove() {
    this.startOpponentTimer(this.isOpponentLastQuestionCorrect ? 2 : 4)
  }

  async heroAttack() {
    if (this.opponentTimer) {
      this.opponentTimer.paused = true
    }
    if (this.imgMaskHero) {
      this.imgMaskHero.destroy();
    }
    this.imgMaskHero = this.add
      .image(0, 0, "imgMask5")
      .setDepth(100)
      .setScale(0.4);
    await this.timeDelay(500);
    await this.destroyQuestion()
    this.sptDustHero!.play("animDust");
    this.sptDustOpponent!.play("animDust2");
    if (this.imgMaskHero) {
      this.imgMaskHero.destroy();
    }
    this.imgMaskHero = this.add
      .image(0, 0, "imgMask2")
      .setDepth(100)
      .setScale(0.4);
    if (this.imgMaskOpponent) {
      this.imgMaskOpponent.destroy();
    }
    this.imgMaskOpponent = this.add
      .image(0, 0, "imgMask1")
      .setDepth(100)
      .setScale(0.4)
      .setFlipX(true);
    let power = 200
    if (this.imgHero!.x < -250) {
      power = 600
    } else if (this.imgHero!.x < 0) {
      power = 500
    } else if (this.imgHero!.x < 200) {
      power = 400
    } else if (this.imgHero!.x < 350) {
      power = 300
    } else if (this.imgHero!.x < 450) {
      power = 200
    } else {
      power = 200
    }
    this.movePlayer([this.imgHero], power, "Expo");
    await this.movePlayer([this.imgOpponent], power, "Back");
    this.indicator!.x = 40 + ((this.imgHero!.x + 550) / 200) * 100;
    await this.timeDelay(1000);
    this.imgOpponent!.x = this.imgHero!.x + 180
    this.imgMaskHero.destroy();
    this.imgMaskOpponent.destroy();
    if (this.opponentTimer) {
      this.opponentTimer.paused = false
    }
  }

  async opponentAttack() {
    if (this.heroTimer) {
      this.heroTimer.paused = true
    }
    this.questionBubble?.setAlpha(0.5);
    this.optionButtons.forEach((option) => { option.setAlpha(0.5), option.getByName("image").removeInteractive() });
    this.sptDustOpponent!.play("animDust");
    this.sptDustHero!.play("animDust2");
    if (this.imgMaskHero) {
      this.imgMaskHero.destroy();
    }
    this.imgMaskHero = this.add
      .image(0, 0, "imgMask1")
      .setDepth(100)
      .setScale(0.4);
    if (this.imgMaskOpponent) {
      this.imgMaskOpponent.destroy();
    }
    this.imgMaskOpponent = this.add
      .image(0, 0, "imgMask2")
      .setDepth(100)
      .setScale(0.4)
      .setFlipX(true);

    let power = 200
    if (this.imgHero!.x > 1150) {
      power = 600
    } else if (this.imgHero!.x > 900) {
      power = 500
    } else if (this.imgHero!.x > 700) {
      power = 400
    } else if (this.imgHero!.x > 550) {
      power = 300
    } else if (this.imgHero!.x > 450) {
      power = 200
    } else {
      power = 200
    }
    this.movePlayer([this.imgHero], -power, "Back");
    await this.movePlayer([this.imgOpponent], -power, "Expo");
    this.indicator!.x = 40 + ((this.imgHero!.x + 550) / 200) * 100;
    await this.timeDelay(1000);
    this.imgOpponent!.x = this.imgHero!.x + 180
    this.imgMaskHero.destroy();
    this.imgMaskOpponent.destroy();
    if (this.heroTimer) {
      this.heroTimer.paused = false
    }
    this.questionBubble?.setAlpha(1);
    this.optionButtons.forEach((option) => { option.setAlpha(1), option.getByName("image").setInteractive({ useHandCursor: true }) });
  }

  async createQuestion() {
    const imgQuestionBubble = this.add
      .image(0, -400, "imgQuestionBubble")
      .setDepth(100)
      .setScale(0.9);
    const imgQuestionImage = this.add
      .image(0, -400, this.questions[this.currentQuestion].questionImg)
      .setDepth(100)
      .setScale(0.4);
    this.questionBubble = this.add
      .container(this.imgHero!.x, this.imgHero!.y, [
        imgQuestionBubble,
        imgQuestionImage,
      ])
      .setScale(0);
    await this.timeDelay(500);
    await this.bubbleUp([this.questionBubble], 0.9, 0.9);
  }

  heroWins() {
    this.isGameEnded = true;
    this.destroyQuestion()
    if (this.imgMaskHero) {
      this.imgMaskHero.destroy();
    }
    this.imgMaskHero = this.add
      .image(0, 0, "imgMask8")
      .setDepth(100)
      .setScale(0.4);
    if (this.imgMaskOpponent) {
      this.imgMaskOpponent.destroy();
    }
    this.imgMaskOpponent = this.add
      .image(0, 0, "imgMask7")
      .setDepth(100)
      .setScale(0.4)
      .setFlipX(true);
    this.prompt.setText("You Win!");
    this.add
      .text(Number(this.game.config.width) / 2, 1680, "Restart", {
        fontFamily: "Arial",
        fontSize: "64px",
        backgroundColor: "#a64245",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", async () => {
        location.reload();
      });
  }

  opponentWins() {
    this.isGameEnded = true;
    this.destroyQuestion()
    if (this.imgMaskHero) {
      this.imgMaskHero.destroy();
    }
    this.imgMaskHero = this.add
      .image(0, 0, "imgMask7")
      .setDepth(100)
      .setScale(0.4);
    if (this.imgMaskOpponent) {
      this.imgMaskOpponent.destroy();
    }
    this.imgMaskOpponent = this.add
      .image(0, 0, "imgMask8")
      .setDepth(100)
      .setScale(0.4)
      .setFlipX(true);
    this.prompt.setText("You Lost!");
    this.add
      .text(Number(this.game.config.width) / 2, 1680, "Restart", {
        fontFamily: "Arial",
        fontSize: "64px",
        backgroundColor: "#a64245",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", async () => {
        location.reload();
      });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
