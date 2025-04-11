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
	this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
}

function create() {
	player = this.physics.add.sprite(100, 450, "player");
	player.setCollideWorldBounds(true);

	this.input.keyboard.on("keydown-SPACE", () => {
		player.setVelocityY(-400);
	});
}

function update() { }

new Phaser.Game(config);
