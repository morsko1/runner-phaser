export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.image('bg', 'assets/img/bg.jpg');
        this.load.image('player', 'assets/img/player.png');
        this.load.image('brick', 'assets/img/brick1.jpg');
    }

    create() {
        this.scene.start('MainScene');
    }
}
