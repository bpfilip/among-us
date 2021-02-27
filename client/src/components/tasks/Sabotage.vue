<template>
	<div class="Sabotage">
		<div class="container">
			<img src="img/task/sabotage/background.png" class="background" />
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
		name: "Sabotage",
		data() {
			return {
				done: false,
				p5: null,
				clicked: false,
				pickedUp: false,
				angle: Math.random() * 240,
				startX: 0,
				done: false,
				x: 0,
				randomIndex: 0,
				isPressed: false,
				offset: Math.random() * 240,
				correct: false,
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
				this.redImage = p5.loadImage("img/task/sabotage/red.png");
				this.greenImage = p5.loadImage("img/task/sabotage/green.png");
				this.redOffImage = p5.loadImage("img/task/sabotage/redOff.png");
				this.greenOffImage = p5.loadImage("img/task/sabotage/greenOff.png");
				this.dialImage = p5.loadImage("img/task/sabotage/dial.png");
				this.glassImage = p5.loadImage("img/task/sabotage/glass.png");
			},
			setup(p5) {
				let c = p5.createCanvas(577, 486);
				c.elt.style.width = "106.85vh";
				c.elt.style.height = "90vh";
				p5.imageMode(p5.CORNER);
				p5.angleMode(p5.DEGREES);
				this.random = [];
				for (let i = 0; i < 1000; i++) {
					this.random[i] = Math.random();
				}
			},
			draw(p5) {
				p5.clear();

				p5.push();
				p5.translate(445, 395);
				p5.rotate(this.angle - 120);
				p5.image(this.dialImage, -60, -80);
				p5.pop();

				p5.noFill();
				p5.stroke(255, 247, 0);
				p5.beginShape();
				let r = 1 + Math.random() / 50;
				for (let i = 0; i < 197; i++)
					p5.curveVertex(
						i + 108,
						Math.sin(i / 20 + this.x) * 40 +
							(Math.random() - 0.5) * 10 * (10 / 20 + 0.5) +
							230
					);
				p5.endShape();
				p5.beginShape();
				r = 1 + Math.random() / 50;
				for (let i = 0; i < 197; i++)
					p5.curveVertex(
						i + 345,
						Math.sin(i / 20 + this.x) * 40 +
							(Math.random() - 0.5) *
								10 *
								(Math.abs((this.angle - this.offset) / 30) + 0.3) +
							230
					);
				p5.endShape();

				p5.image(this.glassImage, 108, 173);
				p5.image(this.glassImage, 347, 173);

				p5.image(this.correct ? this.redOffImage : this.redImage, 487, 300);
				p5.image(this.done ? this.greenImage : this.greenOffImage, 522, 300);

				this.x += 0.1;

				if (this.isPressed) {
					this.angle =
						(Math.atan2(390 - p5.mouseY, 443 - p5.mouseX) * 180) / Math.PI + 90;
					if (this.angle < 60 && this.angle > 0) {
						this.angle = 60;
					}
					if (this.angle < -60 && this.angle > -90) {
						this.angle = 360 + this.angle;
					}
					if (this.angle > -60 && this.angle < 0) {
						this.angle = 300;
					}
					this.angle -= 60;
					this.correct = Math.abs(this.angle - this.offset) < 3;
					console.log(this.correct);
				}
			},
			touchStarted(p5) {
				if (this.done) return;
				let x = p5.mouseX;
				let y = p5.mouseY;
				let dialX = 443;
				let dialY = 390;
				if (Math.abs(x - dialX) < 80 && Math.abs(y - dialY) < 80) {
					this.isPressed = true;
				}
			},

			touchEnded(p5) {
				if (this.done) return;
				if (this.isPressed && this.correct && !this.done) {
					this.done = true;
					setTimeout(this.onDone, 500);
				}
				this.isPressed = false;
			}
		}
	};
</script>

<style scoped>
	.Sabotage {
		position: relative;
		height: 90vh;
		width: 106.85vh;
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
		width: 106.85vh;
		display: flex;
		flex-direction: column;
	}
</style>
