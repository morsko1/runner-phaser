import 'phaser';
import '@babel/polyfill';

import MainScene from './scenes/mainScene';
import MenuScene from './scenes/menuScene';
import PreloadScene from './scenes/preloadScene';

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

const config = {
    backgroundColor: '#ffffff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [PreloadScene, MainScene, MenuScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 2000 }
        }
    }
}

window.addEventListener('load', () => {
    let game = new Phaser.Game(config);
});
