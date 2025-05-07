import Phaser from "phaser";

let player;
let gameStarted = false;
let gamePaused = true;

const RUN_SPEED = 500;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#222",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

// === PRELOAD: Load assets ===
function preload() {
  this.load.spritesheet("ninja", "/assets/used/sprite-ninja.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

  this.load.image("platform", "/assets/used/building.png");

  this.load.image("background", "/assets/used/background-city1-10.png");
}

// === CREATE: Set up game scene ===
function create() {
  gameStarted = false;
  gamePaused = true;

  this.add
    .image(0, 0, "background")
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDisplaySize(800, 600);

  this.anims.create({
    key: "idle",
    frames: [{ key: "ninja", frame: 0 }],
    frameRate: 1,
    repeat: -1,
  });

  this.anims.create({
    key: "run",
    frames: [
      { key: "ninja", frame: 1 },
      { key: "ninja", frame: 8 },
    ],
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "jump",
    frames: [{ key: "ninja", frame: 9 }],
    frameRate: 1,
    repeat: -1,
  });

  this.anims.create({
    key: "death",
    frames: [{ key: "ninja", frame: 5 }],
    frameRate: 1,
    repeat: -1,
  });

  // prevents Phaser from smoothing the pixel art when scaled
  this.textures.get("ninja").setFilter(Phaser.Textures.FilterMode.NEAREST);

  player = this.physics.add.sprite(400, 400, "ninja", 1);
  this.cameras.main.startFollow(player);
  player.setVelocityX(0);
  player.setScale(3);
  player.anims.play("idle", true);

  // set custom hitbox size to match ninja’s visible body
  player.body.setSize(12, 15, true);
  player.body.setOffset(10, 11);

  // helper function to create platforms
  function createPlatform(scene, group, x, y) {
    const platform = group.create(x, y, "platform").setScale(0.5).refreshBody();

    platform.body.setSize(platform.displayWidth * 0.64, 10);
    platform.body.setOffset(95, 15);
    return platform;
  }

  const platforms = this.physics.add.staticGroup();

  // loop adding platforms
  for (let i = 0; i < 20; i++) {
    const x = 500 + i * 830;
    createPlatform(this, platforms, x, 670);
  }

  this.physics.add.collider(player, platforms);

  this.startText = this.add
    .text(400, 300, "Press Space to Start", {
      fontSize: "32px",
      fill: "#fff",
    })
    .setOrigin(0.5);

  this.input.keyboard.on("keydown-SPACE", () => {
    if (!gameStarted) {
      gameStarted = true;
      gamePaused = false;
      player.setVelocityX(RUN_SPEED);
      player.anims.play("run", true);
      this.startText.destroy();
      return;
    }

    if (gameStarted && gamePaused) {
      this.scene.restart();
      return;
    }

    if (!gamePaused && player.body.blocked.down) {
      player.setVelocityY(-400);
    }
  });
}

// === UPDATE: Game loop logic ===
function update() {
  if (!gameStarted) {
    player.anims.play("idle", true);
    return;
  }

  if (gamePaused) return;

  if (!player.body.blocked.down) {
    player.anims.play("jump", true);
  } else {
    player.anims.play("run", true);
  }

  // fall detection
  if (player.y > 580 && !gamePaused) {
    gamePaused = true;
    player.setVelocity(0, 0);
    player.body.allowGravity = false;
    player.anims.play("death", true);

    const gameOverText = this.add
      .text(player.x, player.y - 50, "GAME OVER", {
        fontSize: "48px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: gameOverText,
      alpha: { from: 0, to: 1 },
      duration: 300,
    });

    this.add
      .text(player.x, player.y + 60, "Press Space to Restart", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5);
  }
}

new Phaser.Game(config);
