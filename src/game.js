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
			debug: false
		}
	},
	scene: {
		preload,
		create,
		update
	}
};

function preload() {
	this.load.spritesheet("ninja", "/assets/used/sprite-ninja.png", {
		frameWidth: 32,
		frameHeight: 32
	});

	this.load.image("platform", "https://labs.phaser.io/assets/sprites/platform.png");

	this.load.image("background", "/assets/used/background-city1-10.png");
}

function create() {
	gameStarted = false;
	gamePaused = true;

	this.add.image(0, 0, "background").setOrigin(0, 0).setScrollFactor(0).setDisplaySize(800, 600);

	// animations
	this.anims.create({
		key: "idle",
		frames: [{ key: "ninja", frame: 0 }],
		frameRate: 1,
		repeat: -1
	});

	this.anims.create({
		key: "run",
		frames: [
			{ key: "ninja", frame: 1 },
			{ key: "ninja", frame: 8 }
		],
		frameRate: 8,
		repeat: -1
	});

	this.anims.create({
		key: "jump",
		frames: [{ key: "ninja", frame: 9 }],
		frameRate: 1,
		repeat: -1
	});

	this.anims.create({
		key: "death",
		frames: [{ key: "ninja", frame: 5 }],
		frameRate: 1,
		repeat: -1
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

	const platforms = this.physics.add.staticGroup();

	// platforms
	const platform1 = platforms.create(600, 500, "platform");
	platform1.setScale(1).refreshBody();

	const platform2 = platforms.create(1600, 500, "platform");
	platform2.setScale(1).refreshBody();

	const platform4 = platforms.create(2600, 500, "platform");
	platform4.setScale(1).refreshBody();

	const platform5 = platforms.create(3600, 500, "platform");
	platform5.setScale(1).refreshBody();

	const platform7 = platforms.create(4600, 500, "platform");
	platform7.setScale(1).refreshBody();

	const platform8 = platforms.create(5600, 500, "platform");
	platform8.setScale(1).refreshBody();

	const platform9 = platforms.create(6600, 500, "platform");
	platform9.setScale(1).refreshBody();

	const platform10 = platforms.create(7600, 500, "platform");
	platform10.setScale(1).refreshBody();

	const platform11 = platforms.create(8600, 500, "platform");
	platform11.setScale(1).refreshBody();

	this.physics.add.collider(player, platforms);

	this.startText = this.add.text(400, 300, 'Press Space to Start', {
		fontSize: '32px',
		fill: '#fff'
	}).setOrigin(0.5);

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

// switch between run and jump animations based on grounded state
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
	if (player.y > 1000 && !gamePaused) {
		gamePaused = true;
		player.setVelocity(0, 0);
		player.body.allowGravity = false;
		player.anims.play("death", true);

		const gameOverText = this.add.text(player.x, player.y - 50, 'GAME OVER', {
			fontSize: '48px',
			fill: '#fff'
		}).setOrigin(0.5);

		this.tweens.add({
			targets: gameOverText,
			alpha: { from: 0, to: 1 },
			duration: 300
		});

		// Let user know they can restart
		this.add.text(player.x, player.y + 60, 'Press Space to Restart', {
			fontSize: '24px',
			fill: '#fff'
		}).setOrigin(0.5);
	}
}

new Phaser.Game(config);
