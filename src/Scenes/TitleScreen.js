class TitleScreen extends Phaser.Scene {
    constructor() {
        super('TitleScreen');
    }

    create() {
        // Display a restart message
        this.add.text(100, 100, 'Welcome To the Game', { fill: '#ffffff' });

        // Wait for the player to press Space
        this.input.keyboard.on('keydown-SPACE', () => {
            // Switch back to the main scene
            this.scene.start('platformerScene');
        });
    }
}