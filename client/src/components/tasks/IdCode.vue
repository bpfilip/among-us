<template>
	<div class="IdCode">
		<div class="container">
			<img src="img/task/idCode/background.png" class="background" />
			<VueP5
				class="sketch"
				@setup="setup"
				@draw="draw"
				@touchstarted="touchStarted"
				@touchended="touchEnded"
				@preload="preLoad"
				:additionalEvents="['touchStarted', 'touchEnded', 'preLoad']"
			/>
		</div>
	</div>
</template>

<script>
	import VueP5 from "vue-p5";
	export default {
		name: "IdCode",
		data() {
			return {
				clicked: false,
				done: false,
				p5: null,
				font: "Arial",
				display: "",
				buttonPos: [
					{ x: 274, y: 228 },
					{ x: 207, y: 49 },
					{ x: 274, y: 49 },
					{ x: 341, y: 49 },
					{ x: 207, y: 109 },
					{ x: 274, y: 109 },
					{ x: 341, y: 109 },
					{ x: 207, y: 168 },
					{ x: 274, y: 168 },
					{ x: 341, y: 168 }
				],
				code: "12345"
			};
		},
		computed: {},
		components: {
			VueP5
		},
		props: {
			onDone: {
				required: true
			}
		},
		beforeDestroy() {
			this.p5.noLoop();
		},
		methods: {
			preLoad(p5) {
				this.p5 = p5;
				this.walletImage = p5.loadImage("img/task/idCode/wallet.png");
				this.walletFrontImage = p5.loadImage("img/task/idCode/walletFront.png");
				this.cardImage = p5.loadImage("img/task/idCode/card.png");
				this.font = p5.loadFont("SevenSegment.ttf");
			},
			setup(p5) {
				let c = p5.createCanvas(606, 604);
				c.elt.style.width = "90vh";
				c.elt.style.height = "90vh";
				p5.imageMode(p5.CORNER);
				p5.angleMode(p5.DEGREES);
				this.code = Math.floor(Math.random() * 100000).toString();
				while (this.code.length < 5) this.code = "0" + this.code;
			},
			draw(p5) {
				p5.clear();

				p5.image(this.walletImage, 48, 437);
				p5.textFont("Arial");
				p5.textSize(20);
				p5.fill(0);

				if (!this.clicked) {
					p5.image(this.cardImage, 69, 485);
					p5.text(this.code, 200, 535);
				} else {
					p5.image(this.cardImage, 97, 374);
					p5.text(this.code, 228, 424);
				}

				p5.image(this.walletFrontImage, 58, 520);

				p5.textFont(this.font);
				p5.textSize(32);
				p5.fill(255);
				p5.text(this.display, 130, 340);
			},
			touchStarted(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				for (let i = 0; i < 10; i++) {
					let buttonX = this.buttonPos[i].x;
					let buttonY = this.buttonPos[i].y;
					if (
						x - buttonX < 57 &&
						x - buttonX > 0 &&
						y - buttonY < 56 &&
						y - buttonY > 0
					) {
						this.display += i;
						console.log(this.display);
					}
				}
				let buttonX = 207;
				let buttonY = 228;
				if (x - buttonX < 57 && x - buttonX > 0 && y - buttonY < 56 && y - buttonY > 0) {
					this.display = "";
					console.log(this.display);
				}
				buttonX = 341;
				buttonY = 228;
				if (x - buttonX < 57 && x - buttonX > 0 && y - buttonY < 56 && y - buttonY > 0) {
					console.log(this.display);
					if (this.display == this.code) {
						setTimeout(this.onDone, 500);
					}
				}

				buttonX = 69;
				buttonY = 485;
				if (x - buttonX < 227 && x - buttonX > 0 && y - buttonY < 60 && y - buttonY > 0) {
					this.clicked = true;
				}
			},

			touchEnded(p5) {}
		}
	};
</script>

<style scoped>
	.IdCode {
		position: relative;
		height: 90vh;
		width: 90vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.container {
		position: relative;
	}
	.background {
		height: 90vh;
	}
	.sketch {
		position: absolute;
		top: 0;
		left: 0;
		height: 90vh;
		width: 90vh;
		display: flex;
		flex-direction: column;
	}
</style>
