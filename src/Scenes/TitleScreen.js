class TitleScreen extends Phaser.Scene {
    constructor() {
        super('TitleScreen');
    }

    create() {
        // Display title screen image
        this.add.image(740, 370, 'title');

        this.cameras.main.setBackgroundColor("#bae9ff");

        // Wait for the player to press Space
        this.input.keyboard.on('keydown-SPACE', () => {
            // Switch back to the main scene
            this.scene.start('platformerScene');
        });
    }
}