class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("nick_spritesheet", "Nick_Spritesheet2.png", "Nick_Spritesheet2.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("platform", "platform.png");        
        this.load.image("pizza", "pizza.png");
        this.load.image("burger", "burger.png");
        this.load.image("sushi", "sushi.png");                 
        //this.load.image("tilemap_tiles", "platformPack_tilesheet.png");                         // Packed tilemap
        //this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON





        // Load Sound
        this.load.audio("jump", "cartoon-jump.mp3");
        this.load.audio("splash", "splash.mp3");
        

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('nick_spritesheet', {
                prefix: "Adventure_Character_Simple-",
                start: 8,
                end: 12,
                suffix: ".png",
            }),
            frameRate: 15,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'jump',
        //     defaultTextureKey: "platformer_characters",
        //     frames: [
        //         { frame: "tile_0023.png" }
        //     ],
        // });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'nick_spritesheet',
            frames: [
                { frame: 'Adventure_Character_Simple-13.png' },
                { frame: 'Adventure_Character_Simple-14.png' },
                { frame: 'Adventure_Character_Simple-15.png' },
                // Add more frames as needed
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'slide',
            defaultTextureKey: 'nick_spritesheet',
            frames: [
                { frame: 'Adventure_Character_Simple-77.png' },
            ],
            frameRate: 10,
            
        });
    

         // ...and pass to the next Scene
         //this.scene.start("platformerScene");
         this.scene.start("TitleScreen");
    }

    // Never get here since a new scene is started in create()
    update() {

    }
}