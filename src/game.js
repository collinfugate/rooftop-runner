import Phaser from "phaser";

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

let player;

const RUN_SPEED = 300;

function preload() {
	this.load.spritesheet("ninja", "/assets/ninja/ninja-black-32x32.png", {
		frameWidth: 32,
		frameHeight: 32
	});

	this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
}
function create() {

	// prevents Phaser from smoothing the pixel art when scaled
	this.textures.get("ninja").setFilter(Phaser.Textures.FilterMode.NEAREST);

	player = this.physics.add.sprite(400, 400, "ninja", 1);
	this.cameras.main.startFollow(player);
	player.setVelocityX(RUN_SPEED);
	player.setScale(3);

	// set custom hitbox size to match ninja’s visible body
	player.body.setSize(12, 15, true);
	player.body.setOffset(10, 11);

	const platforms = this.physics.add.staticGroup();

	// platforms
	const ground1 = platforms.create(400, 500, "ground");
	ground1.setScale(2).refreshBody();
	const ground2 = platforms.create(1600, 500, "ground");
	ground2.setScale(2).refreshBody();
	const ground3 = platforms.create(2800, 500, "ground");
	ground3.setScale(2).refreshBody();

	this.physics.add.collider(player, platforms);
	this.input.keyboard.on("keydown-SPACE", () => {
		player.setVelocityY(-400);
	});
}

function update() { }

new Phaser.Game(config);
