import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    // this.add.image(512, 384, 'background1');

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {

      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + (460 * progress);

    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets/phaserGames');

    this.load.image('backgroundX', 'blk.png');
    this.load.image('imgRing', 'ringx.png');
    this.load.image('imgFruits', 'fruits.png');
    this.load.image('imgStationery', 'stationery.png');
    this.load.image('imgAnimals', 'animals.png');
    this.load.image('imgHamochi', 'Icon.png');
    this.load.image('background', 'bg.png');
    this.load.image('background2', 'bg2.png');
    this.load.image('imgHero', 'player-1.png');
    this.load.image('imgOpponent', 'player-2.png');
    this.load.image('imgQuestionBubble', 'question-bubble.png');
    this.load.image('imgCard', 'card.png');
    this.load.image('imgOption', 'option.png');
    this.load.image('imgFruit1', 'fruit-1.png');
    this.load.image('imgFruit2', 'fruit-2.png');
    this.load.image('imgFruit3', 'fruit-3.png');
    this.load.image('imgFruit4', 'fruit-4.png');
    this.load.image('imgFruit5', 'fruit-5.png');
    this.load.image('imgAss1', 'ass-1.png');
    this.load.image('imgAss2', 'ass-2.png');
    this.load.image('imgAss3', 'ass-3.png');
    this.load.image('imgAss4', 'ass-4.png');
    this.load.image('imgAss5', 'ass-5.png');
    this.load.image('imgAni1', 'ani-1.png');
    this.load.image('imgAni2', 'ani-2.png');
    this.load.image('imgAni3', 'ani-3.png');
    this.load.image('imgAni4', 'ani-4.png');
    this.load.image('imgAni5', 'ani-5.png');
    this.load.image('imgAni6', 'ani-6.png');
    this.load.image('imgAni7', 'ani-7.png');
    this.load.image('imgTimer', 'timer.png');
    this.load.image('imgPower', 'power.png');
    this.load.image('imgIndicator', 'indi.png');


    this.load.image('imgAuraStrength', 'aura-strength.png');
    this.load.image('imgAuraSpeed', 'aura-speed.png');
    this.load.image('imgAuraPower', 'aura-power.png');
    this.load.image('imgAuraLuck', 'aura-luck.png');
    this.load.image('imgAuraEndurance', 'aura-endurance.png');

    this.load.image('imgCardStrength', 'card-strength.png');
    this.load.image('imgCardSpeed', 'card-speed.png');
    this.load.image('imgCardPower', 'card-power.png');
    this.load.image('imgCardLuck', 'card-luck.png');
    this.load.image('imgCardEndurance', 'card-endurance.png');

    this.load.image('imgCombo', 'combo.png');
    this.load.image('imgCritical', 'critical.png');
    this.load.image('imgShild', 'shild.png');

    this.load.image('imgCorrect', 'correct.png');
    this.load.image('imgWrong', 'wrong.png');

    this.load.image('imgMask1', 'masks/M0060.png');
    this.load.image('imgMask2', 'masks/M0070.png');
    this.load.image('imgMask3', 'masks/M0080.png');
    this.load.image('imgMask4', 'masks/M0090.png');
    this.load.image('imgMask5', 'masks/M0010.png');
    this.load.image('imgMask6', 'masks/M0030.png');
    this.load.image('imgMask7', 'masks/M0031.png');
    this.load.image('imgMask8', 'masks/M0012.png');


    this.load.spritesheet(
      "sptDust",
      "dust.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );

    this.load.spritesheet(
      "sptEnergy",
      "energy.png",
      {
        frameWidth: 300,
        frameHeight: 300,
      }
    );

    this.load.spritesheet(
      "sptDizzyAnim",
      "dizzy.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );

    this.load.spritesheet(
      "sptIdea",
      "idea.png",
      {
        frameWidth: 120,
        frameHeight: 120,
      }
    );

    // Load alphabet sounds A-Z
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach(letter => {
      this.load.audio(`sound_${letter}`, `english-alphabet-sound/${letter}.mp3`);
    });

    this.load.audio(`sound_oops`, `sfx_oops.mp3`);
    this.load.audio(`sound_xyz`, `sfx_xyz.mp3`);

  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the Game. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('Game');
  }
}
