<template>
	<div class="DivertPower2">
		<div class="container">
			<img
				src="img/task/divertPower2/background.png"
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
		name: "DivertPower2",
		data() {
			return {
				sliderImage: null,
				rotated: 0,
				clicked: false,
				done: false,
				p5: null
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
					"img/task/divertPower2/slider.png"
				);
			},
			setup(p5) {
				let c = p5.createCanvas(424, 250);
				c.elt.style.width = "60vw";
				c.elt.style.height = "35.377vw";
				p5.imageMode(p5.CENTER);
				p5.angleMode(p5.DEGREES);
			},
			draw(p5) {
				p5.clear();

				p5.noStroke();
				p5.fill(242, 245, 66, 64 + (p5.frameCount % 10) * 50);

				// Left Side
				p5.rect(71, 45, 76, 3);
				p5.rect(144, 48, 2, 41);
				p5.rect(71, 66, 73, 3);
				p5.rect(95, 69, 3, 19);
				p5.rect(71, 86, 24, 2);
				p5.rect(147, 86, 23, 2);
				p5.rect(1268, 88, 2, 37);
				p5.rect(170, 94, 10, 2);
				p5.rect(178, 57, 2, 37);
				p5.rect(116, 104, 51, 2);
				p5.rect(87, 125, 100, 2);
				p5.rect(157, 127, 2, 58);
				p5.rect(159, 159, 11, 3);
				p5.rect(168, 162, 2, 15);
				p5.rect(130, 183, 27, 2);
				p5.rect(128, 156, 2, 51);
				p5.rect(73, 155, 57, 3);
				p5.rect(72, 205, 55, 2);
				p5.rect(99, 193, 1, 12);
				p5.rect(73, 191, 27, 2);
				p5.rect(168, 86, 2, 39);

				// Right side
				if (this.done) {
					p5.rect(238, 125, 101, 2);
					p5.rect(272, 111, 2, 14);
					p5.rect(274, 111, 43, 2);
					p5.rect(256, 97, 2, 28);
					p5.rect(258, 97, 59, 3);
					p5.rect(315, 83, 2, 14);
					p5.rect(317, 83, 36, 2);
					p5.rect(272, 44, 2, 53);
					p5.rect(274, 69, 79, 2);
					p5.rect(281, 56, 2, 13);
					p5.rect(283, 56, 34, 2);
					p5.rect(264, 127, 2, 40);
					p5.rect(252, 167, 41, 3);
					p5.rect(252, 170, 2, 36);
					p5.rect(254, 204, 56, 2);
					p5.rect(293, 146, 2, 41);
					p5.rect(295, 146, 23, 2);
					p5.rect(295, 185, 58, 2);
					p5.rect(306, 167, 2, 18);
					p5.rect(308, 167, 45, 3);
				}

				p5.push();
				p5.translate(p5.width / 2, p5.height / 2);
				p5.rotate(this.rotated*-1);
				p5.image(this.sliderImage, 0, 0);
				p5.pop();

				if (this.clicked && !this.done&&this.rotated < 90) {
					this.rotated += 2;
				}
				if (this.rotated >= 90 && !this.done && this.clicked) {
					this.rotated = 90;
					// this.onDone();
					this.done = true;
					setTimeout(this.onDone, 1000);
				}
				if (!this.clicked && !this.done && this.rotated > 0) {
					this.rotated -= 2;
				}
			},
			touchStarted(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				let midX = p5.width / 2;
				let midY = p5.height / 2;
				if (Math.abs(midX - x) < 16 && Math.abs(midY - y) < 58) {
					this.clicked = !this.clicked;
				}
			},

			touchEnded(p5) {}
		}
	};
</script>

<style scoped>
	.DivertPower2 {
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
		width: 60vw;
	}
	.sketch {
		position: absolute;
		top: 0;
		left: 0;
		height: 35.377vw;
		width: 60vw;
		display: flex;
		flex-direction: column;
	}
</style>
