import levels from '../objects/levels';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // configure background
        this.cameras.main.setBackgroundColor('#000');

        // configure background
        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        // configure resume button
        this.continueText = this.add.text(900, 150, `продолжить`, {fontSize: '48px', fontStyle: 'bold', fill: '#eee' });
        this.continueText.setInteractive();
        this.continueText.on('pointerdown', () => {
            this.scene.resume('MainScene');
            this.scene.stop();
        });

        const currentLevel = +localStorage.getItem('currentLevel');

        // configure links to levels
        levels.map((level, index) => {
            const link = this.add.text(
                (index > 9 ? index - 10 : index) * (1280 / levels.length * 2) + 40,
                460 + (index > 9 ? 80 : 0),
                index + 1,
                {fontSize: '48px', fontStyle: 'bold', fill: currentLevel === index ? '#cc0099' : '#eee' }
            );
            link.setInteractive();
            link.on('pointerdown', () => {
                this.scene.resume('MainScene', {level: index});
                this.scene.stop();
            });
        });
    }
}
