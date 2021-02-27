<template>
	<div class="StartReactor">
		<div class="container">
			<img src="img/task/startReactor/background.png" class="background" />
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
		name: "StartReactor",
		data() {
			return {
				done: false,
				p5: null,
				clicked: null,
				done: false,
				buttonPos: [
					{ x: 317, y: 86 },
					{ x: 370, y: 86 },
					{ x: 422, y: 86 },
					{ x: 317, y: 138 },
					{ x: 370, y: 138 },
					{ x: 422, y: 138 },
					{ x: 317, y: 189 },
					{ x: 370, y: 189 },
					{ x: 422, y: 189 }
				],
				buttonsActive: false,
				pattern: [],
				step: 0,
				squarePos: [
					{ x: 55, y: 96 },
					{ x: 102, y: 96 },
					{ x: 149, y: 96 },
					{ x: 55, y: 143 },
					{ x: 102, y: 143 },
					{ x: 149, y: 143 },
					{ x: 55, y: 190 },
					{ x: 102, y: 190 },
					{ x: 149, y: 190 }
				],
				stepInCurrentSequence: -1,
				stepCurrentlyShowing: -1,
				sequenceStart: performance.now(),
				lampImages: []
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
				this.backgroundImage = p5.loadImage("img/task/startReactor/background.png");
				this.screenImage = p5.loadImage("img/task/startReactor/screen.png");
				this.buttonShadowImage = p5.loadImage("img/task/startReactor/buttonShadow.png");
				this.buttonPressedImage = p5.loadImage("img/task/startReactor/buttonPressed.png");
				this.buttonActiveImage = p5.loadImage("img/task/startReactor/buttonActive.png");
				this.buttonDisabledImage = p5.loadImage("img/task/startReactor/buttonDisabled.png");
				this.lampImages[0] = p5.loadImage("img/task/startReactor/all off.png");
				this.lampImages[1] = p5.loadImage("img/task/startReactor/1 on.png");
				this.lampImages[2] = p5.loadImage("img/task/startReactor/2 on.png");
				this.lampImages[3] = p5.loadImage("img/task/startReactor/3 on.png");
				this.lampImages[4] = p5.loadImage("img/task/startReactor/4 on.png");
				this.lampImages[5] = p5.loadImage("img/task/startReactor/5 on.png");
				this.lampFailImage = p5.loadImage("img/task/startReactor/fail.png");
			},
			setup(p5) {
				let c = p5.createCanvas(514, 281);
				c.elt.style.width = "146.33vh";
				c.elt.style.height = "80vh";
				p5.imageMode(p5.CORNER);
				p5.angleMode(p5.DEGREES);

				this.pattern = [
					Math.floor(Math.random() * 9),
					Math.floor(Math.random() * 9),
					Math.floor(Math.random() * 9),
					Math.floor(Math.random() * 9),
					Math.floor(Math.random() * 9)
				];
			},
			draw(p5) {
				p5.clear();

				p5.image(this.backgroundImage, 0, 0);
				p5.image(this.backgroundImage, 267, 0);

				p5.image(this.screenImage, 47, 88);
				p5.image(this.buttonShadowImage, 317, 88);

				for (let i = 0; i < 9; i++) {
					p5.image(
						this.buttonsActive
							? this.clicked === i
								? this.buttonPressedImage
								: this.buttonActiveImage
							: this.buttonDisabledImage,
						this.buttonPos[i].x,
						this.buttonPos[i].y
					);
				}

				p5.fill(68, 168, 254);
				if (!this.buttonsActive) {
					const now = performance.now();
					if (this.stepCurrentlyShowing === -1 && now - this.sequenceStart > 300) {
						this.stepCurrentlyShowing++;
					} else {
						for (let i = 0; i <= this.step; i++) {
							if (
								now - this.sequenceStart > 300 + i * 300 &&
								now - this.sequenceStart < 500 + i * 300
							) {
								p5.rect(
									this.squarePos[this.pattern[i]].x,
									this.squarePos[this.pattern[i]].y,
									44,
									44
								);
							}
						}
						if (now - this.sequenceStart > 600 + this.step * 300) {
							this.buttonsActive = true;
							this.stepCurrentlyShowing = -1;
							this.wrong = false;
						}
					}
				}
				p5.image(this.lampImages[this.step + 1], 46, 42);
				p5.image(
					this.lampImages[
						this.stepInCurrentSequence +
							1 +
							(performance.now() - this.sequenceStart < 300 ? this.step : 0)
					],
					313,
					42
				);
				if (this.wrong) {
					p5.image(this.lampFailImage, 46, 42);
					p5.image(this.lampFailImage, 313, 42);
				}

				if (this.done) {
					for (let i = 0; i < 9; i++) {
						p5.image(this.buttonPressedImage, this.buttonPos[i].x, this.buttonPos[i].y);
					}
				}
			},
			touchStarted(p5) {
				if (this.clicked === null && this.buttonsActive) {
					let x = p5.mouseX;
					let y = p5.mouseY;
					for (let i = 0; i < 9; i++) {
						let buttonX = this.buttonPos[i].x;
						let buttonY = this.buttonPos[i].y;
						if (
							x - buttonX < 47 &&
							x - buttonX > 0 &&
							y - buttonY < 47 &&
							y - buttonY > 0
						) {
							this.clicked = i;
						}
					}
				}
			},

			touchEnded(p5) {
				if (this.clicked !== null) {
					this.stepInCurrentSequence++;
					if (this.clicked === this.pattern[this.stepInCurrentSequence]) {
						if (this.stepInCurrentSequence === this.step) {
							if (this.stepInCurrentSequence === 4) {
								setTimeout(this.onDone, 800);
								this.done = true;
								return;
							}
							// Done with this step
							this.buttonsActive = false;
							this.sequenceStart = performance.now();
							this.stepInCurrentSequence = -1;
							this.step++;
						}
					} else {
						// Wrong sequence
						this.stepInCurrentSequence = -1;
						this.step = 0;
						this.buttonsActive = false;
						this.sequenceStart = performance.now();
						this.wrong = true;
					}
					this.clicked = null;
				}
			}
		}
	};
</script>

<style scoped>
	.StartReactor {
		position: relative;
		height: 80vh;
		width: 146.33vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.container {
		position: relative;
	}
	.background {
		height: 80vh;
	}
	.sketch {
		position: absolute;
		top: 0;
		left: 0;
		height: 80vh;
		width: 146.33vh;
		display: flex;
		flex-direction: column;
	}
</style>
