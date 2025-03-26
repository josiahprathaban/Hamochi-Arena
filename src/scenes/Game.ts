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
  sptEnergyHero: GameObjects.Sprite | undefined;
  sptEnergyOpponent: GameObjects.Sprite | undefined;
  gameCamera: Phaser.Cameras.Scene2D.Camera | undefined;
  optionButtons: GameObjects.Container[] = [];
  questionBubble: GameObjects.Container | undefined;
  currentQuestion: any;
  playersTween: Phaser.Tweens.Tween | undefined;
  player: String = "";
  enterBtn: GameObjects.Text;
  prompt: GameObjects.Text;
  isGameEnded: Boolean = false;
  theme: String
  barWidth: number = 275;
  barHeight: number = 5;
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
  questionChoices: Array<GameObjects.Container> = [];
  questionHistoryHero: Array<any> = []
  questionHistoryImagesHero: Array<GameObjects.Container> = [];
  txtHero: GameObjects.Text;
  questionHistoryOpponent: Array<any> = []
  questionHistoryImagesOpponent: Array<GameObjects.Container> = [];
  txtOpponent: GameObjects.Text;
  ring: GameObjects.Image;
  themeTxtGrp: Array<any>;
  timerX: number = 99;
  txtTimer: GameObjects.Text;
  timeEventX: Phaser.Time.TimerEvent;
  themes: any;
  texts: Array<any> = [];
  displayTxt: GameObjects.Text;
  displayImg: any;
  opponentBasePower: number = 0;
  heroBasePower: number = 0;
  heroPowerTxt: GameObjects.Text;
  opponentPowerTxt: GameObjects.Text;
  difficulty: number = 0;

  constructor() {
    super("Game");
  }

  async create() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('difficulty') && params.get('difficulty') == "1") {
      this.difficulty = 1
    }
    this.questions = this.shuffleArray(questions)
    this.themes = ["Fruits", "Animals", "Stationery"]

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
    this.anims.create({
      key: "animPlayerEnergy",
      frames: this.anims.generateFrameNumbers("sptEnergy", {
        frames: [2, 3, 4, 5],
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.background = this.add
      .image(540, 0, "backgroundX")
      .setOrigin(0.5, 0).setScrollFactor(1);

    this.add
      .rectangle(
        Number(this.game.config.width) / 2,
        1070,
        Number(this.game.config.width),
        220,
        0xdb4b31
      )
      .setScrollFactor(0);

    this.add
      .rectangle(
        100,
        1095,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);
    this.add
      .rectangle(
        200,
        1095,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);
    this.add
      .rectangle(
        300,
        1095,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);

    this.add
      .rectangle(
        Number(this.game.config.width) - 100,
        1095,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);
    this.add
      .rectangle(
        Number(this.game.config.width) - 200,
        1095,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);
    this.add
      .rectangle(
        Number(this.game.config.width) - 300,
        1095,
        80,
        100,
        0xffffff
      )
      .setScrollFactor(0);

    this.txtTimer = this.add.text(Number(this.game.config.width) / 2, 1080, this.timerX.toString().padStart(2, '0'), {
      fontSize: '64px',
      fontFamily: "Arial",
      color: '#ffffff',
      fontStyle: "bold"
    }).setOrigin(0.5);


    this.imgHero = this.add
      .image(200, 740, "imgHero")
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
    this.sptEnergyHero = this.add
      .sprite(0, 0, "sptEnergy")
      .setOrigin(0)
      .setDepth(99)
      .setScale(1.2)
      .setFlipX(true)
      .setAlpha(0);;
    this.sptEnergyHero.play("animPlayerEnergy");
    this.txtHero = this.add
      .text(0, 0, "", {
        fontFamily: "Arial",
        fontSize: "32px",
        backgroundColor: "#a64245",
        padding: { x: 10, y: 5 }
      }).setDepth(2000).setAlpha(0)


    this.imgOpponent = this.add
      .image(Number(this.game.config.width) - 200, 740, "imgOpponent")
      .setDepth(99)
      .setScale(1.5)
      .setAlpha(0);
    this.sptDustOpponent = this.add
      .sprite(0, 0, "sptDust")
      .setOrigin(0)
      .setDepth(2000)
      .setScale(2)
      .setFrame(9);
    this.sptEnergyOpponent = this.add
      .sprite(0, 0, "sptEnergy")
      .setOrigin(0)
      .setDepth(98)
      .setScale(1.2)
      .setAlpha(0)
    this.sptEnergyOpponent.play("animPlayerEnergy");
    this.txtOpponent = this.add
      .text(0, 0, "", {
        fontFamily: "Arial",
        fontSize: "32px",
        backgroundColor: "#a64245",
        padding: { x: 10, y: 5 }
      }).setDepth(2000).setAlpha(0)
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

    this.gameCamera = this.cameras.add(0, 0, Number(this.game.config.width), Number(this.game.config.height) / 2);
    this.gameCamera.setBounds(-760, 0, 2600, Number(this.game.config.height) / 2)

    this.prompt = this.add
      .text(Number(this.game.config.width) / 2, 1550, "", {
        fontFamily: "Arial",
        fontSize: "64px",
        color: "#a64245",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.add
      .text(390, 110, "theme", {
        fontFamily: "Arial",
        fontSize: "32px",
      }).setOrigin(0.5)
    this.updateTheme()

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
      200, 1160,
      this.barWidth + 4, this.barHeight + 4,
      0xffffff
    ).setScrollFactor(0)

    this.heroPowerTxt = this.add
      .text(60, 990, "COMBO x" + this.heroBasePower / 50, {
        fontFamily: "Arial",
        fontSize: "32px",
      })

    // this.add
    //   .sprite(80, 970, "imgPower")
    //   .setOrigin(0)
    //   .setDepth(2000)
    //   .setScale(0.25)

    this.opponentProgressBar = this.add.graphics().setDepth(999).setScrollFactor(0);

    this.opponentProgressBarBg = this.add.rectangle(
      Number(this.game.config.width) - 200, 1160,
      this.barWidth + 4, this.barHeight + 4,
      0xffffff
    ).setScrollFactor(0)

    this.opponentPowerTxt = this.add
      .text(Number(this.game.config.width) - 60, 990, "COMBO x" + this.opponentBasePower / 50, {
        fontFamily: "Arial",
        fontSize: "32px",
      }).setOrigin(1, 0)

    // this.add
    //   .sprite(Number(this.game.config.width) - 80, 970, "imgPower")
    //   .setOrigin(1,0)
    //   .setDepth(2000)
    //   .setScale(0.25)


  }

  updateTheme() {
    this.theme = this.themes[Math.floor(Math.random() * this.themes.length)];
    this.animateScrollingText(-420, 620);

    this.displayImg?.destroy()
    this.displayImg = this.add
      .image(540, 90, "img" + this.theme)
      .setOrigin(0.5, 0).setScrollFactor(1).setScale(0.6).setAlpha(0.6);

    this.displayTxt?.destroy()
    this.displayTxt = this.add
      .text(Number(this.game.config.width) / 2, 310, this.theme.toString(), {
        fontFamily: "Arial",
        fontSize: "64px",
      }).setOrigin(0.5)


  }

  animateScrollingText(startX, startY) {
    this.texts.forEach(text => {
      text.destroy()
    })
    this.texts = []
    const rectWidth = 1920; // Width of the scrolling area
    const rectHeight = 50; // Height of the scrolling area
    const textSpacing = 200; // Space between each instance of text
    const speed = 50000; // Duration for text to move across

    // Create a mask
    let maskShape = this.add.graphics();
    maskShape.fillRect(startX, startY, rectWidth, rectHeight);
    let mask = maskShape.createGeometryMask();

    let numTexts = Math.ceil(rectWidth / textSpacing) + 2; // Extra text for smooth looping

    // Create multiple text instances (double the amount for a smooth cycle)
    for (let i = 0; i < numTexts * 2; i++) {
      let textX = startX + i * textSpacing;
      let text = this.add.text(textX, startY, this.theme.toString(), {
        fontFamily: "Arial",
        fontSize: "32px",
        fontStyle: "bold"
      }).setAlpha(0.7).setMask(mask);
      this.texts.push(text);
    }

    // Scroll animation
    this.tweens.add({
      targets: this.texts,
      x: `-=${textSpacing * numTexts}`,
      duration: speed,
      ease: 'Linear',
      repeat: -1,
      onUpdate: (tween) => {
        this.texts.forEach(text => {
          if (text.x < startX - textSpacing) {
            text.x += textSpacing * numTexts * 2;
          }
        });
      }
    });
  }

  startHeroTimer(duration: number) {
    // if (Math.random() < 0.5)
    // this.updateTheme()
    // this.heroProgressBarBg.visible = true
    this.heroTimer = this.time.addEvent({
      delay: 20,
      repeat: duration * 50,
      callback: async () => {
        this.heroProgress += 1 / (duration * 50);
        this.heroProgressBar.clear();
        this.heroProgressBar.fillStyle(0x00ff00, 1);
        this.heroProgressBar.fillRect(200 - this.barWidth / 2, 1158, this.barWidth * this.heroProgress, this.barHeight);

        if (this.heroProgress >= 1) {
          // this.heroProgressBar.clear()
          this.heroProgress = 0
          // this.heroProgressBarBg.visible = false
          this.heroTimer.destroy()
          this.cardsChoice()

        }
      },
      callbackScope: this,
    });
  }

  startOpponentTimer(duration: number) {
    // this.opponentProgressBarBg.visible = true
    this.imgOpponentThinking!.setAlpha(1);
    this.opponentTimer = this.time.addEvent({
      delay: 20,
      repeat: duration * 50,
      callback: async () => {
        this.opponentProgress += 1 / (duration * 50);
        this.opponentProgressBar.clear();
        this.opponentProgressBar.fillStyle(0xff0000, 1);
        this.opponentProgressBar.fillRect(Number(this.game.config.width) - 200 - this.barWidth / 2, 1158, this.barWidth * this.opponentProgress, this.barHeight);

        if (this.opponentProgress >= 1) {
          // this.opponentProgressBar.clear()
          this.opponentProgress = 0
          // this.opponentProgressBarBg.visible = false
          this.opponentTimer.destroy()
          let q = this.getRandomItem(this.getRandomItem(this.questions))
          const bot_vocab_accuracy = this.difficulty == 1 ? 1 : 0.5;
          // await this.timeDelay(this.difficulty == 1 ? 3000 : 5000);
          if (!this.isGameEnded) {
            this.imgOpponentThinking!.setAlpha(0);
            if (Math.random() < Math.min(Number(bot_vocab_accuracy), 1)) {

              this.opponentBasePower += 50
              this.opponentPowerTxt.setText("COMBO x" + this.opponentBasePower / 50)

              if (this.questionHistoryOpponent.length > 0 && this.questionHistoryOpponent[this.questionHistoryOpponent.length - 1].theme == q.theme) {
                this.questionHistoryOpponent.push(q)
              } else {
                this.questionHistoryOpponent = []
                this.questionHistoryOpponent.push(q)
              }
              this.updateQuestionHistoryOpponent()
              this.isOpponentLastQuestionCorrect = true

              // Break KO Chain
              if (this.questionHistoryHero.length > 0 && this.questionHistoryHero[this.questionHistoryHero.length - 1].theme == q.theme) {
                this.questionHistoryHero = []
                this.updateQuestionHistoryHero()
              }

              await this.opponentAttack(q.theme == this.theme);
            } else {

              this.opponentBasePower = 0
              this.opponentPowerTxt.setText("COMBO x" + this.opponentBasePower / 50)

              this.questionHistoryOpponent = []
              this.updateQuestionHistoryOpponent()
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
      0.1,
      0.1,
      - 90,
      100
    ).setZoom(1);
    this.heroMove();
    await this.opponentMove();
    this.timeEventX = this.time.addEvent({
      delay: 1000, // 1 second
      callback: () => {
        this.timerX--;
        this.txtTimer.setText(this.timerX.toString().padStart(2, '0'))
        if (this.timerX <= 0) {
          if (this.imgHero!.x > 450) {
            this.heroWins();
          } else {
            this.opponentWins()
          }
        }
      },
      callbackScope: this,
      loop: true
    });

  }

  update() {
    if (this.sptDustHero && this.imgHero) {
      this.sptDustHero!.y = this.imgHero!.y - 50;
      this.sptDustHero!.x = this.imgHero!.x - 200;
    }
    if (this.sptEnergyHero && this.imgHero) {
      this.sptEnergyHero!.y = this.imgHero!.y - 220;
      this.sptEnergyHero!.x = this.imgHero!.x - 180;
    }
    if (this.txtHero && this.imgHero) {
      this.txtHero!.y = this.imgHero!.y - 100;
      this.txtHero!.x = this.imgHero!.x - 30;
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
    if (this.sptEnergyOpponent && this.imgOpponent) {
      this.sptEnergyOpponent!.y = this.imgOpponent!.y - 220;
      this.sptEnergyOpponent!.x = this.imgOpponent!.x - 180;
    }
    if (this.txtOpponent && this.imgOpponent) {
      this.txtOpponent!.y = this.imgOpponent!.y - 100;
      this.txtOpponent!.x = this.imgOpponent!.x - 30;
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
        zoom: 1.3,
        duration: 500,
        ease: "Power2",
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  async cameraZoomOut(): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.gameCamera,
        zoom: 1,
        scrollY: "+=300",
        duration: 500,
        ease: "Power2",
        onComplete: () => {
          resolve();
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
    const startY = Number(this.game.config.height) - 600;

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
          this.currentQuestion.options[i] ==
            this.currentQuestion.answer
            ? "imgCorrect"
            : "imgWrong"
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(300)
        .setScale(0)
        .setName("result");

      const buttonText = this.add
        .text(0, -10, this.currentQuestion.options[i], {
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
      this.currentQuestion.options[optionIndex] ===
      this.currentQuestion.answer
    ) {
      const resultImg: GameObjects.Image =
        this.optionButtons[optionIndex].getByName("result");
      resultImg.setScale(0.25);
    } else {
      const correctAnswerIndex =
        this.currentQuestion
          .options.findIndex(
            (option) => option === this.currentQuestion.answer
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
      this.currentQuestion.options[optionIndex] ===
      this.currentQuestion.answer
    ) {

      this.heroBasePower += 50
      this.heroPowerTxt.setText("COMBO x" + this.heroBasePower / 50)

      if (this.questionHistoryHero.length > 0 && this.questionHistoryHero[this.questionHistoryHero.length - 1].theme == this.currentQuestion.theme) {
        this.questionHistoryHero.push(this.currentQuestion)
      } else {
        this.questionHistoryHero = []
        this.questionHistoryHero.push(this.currentQuestion)
      }
      this.updateQuestionHistoryHero()
      this.isHeroLastQuestionCorrect = true

      // break KO Chain
      if (this.questionHistoryOpponent.length > 0 && this.questionHistoryOpponent[this.questionHistoryOpponent.length - 1].theme == this.currentQuestion.theme) {
        this.questionHistoryOpponent = []
        this.updateQuestionHistoryOpponent()
      }

      await this.heroAttack();

    } else {

      this.heroBasePower = 0
      this.heroPowerTxt.setText("COMBO x" + this.heroBasePower / 50)

      this.questionHistoryHero = []
      this.updateQuestionHistoryHero()
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
    this.questionChoices.forEach(elementx => {
      elementx.destroy()
    });
    this.questionChoices = [];
  }

  async heroMove() {
    this.startHeroTimer(this.isHeroLastQuestionCorrect ? 2 : 4);
  }

  async opponentMove() {
    this.startOpponentTimer(this.isOpponentLastQuestionCorrect ? 4 : 6)
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

    let power = this.heroBasePower

    if (this.currentQuestion.theme == this.theme) {
      this.txtHero.setText("X2")
      power += 250
    } else {
      power += 50
    }

    if (this.questionHistoryHero.length == 3 && this.hasSameTheme(this.questionHistoryHero)) {
      // power = 1450 - this.imgHero!.x
      power += 450
      this.txtHero.setText("X5")
      this.questionHistoryHero = []
      await this.chainAttackAnimation(this.imgHero, this.questionHistoryImagesHero)
      this.sptEnergyHero?.setAlpha(1)
      await this.timeDelay(1000);
    } else {
      // Advantage of weekness
      if (this.imgHero!.x < -250) {
        power += 400
      } else if (this.imgHero!.x < 0) {
        power += 300
      } else if (this.imgHero!.x < 200) {
        power += 100
      } else if (this.imgHero!.x < 350) {
        power += 50
      } else if (this.imgHero!.x < 450) {
        //
      } else {
        //
      }
    }

    power = Math.min(power, 1450 - this.imgHero!.x)
    this.txtHero?.setAlpha(1)
    await this.cameraZoomIn()
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

    this.movePlayer([this.imgHero], power, "Expo");
    await this.movePlayer([this.imgOpponent], power, "Back");
    this.sptEnergyHero?.setAlpha(0)
    this.txtHero?.setAlpha(0)
    await this.timeDelay(1000);
    this.imgOpponent!.x = this.imgHero!.x + 180
    this.imgMaskHero.destroy();
    this.imgMaskOpponent.destroy();
    if (this.opponentTimer && !this.isGameEnded) {
      this.opponentTimer.paused = false
    }
    this.cameraZoomOut()
  }

  async chainAttackAnimation(player, historyImages): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: historyImages,
        scaleX: 0,
        scaleY: 0,
        y: player!.y - 5,
        x: player!.x - 5,
        duration: 300,
        ease: "Linear",
        onComplete: () => {
          resolve();
        },
      });
    });

  }

  async opponentAttack(isX2) {
    if (this.heroTimer) {
      this.heroTimer.paused = true
    }
    this.questionChoices.forEach(elementx => {
      elementx.setAlpha(0.5)
      elementx.getByName("image").removeInteractive()
    });
    this.questionBubble?.setAlpha(0.5);
    this.optionButtons.forEach((option) => { option.setAlpha(0.5), option.getByName("image").removeInteractive() });

    let power = this.opponentBasePower

    if (isX2) {
      this.txtOpponent.setText("X2")
      power += 250
    } else {
      power += 50
    }

    if (this.questionHistoryOpponent.length == 3 && this.hasSameTheme(this.questionHistoryOpponent)) {
      // power = this.imgHero!.x + 550
      power += 450
      this.txtOpponent.setText("X5")
      this.questionHistoryOpponent = []
      await this.chainAttackAnimation(this.imgOpponent, this.questionHistoryImagesOpponent)
      this.sptEnergyOpponent?.setAlpha(1)
      await this.timeDelay(1000);
    }
    else {
      // Advantage of weekness
      if (this.imgHero!.x > 1150) {
        power += 400
      } else if (this.imgHero!.x > 900) {
        power += 300
      } else if (this.imgHero!.x > 700) {
        power += 100
      } else if (this.imgHero!.x > 550) {
        power += 50
      } else if (this.imgHero!.x > 450) {
        //
      } else {
        //
      }
    }

    power = Math.min(power, this.imgHero!.x + 550)
    this.txtOpponent?.setAlpha(1)
    await this.cameraZoomIn()
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
    this.movePlayer([this.imgHero], -power, "Back");
    await this.movePlayer([this.imgOpponent], -power, "Expo");
    this.sptEnergyOpponent?.setAlpha(0)
    this.txtOpponent?.setAlpha(0)
    await this.timeDelay(1000);
    this.imgOpponent!.x = this.imgHero!.x + 180
    this.imgMaskHero.destroy();
    this.imgMaskOpponent.destroy();
    if (this.heroTimer && !this.isGameEnded) {
      this.heroTimer.paused = false
    }
    if (!this.isGameEnded) {
      this.questionChoices.forEach(elementx => {
        elementx.setAlpha(1)
        elementx.getByName("image").setInteractive({ useHandCursor: true })
      });
      this.questionBubble?.setAlpha(1);
      this.optionButtons.forEach((option) => { option.setAlpha(1), option.getByName("image").setInteractive({ useHandCursor: true }) });
    }
    this.cameraZoomOut()
  }

  async createQuestion() {
    const imgQuestionBubble = this.add
      .image(0, -400, "imgQuestionBubble")
      .setDepth(100)
      .setScale(0.9);
    const imgQuestionImage = this.add
      .image(0, -400, this.currentQuestion.questionImg)
      .setDepth(100)
      .setScale(0.4);
    this.questionBubble = this.add
      .container(this.imgHero!.x, this.imgHero!.y, [
        imgQuestionBubble,
        imgQuestionImage,
      ])
      .setScale(0);
    await this.timeDelay(500);
    await this.bubbleUp([this.questionBubble], 0.7, 0.7);
  }

  cardsChoice() {
    const randomItems = this.questions.map(category => category[Math.floor(Math.random() * category.length)]);
    randomItems.forEach((element, i) => {
      const imgCard = this.add
        .image(0, 0, "imgCard")
        .setDepth(100)
        .setScale(1).setScrollFactor(0).setName("image");;
      const imgQuestionImage = this.add
        .image(0, 0, element.questionImg)
        .setDepth(100)
        .setScale(0.35).setScrollFactor(0);
      const powerTxt = this.add
        .text(70, -180, element.theme == this.theme ? "X2" : "", {
          fontFamily: "Arial",
          fontSize: "32px",
          backgroundColor: "#a64245",
          padding: { x: 10, y: 5 },
        })
      const questionContainer = this.add
        .container(i * 340 + 200, 1450, [
          imgCard,
          imgQuestionImage,
          powerTxt
        ]).setScrollFactor(0);

      imgCard.setInteractive({ useHandCursor: true });

      imgCard.on("pointerover", () => {
        questionContainer.setScale(1.1);
      });

      imgCard.on("pointerout", () => {
        questionContainer.setScale(1);
      });

      imgCard.on("pointerdown", async () => {
        this.questionChoices.forEach(elementx => {
          elementx.destroy()
        });
        this.questionChoices = [];
        this.currentQuestion = element;
        console.log(this.currentQuestion)
        await this.createQuestion();
        this.createAnswerPanel();
      });
      this.questionChoices.push(questionContainer)
    });
  }

  heroWins() {
    this.timeEventX.remove()
    this.imgOpponentThinking!.setAlpha(0);
    this.isGameEnded = true;
    this.destroyQuestion()
    this.heroTimer?.destroy()
    this.opponentTimer?.destroy()
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
    this.timeEventX.remove()
    this.imgOpponentThinking!.setAlpha(0);
    this.isGameEnded = true;
    this.destroyQuestion()
    this.heroTimer?.destroy()
    this.opponentTimer?.destroy()
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

  updateQuestionHistoryHero() {
    this.questionHistoryImagesHero.forEach(element => {
      element.destroy()
    });
    this.questionHistoryHero.forEach((element, i) => {
      const imgQuestionImage = this.add
        .image(0, 0, element.questionImg)
        .setDepth(100)
        .setScale(0.1).setScrollFactor(0);
      // const imgResult = this.add
      //   .image(20, 30, "imgCorrect")
      //   .setDepth(100)
      //   .setScale(0.1).setScrollFactor(0);
      const questionContainer = this.add
        .container(i * 100 + 100, 1095, [
          imgQuestionImage,
          // imgResult
        ])
      this.questionHistoryImagesHero.push(questionContainer)
    });

  }

  updateQuestionHistoryOpponent() {
    this.questionHistoryImagesOpponent.forEach(element => {
      element.destroy()
    });
    this.questionHistoryOpponent.forEach((element, i) => {
      const imgQuestionImage = this.add
        .image(0, 0, element.questionImg)
        .setDepth(100)
        .setScale(0.1).setScrollFactor(0);
      // const imgResult = this.add
      //   .image(20, 30, "imgCorrect")
      //   .setDepth(100)
      //   .setScale(0.1).setScrollFactor(0);
      const questionContainer = this.add
        .container(i * 100 + Number(this.game.config.width) - 300, 1095, [
          imgQuestionImage,
          // imgResult
        ])
      this.questionHistoryImagesOpponent.push(questionContainer)
    });

  }


  // Util functions

  hasSameTheme(arr) {
    if (arr.length === 0) return false; // Handle empty array case
    return arr.every(item => item.theme === arr[0].theme);
  }

  getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
