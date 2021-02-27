<template>
	<div class="AdminSwipe">
		<div class="container">
			<img src="img/task/adminSwipe/background.png" class="background" />
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
		name: "AdminSwipe",
		data() {
			return {
				done: false,
				p5: null,
				clicked: false,
				pickedUp: false,
				sliderPosition: 0,
				startX: 0,
				startTime: 0,
				message: "Please insert card",
				font: "Arial",
				done: false
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
				this.redImage = p5.loadImage("img/task/adminSwipe/red.png");
				this.greenImage = p5.loadImage("img/task/adminSwipe/green.png");
				this.redOffImage = p5.loadImage("img/task/adminSwipe/redOff.png");
				this.greenOffImage = p5.loadImage("img/task/adminSwipe/greenOff.png");
				this.sliderTopImage = p5.loadImage("img/task/adminSwipe/sliderTop.png");
				this.sliderBottomImage = p5.loadImage("img/task/adminSwipe/sliderBottom.png");
				this.walletImage = p5.loadImage("img/task/adminSwipe/wallet.png");
				this.walletFrontImage = p5.loadImage("img/task/adminSwipe/walletFront.png");
				this.cardImage = p5.loadImage("img/task/adminSwipe/card.png");
				this.font = p5.loadFont("SevenSegment.ttf");
			},
			setup(p5) {
				let c = p5.createCanvas(500, 500);
				c.elt.style.width = "95vh";
				c.elt.style.height = "95vh";
				p5.imageMode(p5.CORNER);
				p5.angleMode(p5.DEGREES);
			},
			draw(p5) {
				p5.clear();

				if (this.clicked) {
					if (this.startX <= p5.mouseX) {
						this.sliderPosition = p5.mouseX - this.startX;
					} else {
						this.sliderPosition = 0;
					}
					if (this.sliderPosition > 265) {
						this.sliderPosition = 265;
					}
				}

				p5.imageMode(p5.CORNER);
				p5.image(this.sliderBottomImage, 0, 127);
				if (this.pickedUp && !this.done)
					p5.image(this.cardImage, 5 + this.sliderPosition, 115); // Only if picked up
				// p5.image(this.cardImage, 270, 115); // Swiped
				p5.image(this.sliderTopImage, 0, 0);
				p5.image(this.walletImage, 12, 330);
				if (!this.pickedUp || this.done) p5.image(this.cardImage, 31, 357); // Only if not picked up
				p5.image(this.walletFrontImage, 22, 412);

				p5.image(this.done ? this.greenImage : this.greenOffImage, 449, 115);
				p5.image(this.fail ? this.redImage : this.redOffImage, 407, 115);

				p5.textAlign(p5.LEFT, p5.TOP);
				p5.fill(255);
				p5.textFont(this.font);
				p5.textSize(30);
				p5.text(this.message, 46, 18);
			},
			touchStarted(p5) {
				if (this.done) return;
				if (!this.pickedUp) {
					let x = p5.mouseX;
					let y = p5.mouseY;
					let cardX = 31;
					let cardY = 357;
					if (x - cardX < 227 && x - cardX > 0 && y - cardY < 70 && y - cardY > 0) {
						this.pickedUp = true;
						this.message = "Please swipe card";
					}
				} else {
					let x = p5.mouseX;
					let y = p5.mouseY;
					let cardX = 5;
					let cardY = 166;
					if (x - cardX < 227 && x - cardX > 0 && y - cardY < 86 && y - cardY > 0) {
						this.clicked = true;
						this.startX = x;
						this.startTime = performance.now();
					}
				}
			},

			touchEnded(p5) {
				if (this.done) return;
				if (this.clicked && this.sliderPosition >= 265) {
					const now = performance.now();
					if (now - this.startTime < 400) {
						this.message = "Too fast. Try again";
						this.fail = true;
					}
					if (now - this.startTime > 500) {
						this.message = "Too slow. Try again";
						this.fail = true;
					}
					if (now - this.startTime > 400 && now - this.startTime < 500) {
						this.message = "Accepted. Thank you.";
						this.done = true;
						this.fail = false;
						setTimeout(this.onDone, 1000);
					} else {
						this.clicked = false;
						this.sliderPosition = 0;
					}
				} else if (this.clicked) {
					this.clicked = false;
					this.sliderPosition = 0;
				}
			}
		}
	};
</script>

<style scoped>
	.AdminSwipe {
		position: relative;
		height: 95vh;
		width: 95vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.container {
		position: relative;
	}
	.background {
		height: 95vh;
	}
	.sketch {
		position: absolute;
		top: 0;
		left: 0;
		height: 95vh;
		width: 95vh;
		display: flex;
		flex-direction: column;
	}
</style>
