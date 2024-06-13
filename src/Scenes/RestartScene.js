class RestartScene extends Phaser.Scene {
    constructor() {
        super('RestartScene');
    }

    create() {
        // Display a restart message
        this.add.text(100, 100, 'Game Over. Press Space to Restart', { fill: '#ffffff' })
            .setFontSize(35);
        this.add.text(100, 600, 'Credits: Ian Liu, Jianwen Wu, Trinity Wu', { fill: '#ffffff' })
            .setFontSize(25);
        this.add.text(550, 200, "Score")
            .setFontSize(50);

        this.cameras.main.setBackgroundColor("#bae9ff");

        // Wait for the player to press Space
        this.input.keyboard.on('keydown-SPACE', () => {
            // Switch back to the main scene
            this.scene.start('platformerScene');
        });
    }
}