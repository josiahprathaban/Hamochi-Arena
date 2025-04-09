// V4 Choice of attack

import { GameObjects, Scene } from "phaser";
import questions from "../questionsX.json";

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
  enterBtn: GameObjects.Text;
  prompt: GameObjects.Text;
  isGameEnded: Boolean = false;
  sponsor: String
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
  questionHistoryHero: Array<any> = []
  questionHistoryImagesHero: Array<GameObjects.Image> = [];
  txtHero: GameObjects.Text;
  questionHistoryOpponent: Array<any> = []
  questionHistoryImagesOpponent: Array<GameObjects.Image> = [];
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
  heroComboTxt: GameObjects.Text;
  opponentComboTxt: GameObjects.Text;
  difficulty: number = 0;
  imgHeroAura: GameObjects.Image;
  imgOpponentAura: GameObjects.Image;
  isOpponentFirstKO: Boolean = true
  isHeroFirstKO: Boolean = true
  sptDizzyHero: GameObjects.Sprite;
  sptDizzyOpponent: GameObjects.Sprite;
  auras: Array<any> = [];
  heroAura: String = ""
  opponentAura: String = ""
  heroComboImg: GameObjects.Image;
  opponentComboImg: GameObjects.Image;
  opponentPowerBars: number = 0
  heroPowerBars: number = 0

  constructor() {
    super("Game");
  }

  async create() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('difficulty') && params.get('difficulty') == "1") {
      this.difficulty = 1
    }
    this.questions = this.shuffleArray(questions)

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
    this.anims.create({
      key: "animDizzy",
      frames: this.anims.generateFrameNumbers("sptDizzyAnim", {
        frames: [0, 1, 0, 1],
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.background = this.add
      .image(540, 0, "backgroundX")
      .setOrigin(0.5, 0).setScrollFactor(1);

    this.add
      .rectangle(
        Number(this.game.config.width) / 2,
        1070,
        2600,
        220,
        0xdb4b31
      )
      .setScrollFactor(1);

    this.imgHero = this.add
      .image(200, 720, "imgHero")
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
      .setAlpha(0);
    this.sptEnergyHero.play("animPlayerEnergy");
    this.sptDizzyHero = this.add
      .sprite(0, 0, "sptDizzyAnim")
      .setScale(1.2)
      .setDepth(101)
      .setAlpha(0);
    this.sptDizzyHero.play("animDizzy");

    this.txtHero = this.add
      .text(0, 0, "", {
        fontFamily: "Arial",
        fontSize: "32px",
        backgroundColor: "#a64245",
        padding: { x: 10, y: 5 }
      }).setDepth(2000).setAlpha(0)


    this.imgOpponent = this.add
      .image(Number(this.game.config.width) - 200, 720, "imgOpponent")
      .setDepth(99)
      .setScale(1.5)
      .setAlpha(0);

    this.opponentAura = this.getRandomItem(["Strength", "Luck", 'Speed', "Power", "Endurance"])
    this.opponentAura = "Power"
    this.opponentPowerBars = this.opponentAura == "Power" ? 3 : 5
    this.imgOpponentAura = this.add
      .image(Number(this.game.config.width) - 200, 720, "imgAura" + this.opponentAura)
      .setDepth(98)
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
    this.sptDizzyOpponent = this.add
      .sprite(0, 0, "sptDizzyAnim")
      .setScale(1.2)
      .setDepth(101)
      .setAlpha(0);
    this.sptDizzyOpponent.play("animDizzy");

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

    this.prompt = this.add
      .text(Number(this.game.config.width) / 2, 1550, "", {
        fontFamily: "Arial",
        fontSize: "64px",
        color: "#a64245",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.updateTheme()

    this.cameras.main.setZoom(0.5);
    this.cameras.main.y = -610;
    this.cameras.main.height += 500

    this.auras.push(
      this.add
        .text(Number(this.game.config.width) / 2, 1550, "Select Your Aura", {
          fontFamily: "Arial",
          fontSize: "120px",
          color: "#a64245",
          fontStyle: "bold"
        })
        .setOrigin(0.5)
        .setScrollFactor(0))

    this.auras.push(this.add.image(-110, 2200, "imgCardStrength")
      .setDepth(98)
      .setScale(3).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.selectAura("Strength");
      }))

    this.auras.push(this.add.image(540, 2200, "imgCardEndurance")
      .setDepth(98)
      .setScale(3).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.selectAura("Endurance");
      }))

    this.auras.push(this.add.image(1190, 2200, "imgCardLuck")
      .setDepth(98)
      .setScale(3).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.selectAura("Luck");
      }))

    this.auras.push(this.add.image(220, 3000, "imgCardPower")
      .setDepth(98)
      .setScale(3).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.selectAura("Power");
      }))

    this.auras.push(this.add.image(870, 3000, "imgCardSpeed")
      .setDepth(98)
      .setScale(3).setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.selectAura("Speed");
      }))
  }

  selectAura(text) {
    this.auras.forEach(element => {
      element.destroy()
    });
    this.auras = []
    this.heroAura = text
    this.heroPowerBars = this.heroAura == "Power" ? 3 : 5
    this.imgHeroAura = this.add
      .image(200, 720, "imgAura" + this.heroAura)
      .setDepth(99)
      .setScale(1.5)
      .setFlipX(true)
      .setAlpha(0);


    this.tweens.add({
      targets: this.cameras.main,
      zoom: 1,
      y: 0,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        this.startGame()
      }
    });
  }
  async startGame() {
    this.gameCamera = this.cameras.add(0, 0, Number(this.game.config.width), Number(this.game.config.height) / 2);
    this.gameCamera.setBounds(-760, 0, 2600, Number(this.game.config.height) / 2)

    this.heroAppears();
    await this.timeDelay(1000);
    this.opponentAppears();
    await this.timeDelay(500);

    this.txtTimer = this.add.text(Number(this.game.config.width) / 2, 1080, this.timerX.toString().padStart(2, '0'), {
      fontSize: '64px',
      fontFamily: "Arial",
      color: '#ffffff',
      fontStyle: "bold"
    }).setOrigin(0.5);

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
      200, 1150,
      this.barWidth + 4, this.barHeight + 4,
      0xffffff
    ).setScrollFactor(0)

    this.heroComboImg = this.add
      .image(200, 960, "imgCombo")
      .setOrigin(0.5, 0).setScrollFactor(1).setAlpha(0)

    this.heroComboTxt = this.add
      .text(115, 990, "", {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#000"
      })

    for (let index = 0; index < this.heroPowerBars; index++) {
      this.add
        .sprite(50 + (58 * index), 1060, "imgPower").setAlpha(0.5)
        .setOrigin(0)
        .setDepth(99)
        .setScale(0.25).setTint(0x000000)
    }

    this.opponentProgressBar = this.add.graphics().setDepth(999).setScrollFactor(0);

    this.opponentProgressBarBg = this.add.rectangle(
      Number(this.game.config.width) - 200, 1150,
      this.barWidth + 4, this.barHeight + 4,
      0xffffff
    ).setScrollFactor(0)

    this.opponentComboImg = this.add
      .image(Number(this.game.config.width) - 200, 960, "imgCombo")
      .setOrigin(0.5, 0).setScrollFactor(1).setAlpha(0)
    this.opponentComboTxt = this.add
      .text(Number(this.game.config.width) - 115, 990, "", {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#000"
      }).setOrigin(1, 0)

    for (let index = 0; index < this.opponentPowerBars; index++) {
      this.add
        .sprite(Number(this.game.config.width) - 50 - (58 * index), 1060, "imgPower").setAlpha(0.5)
        .setOrigin(1, 0)
        .setDepth(99)
        .setScale(0.25).setTint(0x000000)
    }
  }


  updateTheme() {
    this.sponsor = "Hamochi";
    this.animateScrollingText(-420, 620);

    this.displayImg?.destroy()
    this.displayImg = this.add
      .image(540, 90, "img" + this.sponsor)
      .setOrigin(0.5, 0).setScrollFactor(1).setScale(0.5).setAlpha(0.8);

    this.displayTxt?.destroy()
    this.displayTxt = this.add
      .text(Number(this.game.config.width) / 2, 385, "Hamochi Sdn Bhd", {
        fontFamily: "Arial",
        fontSize: "36px",
        fontStyle: 'bold'
      }).setOrigin(0.5)
  }

  animateScrollingText(startX, startY) {
    this.texts.forEach(text => {
      text.destroy()
    })
    this.texts = []
    const rectWidth = 1920;
    const rectHeight = 50;
    const textSpacing = 200;
    const speed = 50000;

    let maskShape = this.add.graphics();
    maskShape.fillRect(startX, startY, rectWidth, rectHeight);
    let mask = maskShape.createGeometryMask();

    let numTexts = Math.ceil(rectWidth / textSpacing) + 2;

    for (let i = 0; i < numTexts * 2; i++) {
      let textX = startX + i * textSpacing;
      let text = this.add.text(textX, startY, this.sponsor.toString(), {
        fontFamily: "Arial",
        fontSize: "32px",
        fontStyle: "bold"
      }).setAlpha(0.7).setMask(mask);
      this.texts.push(text);
    }

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
        this.heroProgressBar.fillStyle(0x00A730, 1);
        this.heroProgressBar.fillRect(200 - this.barWidth / 2, 1148, this.barWidth * this.heroProgress, this.barHeight);

        if (this.heroProgress >= 1) {
          // this.heroProgressBar.clear()
          this.heroProgress = 0
          // this.heroProgressBarBg.visible = false
          this.heroTimer.destroy()
          this.currentQuestion = this.getRandomItem(this.questions)
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

        if (this.opponentProgress <= 0.67) {
          this.opponentProgressBar.clear();
          this.opponentProgressBar.fillStyle(0xff0000, 1);
          this.opponentProgressBar.fillRect(Number(this.game.config.width) - 200 - this.barWidth / 2, 1148, this.barWidth * this.opponentProgress * 1.5, this.barHeight);
        } else {
          this.imgOpponentThinking!.setAlpha(1);
        }

        if (this.opponentProgress >= 1) {
          // this.opponentProgressBar.clear()
          this.opponentProgress = 0
          // this.opponentProgressBarBg.visible = false
          this.opponentTimer.destroy()
          let q = this.getRandomItem(this.questions)
          const bot_vocab_accuracy = this.difficulty == 1 ? 1 : 0.5;
          // await this.timeDelay(this.difficulty == 1 ? 3000 : 5000);
          if (!this.isGameEnded) {
            this.imgOpponentThinking!.setAlpha(0);
            if (Math.random() < Math.min(Number(bot_vocab_accuracy), 1)) {

              this.opponentBasePower += 50
              if (this.opponentBasePower >= 100) {
                this.opponentComboTxt.setText("COMBO x" + this.opponentBasePower / 50)
                this.opponentComboImg.setAlpha(1)
              }

              this.questionHistoryOpponent.push(q)
              this.updateQuestionHistoryOpponent()
              this.isOpponentLastQuestionCorrect = true

              await this.opponentAttack();
            } else {

              this.opponentBasePower = 0
              this.opponentComboTxt.setText("")
              this.opponentComboImg.setAlpha(0)

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
              this.sptDizzyOpponent.setAlpha(1)

              // await this.cameraZoomIn()
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
    if (this.sptDizzyHero && this.imgHero) {
      this.sptDizzyHero!.y = this.imgHero!.y - 70;
      this.sptDizzyHero!.x = this.imgHero!.x;
    }
    if (this.txtHero && this.imgHero) {
      this.txtHero!.y = this.imgHero!.y - 100;
      this.txtHero!.x = this.imgHero!.x - 30;
    }
    if (this.imgMaskHero && this.imgHero) {
      this.imgMaskHero!.y = this.imgHero!.y;
      this.imgMaskHero!.x = this.imgHero!.x;
    }
    if (this.imgHeroAura && this.imgHero) {
      // this.imgHeroAura!.y = this.imgHero!.y;
      this.imgHeroAura!.x = this.imgHero!.x;
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
    if (this.sptDizzyOpponent && this.imgOpponent) {
      this.sptDizzyOpponent!.y = this.imgOpponent!.y - 70;
      this.sptDizzyOpponent!.x = this.imgOpponent!.x;
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
    if (this.imgOpponentAura && this.imgOpponent) {
      // this.imgOpponentAura!.y = this.imgOpponent!.y;
      this.imgOpponentAura!.x = this.imgOpponent!.x;
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
    this.imgHeroAura?.setAlpha(0.7);
    this.tweens.add({
      targets: [this.imgHero, this.imgHeroAura],
      alpha: 0,
      ease: "Linear",
      duration: 100,
      repeat: 2,
      yoyo: true,
    });
  }

  opponentAppears() {
    this.imgOpponent?.setAlpha(1);
    this.imgOpponentAura?.setAlpha(0.7);
    this.tweens.add({
      targets: [this.imgOpponent, this.imgOpponentAura],
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
      if (this.heroBasePower >= 100) {
        this.heroComboTxt.setText("COMBO x" + this.heroBasePower / 50)
        this.heroComboImg.setAlpha(1)
      }

      this.questionHistoryHero.push(this.currentQuestion)

      this.updateQuestionHistoryHero()
      this.isHeroLastQuestionCorrect = true

      await this.heroAttack();

    } else {

      this.heroBasePower = 0
      this.heroComboTxt.setText("")
      this.heroComboImg.setAlpha(0)

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

      this.sptDizzyHero.setAlpha(1)

      await this.cameraZoomIn()
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
    this.questionBubble?.destroy();
    this.optionButtons.forEach((option) => option.destroy());
    this.optionButtons = [];
  }

  async heroMove() {
    if (!this.isHeroLastQuestionCorrect) {
      await this.timeDelay(3000);
      this.isHeroLastQuestionCorrect = true
      this.sptDizzyHero.setAlpha(0)
    }
    this.imgMaskHero?.destroy();
    // Speed Aura
    this.startHeroTimer(this.heroAura == "Speed" ? 2 : 2.6);
  }

  async opponentMove() {
    if (!this.isOpponentLastQuestionCorrect) {
      await this.timeDelay(3000);
      this.isOpponentLastQuestionCorrect = true
      this.sptDizzyOpponent.setAlpha(0)
    }
    this.imgMaskOpponent?.destroy();
    // Speed Aura
    this.startOpponentTimer(this.opponentAura == "Speed" ? 3 : 3.6)
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

    // Change Base accorig to the aura

    // Luck Aura
    let luck = Math.random()
    if (this.heroAura == "Luck" && luck < 0.5) {
      power += 250
      this.txtHero.setText("X2")
      this.txtHero?.setAlpha(1)
    } else if (luck < 0.1) {
      power += 250
      this.txtHero.setText("X2")
      this.txtHero?.setAlpha(1)
    } else {
      power += 100
    }

    // Strength Aura
    if (this.heroAura == "Strength")
      power += 150

    if (!this.isOpponentLastQuestionCorrect) {
      power += 200
    }

    if (this.questionHistoryHero.length == this.heroPowerBars) {
      // Ultimate Move

      // KO
      // if (this.isHeroFirstKO) {
      //   // critical hit chance
      //   power = 1250 - this.imgHero!.x
      //   this.isHeroFirstKO = false
      // } else {
      //   power = 1450 - this.imgHero!.x
      // }

      power += 450
      if (this.isHeroFirstKO) {
        // critical hit chance
        if ((this.heroAura == "Luck" && luck < 0.5) || luck < 0.1)
          power = Math.min(1250 - this.imgHero!.x, power)
        this.isHeroFirstKO = false
      }

      // this.txtHero.setText("WORD")

      this.questionHistoryHero = []
      await this.chainAttackAnimation(this.imgHero, this.questionHistoryImagesHero)
      this.sptEnergyHero?.setAlpha(1)
      await this.timeDelay(1000);
    }
    // else {
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
    // }

    // Endurance Aura
    if (this.opponentAura == "Endurance")
      power -= 150

    power = Math.min(power, 1450 - this.imgHero!.x)
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

    this.cameraZoomOut()
    if (this.opponentTimer && !this.isGameEnded) {
      this.opponentTimer.paused = false
    }
  }

  async chainAttackAnimation(player, historyImages): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: historyImages,
        scaleX: 0 + scrollX,
        scaleY: 0,
        y: player!.y - 5,
        x: player!.x,
        duration: 300,
        ease: "Linear",
        onComplete: () => {
          historyImages.forEach(element => {
            element.destroy()
          });
          historyImages = []
          resolve();
        },
      });
    });

  }

  async opponentAttack() {
    if (this.heroTimer) {
      this.heroTimer.paused = true
    }
    this.questionBubble?.setAlpha(0.5);
    this.optionButtons.forEach((option) => { option.setAlpha(0.5), option.getByName("image").removeInteractive() });

    let power = this.opponentBasePower

    // Change Base accorig to the aura

    // Luck Aura
    let luck = Math.random()
    if (this.opponentAura == "Luck" && luck < 0.5) {
      power += 250
      this.txtOpponent.setText("X2")
      this.txtOpponent?.setAlpha(1)
    } else if (luck < 0.1) {
      power += 250
      this.txtOpponent.setText("X2")
      this.txtOpponent?.setAlpha(1)
    } else {
      power += 100
    }

    // Strength Aura
    if (this.opponentAura == "Strength")
      power += 150

    if (!this.isHeroLastQuestionCorrect) {
      power += 200
    }

    if (this.questionHistoryOpponent.length == this.opponentPowerBars) {
      // Ultimate move

      // KO
      // if (this.isOpponentFirstKO) {
      //   // critical hit chance
      //   power = this.imgHero!.x + 350
      //   this.isOpponentFirstKO = false
      // } else {
      //   power = this.imgHero!.x + 550
      // }

      power += 450
      if (this.isOpponentFirstKO) {
        // critical hit chance
        if ((this.opponentAura == "Luck" && luck < 0.5) || luck < 0.1)
          power = Math.min(this.imgHero!.x + 350, power)
        this.isOpponentFirstKO = false
      }

      // this.txtOpponent.setText("WORD")
      this.questionHistoryOpponent = []
      await this.chainAttackAnimation(this.imgOpponent, this.questionHistoryImagesOpponent)
      this.sptEnergyOpponent?.setAlpha(1)
      await this.timeDelay(1000);
    }
    // else {
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
    // }

    // Endurance Aura
    if (this.heroAura == "Endurance")
      power -= 150

    power = Math.min(power, this.imgHero!.x + 550)
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

    this.cameraZoomOut()
    if (this.heroTimer && !this.isGameEnded) {
      this.heroTimer.paused = false
    }
    if (!this.isGameEnded) {
      this.questionBubble?.setAlpha(1);
      this.optionButtons.forEach((option) => { option.setAlpha(1), option.getByName("image").setInteractive({ useHandCursor: true }) });
    }
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
    await this.bubbleUp([this.questionBubble], 0.7, 0.7);
  }

  async heroWins() {
    this.isGameEnded = true
    this.questionBubble?.destroy();
    this.optionButtons.forEach((option) => option.destroy());
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
    await this.timeDelay(100);
    this.scene.pause()
    this.scene.launch('GameEnd', { isWon: true });
  }

  async opponentWins() {
    this.isGameEnded = true
    this.questionBubble?.destroy();
    this.optionButtons.forEach((option) => option.destroy());
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
    await this.timeDelay(100);
    this.scene.pause()
    this.scene.launch('GameEnd', { isWon: false });
  }

  updateQuestionHistoryHero() {
    this.questionHistoryImagesHero.forEach(element => {
      element.destroy()
    });
    this.questionHistoryImagesHero = []
    this.questionHistoryHero.forEach((element, i) => {
      const imgQuestionImage = this.add
        .image((i * 58) + 85, 1090, "imgPower")
        .setScale(0.25).setOrigin(0.5).setDepth(100).setScrollFactor(0)

      this.questionHistoryImagesHero.push(imgQuestionImage)
    });

  }

  updateQuestionHistoryOpponent() {
    this.questionHistoryImagesOpponent.forEach(element => {
      element.destroy()
    });
    this.questionHistoryImagesOpponent = []
    this.questionHistoryOpponent.forEach((element, i) => {
      const imgQuestionImage = this.add
        .image((i * 58) + Number(this.game.config.width) - 10 - this.opponentPowerBars * 60, 1090, "imgPower")
        .setScale(0.25).setOrigin(0.5).setDepth(100).setScrollFactor(0)
      this.questionHistoryImagesOpponent.push(imgQuestionImage)
    });

  }


  // Util functions
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
