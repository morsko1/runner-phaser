import FpsText from '../objects/fpsText';
import levels from '../objects/levels';

const IS_DEV = process.env.NODE_ENV === 'development';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });

        this.width = 1280;
        this.height = 720;
        this.groundHeight = 186;
        this.playerSpeed = 300;
        this.jumpPower = -600;
        this.cellWidth = 32;
        this.playerWidth = this.cellWidth - 2;
        this.playerInitialX = 0;
        this.playerInitialY = this.height - this.groundHeight - this.cellWidth;
        this.currentLevel = 0;
        this.numOfLevels = levels.length;
        this.numOfAttempts = 0;
        this.isCollision = false;
    }

    startRun() {
        this.player.setVelocityX(this.playerSpeed);
        this.input.off('pointerdown');
        this.input.on('pointerdown', () => {
            this.handleJump();
        });
    }

    handleJump() {
        if (this.player.body.blocked.down) {
            this.player.setVelocityY(this.jumpPower);
        }
    }

    init() {
        this.input.on('pointerdown', () => {
            this.startRun();
        });
    }

    configureLevel(levelIndex) {
        if (this.barriers) this.barriers.clear(true);
        // configure level
        this.barriers = this.physics.add.group();
        const levelData = levels[levelIndex].data;

        // update cellWidth and playerInitialY regarding to level config
        this.cellWidth = levels[levelIndex].cellWidth;
        this.playerInitialY = this.height - this.groundHeight - this.cellWidth;

        levelData.map((row, rowIndex) => {
            const currentFloor = levelData.length - 1 - rowIndex;
            row.split('').map((item, itemIndex) => {
                if (item === '*') {
                    const newBarrier = this.physics.add.sprite(
                        itemIndex * this.cellWidth,
                        this.playerInitialY - (currentFloor * this.cellWidth),
                        'brick'
                    ).setOrigin(0, 0);
                    newBarrier.displayWidth = this.cellWidth;
                    newBarrier.displayHeight = this.cellWidth;
                    // make newBarrier immovable
                    newBarrier.body.moves = false;
                    this.barriers.add(newBarrier);
                }
            });
        });
    }

    create() {
        this.cameras.main.setBackgroundColor('#000');

        // configure background
        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        // set physics world size
        this.physics.world.setBounds(0, 0, this.width, this.height - this.groundHeight);

        // configure player
        this.player = this.physics.add.sprite(0, this.playerInitialY, 'player').setOrigin(0, 0);
        this.player.setCollideWorldBounds(true);
        this.player.body.setCircle(138);
        this.player.displayWidth = this.playerWidth;
        this.player.displayHeight = this.playerWidth;

        // // configure level
        this.configureLevel(this.currentLevel);


        this.levelInfoText = this.add.text(16, 80, `уровень 1 из ${levels.length}`, {fontSize: '48px', fontStyle: 'bold', fill: '#eee' });
        this.numOfAttemptsText = this.add.text(16, 150, `попыток: ${this.numOfAttempts}`, {fontSize: '48px', fontStyle: 'bold', fill: '#eee' });


        // show fps value
        if (IS_DEV) {
            this.fpsText = new FpsText(this);
        }
    }

    restartGame() {
        this.restartGameText.destroy();
        this.currentLevel = 0;
        this.numOfAttempts = 0;
        this.numOfAttemptsText.setText(`попыток: ${this.numOfAttempts}`);
        this.levelInfoText.setText(`уровень ${this.currentLevel + 1} из ${levels.length}`);
        this.configureLevel(this.currentLevel);
        this.input.off('pointerdown');

        this.time.delayedCall(300, () => {
            this.input.on('pointerdown', () => {
                this.startRun();
            });
        }, [], this);
    }


    handleFinish(isLevelCompleted) {
        this.isCollision = false;
        // reset camera
        this.cameras.main.resetFX();
        this.numOfAttempts++;
        this.numOfAttemptsText.setText(`попыток: ${this.numOfAttempts}`);

        this.player.x = 0;
        this.player.y = this.playerInitialY;
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.input.off('pointerdown');
        this.input.on('pointerdown', () => {
            this.startRun();
        });

        // configure next level or complete the game
        if (isLevelCompleted && this.currentLevel < (this.numOfLevels - 1)) {
            this.configureLevel(++this.currentLevel);
            this.levelInfoText.setText(`уровень ${this.currentLevel + 1} из ${levels.length}`);
        } else if (isLevelCompleted && this.currentLevel === this.numOfLevels - 1) {
            this.input.off('pointerdown');
            this.restartGameText = this.add.text(1280 / 2, 720 / 2, `начать заново`, {fontSize: '80px', fontStyle: 'bold', fill: '#eee' });
            this.restartGameText.setOrigin(0.5);
            this.restartGameText.setInteractive();
            this.restartGameText.on('pointerdown', () => {
                this.restartGame();
            });
        }
    }

    collisionCallback() {
        if (this.isCollision) {
            return;
        }
        this.isCollision = true;

        // shake camera
        this.cameras.main.shake(400);

        // fade camera
        this.time.delayedCall(150, () => {
            this.cameras.main.fade(150);
        }, [], this);

        // call handleFinish with delay
        this.time.delayedCall(400, () => {
            this.handleFinish(false);
        }, [], this);
    }

    update() {
        if (IS_DEV) {
            this.fpsText.update(this);
        }

        // finish reached
        if (this.player.body.blocked.right) {
            this.handleFinish(true);
        }

        // listen for collision
        this.physics.world.collide(this.player, this.barriers, this.collisionCallback.bind(this));
    }
}
