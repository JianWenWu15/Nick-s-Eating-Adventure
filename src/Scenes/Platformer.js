class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 300;
        this.platformStartSpeed = 200;
        this.spawnRange = [80, 300];
        this.DRAG = 800;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    create() {

        // group with all active platforms.
        this.platformGroup = this.add.group({
 
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });
 
        // of platforms pool
        this.platformPool = this.add.group({
 
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });

        // Initial platforms to fill the screen
        let platformWidth = 800;
        let initialX = 0;

        while (initialX < this.game.config.width) {
            this.addPlatform(platformWidth, initialX);
            initialX += platformWidth;
        }

        this.jumpSound = this.sound.add("jump");



        

        // set up player avatar
        this.nick = this.physics.add.sprite(30, 245, "platformer_characters", "tile_0022.png");
        this.nick.setCollideWorldBounds(true);

        
        

        this.time.addEvent({
            delay: 400, // Adjust the delay as needed
            callback: this.spawnNextPlatform,
            callbackScope: this,
            loop: true
          });

          this.physics.add.collider(this.nick, this.platformGroup);


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

        
        

        // Leaving Code here in case we want to do camera stuff
        //this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // this.cameras.main.startFollow(this.nick, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        // this.cameras.main.setDeadzone(50, 50);
        // this.cameras.main.setZoom(this.SCALE);
        

    }

    addPlatform(platformWidth, posX){
        let platform ;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            if (platform) {
                platform.x = posX;
                platform.active = true;
                platform.visible = true;
                this.platformPool.remove(platform);
            }
            
        }
        else {
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "platform");
            platform.setImmovable(true);
            platform.setVelocityX(150 * -1);
            platform.body.allowGravity = false;
            this.platformGroup.add(platform);
            
        }
        if (platform) {
            platform.displayWidth = platformWidth;
            this.nextPlatformDistance = Phaser.Math.Between(this.spawnRange[0], this.spawnRange[1]);

        }
        
        
    }

    update() {

        this.platformGroup.getChildren().forEach((platform) => {
            if (platform.x + platform.displayWidth < 0) {
              this.platformPool.add(platform);
              this.platformGroup.remove(platform);
            }
          });
        
        
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
        if(this.nick.y > 350) {
            //this.scene.restart();
            //this.nick.y = 345;
        }

        // if The player x is greater than the width of the map stop the player
        if(this.nick.x > this.game.widthInPixels) {
            this.nick.setVelocityX(0);
            this.nick.x = this.map.widthInPixels; // Set player's x position to the edge of the map
        }

        console.log(this.nick.y);

        

        
    }

    // Function that calls the addPlatform function to spawn the next platform
    spawnNextPlatform() {
        const rightmostPlatform = this.findRightmostPlatform();
        let nextPlatformX;
        if (rightmostPlatform) {
            nextPlatformX = rightmostPlatform.x + rightmostPlatform.displayWidth;
        } else {
            // If there's no platform, spawn the new platform at the end of the screen
            nextPlatformX = this.game.config.width;
        }
        this.addPlatform(this.game.config.width, nextPlatformX);
      }

    // Function to find the rightmost platform in the game to spawn the next platform
    findRightmostPlatform() {
        let rightmostPlatform = null;
        this.platformGroup.getChildren().forEach((platform) => {
          if (!rightmostPlatform || platform.x > rightmostPlatform.x) {
            rightmostPlatform = platform;
          }
        });
        return rightmostPlatform;
      }
}