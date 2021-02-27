<template>
	<div class="DivertPower1">
		<div class="container">
			<img
				src="img/task/divertPower1/background.png"
				class="background"
			/>
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
		name: "DivertPower1",
		data() {
			return {
				sliderImage: null,
				sliderShadowImage: null,
				rotated: 0,
				clicked: false,
				done: false,
				p5: null,
				sliderPoints: [61.5, 115, 169, 223, 276.5, 330.5, 384.5, 438.5],
				activeSlider: Math.floor(Math.random() * 8),
				sliderPosition: 0
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
				this.sliderImage = p5.loadImage(
					"img/task/divertPower1/slider.png"
				);
				this.sliderShadowImage = p5.loadImage(
					"img/task/divertPower1/sliderShadow.png"
				);
			},
			setup(p5) {
				let c = p5.createCanvas(500, 500);
				c.elt.style.width = "100vh";
				c.elt.style.height = "100vh";
				p5.imageMode(p5.CENTER);
				p5.angleMode(p5.DEGREES);
			},
			draw(p5) {
				p5.clear();

				p5.noStroke();
				p5.fill(242, 245, 66, 64 + (p5.frameCount % 10) * 50);

				// Wires
				p5.rect(60, 124, 2, 32);
				p5.rect(62, 124, 27, 2);
				p5.rect(114, 138, 2, 18);
				p5.rect(91, 138, 23, 2);
				p5.rect(89, 104, 2, 36);
				p5.rect(169, 130, 2, 26);
				p5.rect(147, 130, 22, 2);
				p5.rect(147, 118, 2, 12);
				p5.rect(111, 118, 36, 2);
				p5.rect(111, 106, 2, 12);
				p5.rect(89, 104, 101, 2);
				p5.rect(188, 92, 2, 12);
				p5.rect(222, 114, 2, 42);
				p5.rect(276, 132, 2, 24);
				p5.rect(230, 132, 46, 2);
				p5.rect(230, 116, 2, 16);
				p5.rect(224, 114, 17, 2);
				p5.rect(239, 92, 2, 22);
				p5.rect(188, 90, 64, 2);
				p5.rect(250, 79, 2, 11);
				p5.rect(252, 85, 61, 2);
				p5.rect(311, 87, 2, 17);
				p5.rect(313, 102, 18, 2);
				p5.rect(329, 104, 2, 52);
				p5.rect(313, 93, 92, 2);
				p5.rect(403, 95, 2, 45);
				p5.rect(383, 112, 20, 2);
				p5.rect(383, 114, 2, 42);
				p5.rect(405, 138, 33, 2);
				p5.rect(436, 140, 2, 16);

				if (this.clicked) {
					this.sliderPosition = (p5.mouseY - 455) * -1;
					if (this.sliderPosition > 65) this.sliderPosition = 65;
					if (this.sliderPosition < 0) this.sliderPosition = 0;
				}

				// Sliders (L->R)
				for (let i = 0; i < 8; i++) {
					if (i === this.activeSlider) {
						p5.image(
							this.sliderImage,
							this.sliderPoints[i],
							455 - this.sliderPosition
						);
					} else {
						p5.image(this.sliderImage, this.sliderPoints[i], 390);
						p5.image(
							this.sliderShadowImage,
							this.sliderPoints[i],
							390
						);
					}
				}

				// Meters
				
				for (let i = 0; i < 8; i++) {
					if (i === this.activeSlider) {
						p5.fill(0);
						p5.rect(this.sliderPoints[i]-10, 175, 20, 80);
						p5.fill(242, 245, 66);
						p5.rect(this.sliderPoints[i]-10, 255-this.sliderPosition/65*40, 20, this.sliderPosition/65*40);
					} else {
						p5.fill(0);
						p5.rect(this.sliderPoints[i]-10, 175, 20, 80);
						p5.fill(242, 245, 66);
						p5.rect(this.sliderPoints[i]-10, 215, 20, 40);
					}
				}
			},
			touchStarted(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				let sliderX = this.sliderPoints[this.activeSlider];
				let sliderY = 455 - this.sliderPosition;
				if (Math.abs(sliderX - x) < 46 && Math.abs(sliderY - y) < 36) {
					this.clicked = true;
				}
			},

			touchEnded(p5) {
				if (this.clicked && this.sliderPosition >= 65) {
					this.onDone();
				}
				this.clicked = false;
			}
		}
	};
</script>

<style scoped>
	.DivertPower1 {
		position: relative;
		height: 100vh;
		width: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.container {
		position: relative;
	}
	.background {
		height: 100vh;
	}
	.sketch {
		position: absolute;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
