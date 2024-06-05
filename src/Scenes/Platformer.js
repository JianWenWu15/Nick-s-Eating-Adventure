class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 300;
        this.DRAG = 800;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        //this.map = this.add.tilemap("platformer-level-1", 18, 18, 75, 25);
    

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        //this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        //this.tileset = this.map.addTilesetImage("SimpleTileset", "tilemap_tiles");

        // Create a layer
        // this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        // // Create Mushroom layer
        // this.mushroomLayer = this.map.createLayer("Mushrooms", this.tileset, 0, 0);

        // // Water layer
        // this.waterLayer = this.map.createLayer("Water", this.tileset, 0, 0);

        this.jumpSound = this.sound.add("jump");
        this.splashSound = this.sound.add("splash");

        this.hasKey = false;

        //let foodObstacles = this.physics.add.group();

        this.nextObstacleTime = 0;


        

        // Make it collidable
        // this.groundLayer.setCollisionByProperty({
        //     collides: true
        // });

        // this.mushroomLayer.setCollisionByProperty({
        //     collides: true
        // });

        // this.waterLayer.setCollisionByProperty({
        //     collides: true
        // });

        // TODO: Add createFromObjects here
        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        // this.coins = this.map.createFromObjects("Objects", {
        //     name: "coin",
        //     key: "tilemap_sheet",
        //     frame: 151
        // });

        // this.key = this.map.createFromObjects("Objects", {
        //     name: "key",
        //     key: "tilemap_sheet",
        //     frame: 27
        // });

        // this.door = this.map.createFromObjects("Objects", {
        //     name: "door",
        //     key: "tilemap_sheet",
        //     frame: 150
        // });
        

        // TODO: Add turn into Arcade Physics here
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        // this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // this.physics.world.enable(this.key, Phaser.Physics.Arcade.STATIC_BODY);

        // this.physics.world.enable(this.door, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
        

        // set up player avatar
        this.nick = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0022.png");
        //this.nick = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0022.png");
        this.nick.setCollideWorldBounds(true);

        // // Enable collision handling
        // this.physics.add.collider(this.nick, this.groundLayer);

        // // Bounce the player when they land on a mushroom
        // // Enable overlap handling for mushrooms
        // this.physics.add.collider(this.nick, this.mushroomLayer, (player, mushroom) => {
        //     console.log("Player is touching a mushroom");
        //     player.body.velocity.y = -300; // Bounce the player
        //     this.jumpSound.play();
            
        // });

        // // Enable overlap handling for water
        // this.physics.add.collider(this.nick, this.waterLayer, (player, water) => {
        //     console.log("Player is touching water");
        //     this.splashSound.play();
        //     player.body.position.x = 30;
        //     player.body.position.y = 345;
        //     this.scene.start("RestartScene");
        //     //this.scene.restart();
            
        // });



        // TODO: Add coin collision handler
        // Handle collision detection with coins
        this.physics.add.overlap(this.nick, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
        });

        this.physics.add.overlap(this.nick, this.key, (player, key) => {
            key.destroy(); // remove the key
            console.log("Player has the key");
            this.hasKey = true; // player now has the key
        }, null, this);

        this.physics.add.overlap(this.nick, this.door, (player, door) => {
            if(this.hasKey) {
                // Move to next level
                console.log("Player has the key. Moving to next level");
            }
        }, null, this);

        
        

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_03.png', 'dirt_02.png'],
            // TODO: Try: add random: true
            scale: {start: 0.01, end: 0.02},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 300,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
            
        });
        my.vfx.walking.stop();

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['spark_01.png', 'spark_02.png'],
            scale: {start: 0.1, end: 0.05},
            lifespan: 300,
            alpha: {start: 1, end: 0.1},
            
        });

        my.vfx.jumping.stop();

        
        

        // TODO: add camera code here
        //this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.nick, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        

    }

    update() {

        // Create food obstacles 
        if (Phaser.Time.Now > this.nextObstacleTime) {
            let obstacle = foodObstacles.create(game.config.width, Phaser.Math.Between(100, game.config.height - 100), 'coin');
            obstacle.setVelocityX(-200);
            this.nextObstacleTime = Phaser.Time.Now + Phaser.Math.Between(1000, 2000);
        }

        // Detect When this.nick eats food
        this.physics.add.collider(this.nick, this.foodObstacles, () => {
            // Increase this.nick's size and decrease his speed
            this.nick.setScale(this.nick.scale + 0.1);
            this.nick.setVelocityX(this.nick.velocity.x - 10);
        }, null, this);
        
        
        if(cursors.left.isDown) {
            this.nick.setAccelerationX(-this.ACCELERATION);
            this.nick.resetFlip();
            this.nick.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(this.nick, this.nick.displayWidth/2-10, this.nick.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (this.nick.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown) {
            this.nick.setAccelerationX(this.ACCELERATION);
            this.nick.setFlip(true, false);
            this.nick.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(this.nick, this.nick.displayWidth/2-10, this.nick.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (this.nick.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            this.nick.setAccelerationX(0);
            this.nick.setDragX(this.DRAG);
            this.nick.anims.play('idle');
            
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!this.nick.body.blocked.down) {
            this.nick.anims.play('jump');
            
            
            
        }
        if(this.nick.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.nick.body.setVelocityY(this.JUMP_VELOCITY);
            // play jump sound
            this.jumpSound.play();

            my.vfx.jumping.startFollow(this.nick, this.nick.displayWidth/2-10, this.nick.displayHeight/2-5, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jumping.start();
            
        } else if(this.nick.body.blocked.down) {
            my.vfx.jumping.stop();
        }

        

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        //Check if the player is out of bounds and respawn
        if(this.nick.y > this.game.heightInPixels) {
            this.scene.restart();
        }

        // if The player x is greater than the width of the map stop the player
        if(this.nick.x > this.game.widthInPixels) {
            this.nick.setVelocityX(0);
            this.nick.x = this.map.widthInPixels; // Set player's x position to the edge of the map
        }

        

        
    }
}