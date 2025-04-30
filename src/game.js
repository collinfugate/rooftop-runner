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

function preload() {
	this.load.spritesheet("ninja", "/assets/ninja/ninja-black-32x32.png", {
		frameWidth: 32,
		frameHeight: 32
	});
}
function create() {
	this.textures.get("ninja").setFilter(Phaser.Textures.FilterMode.NEAREST); // Prevents Phaser from smoothing the pixel art when scaled

	player = this.physics.add.sprite(100, 450, "ninja", 0);
	player.setCollideWorldBounds(true);
	player.setScale(3);

	this.input.keyboard.on("keydown-SPACE", () => {
		player.setVelocityY(-400);
	});
}

function update() { }

new Phaser.Game(config);
