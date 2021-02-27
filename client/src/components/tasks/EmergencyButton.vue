<template>
	<div class="EmergencyButton">
		<div class="container">
			<img
				src="img/task/emergencyButton/background.png"
				class="background"
			/>
			<VueP5
				class="sketch"
				@setup="setup"
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
		name: "EmergencyButton",
		data() {
			return {
				buttonImage: null,
				buttonPressedImage: null,
				openImage: null,
				closeImage: null,
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
				this.buttonImage = p5.loadImage(
					"img/task/emergencyButton/button.png"
				);
				this.buttonPressedImage = p5.loadImage(
					"img/task/emergencyButton/buttonPressed.png"
				);
				this.baseImage = p5.loadImage(
					"img/task/emergencyButton/base.png"
				);
				this.openImage = p5.loadImage(
					"img/task/emergencyButton/open.png"
				);
				this.closedImage = p5.loadImage(
					"img/task/emergencyButton/closed.png"
				);
			},
			setup(p5) {
				let c = p5.createCanvas(504, 506);
				c.elt.style.width = "100vh";
				c.elt.style.height = "100vh";
				p5.angleMode(p5.DEGREES);

				p5.image(this.buttonImage, 178, 124);
				p5.image(this.baseImage, 85, 246);
				p5.image(this.openImage, 324, 35);
			},
			touchStarted(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				let midX = p5.width / 2;
				let midY = p5.height / 2;
				if (
					Math.abs(midX - x) < 89 &&
					Math.abs(midY - y) < 74 &&
					!this.done
				) {
					this.clicked = true;
					p5.clear();
					p5.image(this.buttonPressedImage, 178, 144);
					p5.image(this.baseImage, 85, 246);
					p5.image(this.openImage, 324, 35);
				}
			},
			touchEnded(p5) {
				if (this.clicked) {
					p5.clear();
					p5.image(this.buttonPressedImage, 178, 144);
					p5.image(this.baseImage, 85, 246);
					p5.image(this.closedImage, 140, 130);
					this.done = true;
					setTimeout(this.onDone, 1000);
					// this.onDone();
				}
				this.clicked = false;
			}
		}
	};
</script>

<style scoped>
	.EmergencyButton {
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
