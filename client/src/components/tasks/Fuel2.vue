<template>
	<div class="Fuel2">
		<div class="container">
			<img src="img/task/fuel2/background.png" class="background" />
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
		name: "Fuel2",
		data() {
			return {
				done: false,
				p5: null,
				clicked: null,
				done: false,
				filled: 0
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
				this.backgroundImage = p5.loadImage("img/task/fuel2/background.png");
				this.wireImage = p5.loadImage("img/task/fuel2/wire.png");
				this.buttonBaseImage = p5.loadImage("img/task/fuel2/buttonBase.png");
				this.buttonImage = p5.loadImage("img/task/fuel2/button.png");

				this.redOffImage = p5.loadImage("img/task/fuel2/redOff.png");
				this.redOnImage = p5.loadImage("img/task/fuel2/redOn.png");
				this.greenOffImage = p5.loadImage("img/task/fuel2/greenOff.png");
				this.greenOnImage = p5.loadImage("img/task/fuel2/greenOn.png");
			},
			setup(p5) {
				let c = p5.createCanvas(508, 500);
				c.elt.style.width = "81.28vh";
				c.elt.style.height = "80vh";
				p5.imageMode(p5.CORNER);
				p5.angleMode(p5.DEGREES);
			},
			draw(p5) {
				p5.clear();

				p5.push();
				p5.translate(257, 53);
				p5.rotate(-57);
				p5.fill(0);
				p5.rect(0, 0, -53, -61);
				p5.fill(195, 167, 20);
				p5.rect(0, 0, -53, (1 - this.filled) * -61);
				p5.pop();

				p5.fill(0);
				p5.rect(120, 93, 82, 317);

				if (this.clicked) this.filled += 0.002;

				p5.fill(195, 167, 20);
				p5.rect(120, 93 + (1 - this.filled) * 317, 82, this.filled * 317);

				if (this.filled >= 1 && !this.done) {
					this.done = true;
					setTimeout(this.onDone, 1000);
				}

				p5.image(!this.done ? this.redOnImage : this.redOffImage, 400, 355);
				p5.image(this.done ? this.greenOnImage : this.greenOffImage, 470, 355);

				p5.image(this.wireImage, 335, 441);
				p5.image(this.backgroundImage, 0, 0);
				p5.image(this.buttonBaseImage, 385, 377);

				p5.image(this.buttonImage, 410, 400);
			},
			touchStarted(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				let buttonX = 410;
				let buttonY = 400;
				if (x - buttonX < 76 && x - buttonX > 0 && y - buttonY < 77 && y - buttonY > 0) {
					this.clicked = true;
				}
			},

			touchEnded(p5) {
				if (this.clicked) {
					this.clicked = false;
				}
			}
		}
	};
</script>

<style scoped>
	.Fuel2 {
		position: relative;
		height: 80vh;
		width: 81.28vh;
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
		width: 81.28vh;
		display: flex;
		flex-direction: column;
	}
</style>
