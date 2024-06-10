function  obstacleCollide(nick, obstacle){
    obstacle.destroy();
}
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
        this.physics.world.gravity.y = 1800; //initial 1500
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.platformSpeed = 150;
        this.gameClock = 0;
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

        //TODO: make background/platforms more interesting with textures

        // Initial platforms to fill the screen
        let platformWidth = 800;
        let initialX = 0;

        while (initialX < this.game.config.width) {
            this.addPlatform(platformWidth, initialX);
            initialX += platformWidth;
        }

        this.jumpSound = this.sound.add("jump");

        this.obstacleGroup = this.add.group({
            removeCallback: function(obstacle){
                
            }
        })
        //Obstacle pool
        this.obstaclePool = this.add.group();
        this.obstacles = ["sushi", "pizza", "burger"];
        this.heightPool = [480,573];

        //TODO: add powerups 
        //maybe also make a guide/infographic for powerups as well for an escape tab
        
        
        // set up player avatar
        //this.nick = this.physics.add.sprite(30, 245, "platformer_characters", "tile_0022.png");
        //TODO: fix height of character and add slide/crouch animation
        this.nick = this.physics.add.sprite(30, 245, "nick_spritesheet", "Adventure_Character_Simple-13.png");
        this.nick.body.customSeparateX = true;
        this.nick.setCollideWorldBounds(true);

        this.nick.body.debugShowBody = false;
        this.nick.body.debugShowVelocity = false;
        this.nick.setFlipX(true);
        

        this.time.addEvent({
            delay: 400, // Adjust the delay as needed
            callback: this.spawnNextPlatform,
            callbackScope: this,
            loop: true
          });

        //TODO: Change how spawning works, set spawn timer kinda boring
        this.time.addEvent({
            delay: 600, // Adjust the delay as needed
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });
        
        
        this.physics.add.collider(this.nick, this.platformGroup);
        this.physics.add.collider(this.nick, this.obstacleGroup,obstacleCollide);


        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // TODO: fix up particles current ones are eh
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

        

    }
    spawnObstacle(){
        let randObst = this.obstacles[Math.floor(Math.random()*this.obstacles.length)];
        let obstacle = this.physics.add.sprite( 0, this.sys.game.config.width,randObst);
        
        obstacle.setVelocityX(-400); //CHange velocity
        obstacle.body.allowGravity = false;
        obstacle.x = this.game.config.width;//set the x to the edge of screen
        obstacle.y = this.heightPool[Math.floor(Math.random() * 2)]; //set to random between the numbers in this.heightPool
        this.obstacleGroup.add(obstacle);       
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
            platform.setVelocityX(this.platformSpeed * -1);
            platform.body.allowGravity = false;
            this.platformGroup.add(platform);
            
        }
        if (platform) {
            platform.displayWidth = platformWidth;
            this.nextPlatformDistance = Phaser.Math.Between(this.spawnRange[0], this.spawnRange[1]);

        }
        
        
    }

    update() {
        //Timer debugging
        //TODO: make platform/obstacle speed scale with game timer
        if(this.gameClock%60 == 0)
        console.log(this.gameClock/60);
        this.gameClock++;

        // match player velocity to platform velocity
        if (this.nick.x < 400) {
            this.nick.setVelocityX(400 - this.nick.x);
        } else {
            this.nick.setVelocityX(0);
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!this.nick.body.blocked.down) {
            this.nick.anims.play('jump');
            this.nick.setVelocityX(0);   
        }
        if(this.nick.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.nick.body.setVelocityY(this.JUMP_VELOCITY);
            // play jump sound
            this.jumpSound.play();
            my.vfx.walking.startFollow(this.nick, this.nick.displayWidth/2-10, this.nick.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.start();
            
        } else if(this.nick.body.blocked.down) {
            my.vfx.jumping.stop();
        }

        //Player slide/fast fall
        if(this.nick.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.down)){
            //Slide code
        }
        else if(!this.nick.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.down)){
            this.physics.world.gravity.y = 3800;
        }
        if(this.nick.body.blocked.down){
            this.physics.world.gravity.y = 1800;
        }

        //Auto walking
        //Character doesn't move but constantly plays animation
        //Still need to fix VFX
        else{
            //this.nick.anims.play('walk', true);
            my.vfx.walking.startFollow(this.nick, this.nick.displayWidth/2-30, this.nick.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.start();
        }
        

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }


        this.obstacleGroup.getChildren().forEach(obstacle => {
            if (obstacle.x < 0) {
                obstacle.destroy(); // Remove obstacle when it goes off-screen
            }

        });

        
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