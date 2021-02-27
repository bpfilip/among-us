<template>
	<div class="Electricity">
		<img src="img/task/electricity/background.png" class="background" />
		<VueP5
			class="sketch"
			@setup="setup"
			@draw="draw"
			@touchstarted="touchStarted"
			@touchended="touchEnded"
			:additionalEvents="['touchStarted', 'touchEnded']"
		/>
	</div>
</template>

<script>
	import VueP5 from "vue-p5";
	export default {
		name: "Electricity",
		data() {
			return {
				wiresDone: [false, false, false, false],
				rightOrder: [3, 0, 2, 1],
				color: [
					[255, 45, 0],
					[255, 232, 29],
					[0, 50, 255],
					[249, 68, 252]
				],
				borderColor: [
					[171, 27, 0],
					[167, 150, 15],
					[0, 30, 170],
					[179, 46, 179]
				],
				clickStart: null,
				wirePoints: [104, 208, 311, 414]
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
		methods: {
			setup(p5) {
				let c = p5.createCanvas(504, 504);
				c.elt.style.width = "100vh";
				c.elt.style.height = "100vh";
			},
			draw(p5) {
				p5.clear();

				// Wire done signal left
				p5.noStroke();
				p5.fill(51, 51, 51);
				if (this.wiresDone[0]) p5.fill(253, 224, 0);
				p5.rect(4, 80, 31, 12);
				p5.fill(51, 51, 51);
				if (this.wiresDone[1]) p5.fill(253, 224, 0);
				p5.rect(4, 184, 31, 12);
				p5.fill(51, 51, 51);
				if (this.wiresDone[2]) p5.fill(253, 224, 0);
				p5.rect(4, 287, 31, 12);
				p5.fill(51, 51, 51);
				if (this.wiresDone[3]) p5.fill(253, 224, 0);
				p5.rect(4, 390, 31, 12);

				// Wire done signal right
				p5.noStroke();
				p5.fill(51, 51, 51);
				if (this.wiresDone[this.rightOrder.indexOf(0)]) p5.fill(253, 224, 0);
				p5.rect(470, 80, 31, 17);
				p5.fill(51, 51, 51);
				if (this.wiresDone[this.rightOrder.indexOf(1)]) p5.fill(253, 224, 0);
				p5.rect(470, 184, 31, 17);
				p5.fill(51, 51, 51);
				if (this.wiresDone[this.rightOrder.indexOf(2)]) p5.fill(253, 224, 0);
				p5.rect(470, 287, 31, 17);
				p5.fill(51, 51, 51);
				if (this.wiresDone[this.rightOrder.indexOf(3)]) p5.fill(253, 224, 0);
				p5.rect(470, 390, 31, 17);

				// Lines done
				for (let i = 0; i < 4; i++) {
					if (this.wiresDone[i]) {
						p5.fill(...this.color[i]);
						p5.stroke(...this.borderColor[i]);

						p5.push();
						p5.translate(35, this.wirePoints[i]);
						p5.rotate(
							Math.atan2(
								this.wirePoints[this.rightOrder[i]] -
									this.wirePoints[i],
								470 - 35
							)
						);
						p5.rect(
							0,
							-8.5,
							Math.hypot(
								470 - 35,
								this.wirePoints[this.rightOrder[i]] -
									this.wirePoints[i]
							),
							17
						);
						p5.pop();
					}
				}

				//Lines
				if (this.clickStart !== null) {
					p5.fill(...this.color[this.clickStart]);
					p5.stroke(...this.borderColor[this.clickStart]);

					p5.push();
					p5.translate(35, this.wirePoints[this.clickStart]);
					p5.rotate(
						Math.atan2(
							p5.mouseY - this.wirePoints[this.clickStart],
							p5.mouseX - 35
						)
					);
					p5.rect(
						0,
						-8.5,
						Math.hypot(
							p5.mouseX - 35,
							p5.mouseY - this.wirePoints[this.clickStart]
						),
						17
					);
					p5.pop();
				}

				// Left ends
				p5.strokeWeight(2);
				p5.stroke(...this.borderColor[0]);
				p5.fill(...this.color[0]);
				p5.rect(4, 95, 34, 17);
				p5.noStroke();
				if (this.clickStart === 0 || this.wiresDone[0]) p5.rect(32, 96, 7, 15);

				p5.stroke(...this.borderColor[1]);
				p5.fill(...this.color[1]);
				p5.rect(4, 199, 34, 17);
				p5.noStroke();
				if (this.clickStart === 1 || this.wiresDone[1]) p5.rect(32, 200, 7, 15);

				p5.stroke(...this.borderColor[2]);
				p5.fill(...this.color[2]);
				p5.rect(4, 302, 34, 17);
				p5.noStroke();
				if (this.clickStart === 2 || this.wiresDone[2]) p5.rect(32, 303, 7, 15);

				p5.stroke(...this.borderColor[3]);
				p5.fill(...this.color[3]);
				p5.rect(4, 405, 34, 17);
				p5.noStroke();
				if (this.clickStart === 3 || this.wiresDone[3]) p5.rect(32, 406, 7, 15);

				// right ends
				p5.strokeWeight(2);
				p5.stroke(...this.borderColor[this.rightOrder.indexOf(0)]);
				p5.fill(...this.color[this.rightOrder.indexOf(0)]);
				p5.rect(470, 95, 31, 17);
				p5.noStroke();
				if (this.wiresDone[this.rightOrder.indexOf(0)]) p5.rect(469, 96, 70, 15);

				p5.stroke(...this.borderColor[this.rightOrder.indexOf(1)]);
				p5.fill(...this.color[this.rightOrder.indexOf(1)]);
				p5.rect(470, 199, 31, 17);
				p5.noStroke();
				if (this.wiresDone[this.rightOrder.indexOf(1)]) p5.rect(469, 200, 7, 15);

				p5.stroke(...this.borderColor[this.rightOrder.indexOf(2)]);
				p5.fill(...this.color[this.rightOrder.indexOf(2)]);
				p5.rect(470, 302, 31, 17);
				p5.noStroke();
				if (this.wiresDone[this.rightOrder.indexOf(2)]) p5.rect(469, 303, 7, 15);

				p5.stroke(...this.borderColor[this.rightOrder.indexOf(3)]);
				p5.fill(...this.color[this.rightOrder.indexOf(3)]);
				p5.rect(470, 405, 31, 17);
				p5.noStroke();
				if (this.wiresDone[this.rightOrder.indexOf(3)]) p5.rect(469, 406, 7, 15);
			},
			touchStarted(p5) {
				if (p5.mouseX < 50) {
					let best = Infinity;
					let bestCandidate = null;
					for (let i = 0; i < 4; i++) {
						if (Math.abs(p5.mouseY - this.wirePoints[i]) < best) {
							best = Math.abs(p5.mouseY - this.wirePoints[i]);
							bestCandidate = i;
						}
					}
					if (!this.wiresDone[bestCandidate])
						this.clickStart = bestCandidate;
					else this.clickStart = null;
				} else {
					this.clickStart = null;
				}
			},

			touchEnded(p5) {
				if (p5.mouseX > 454) {
					let best = Infinity;
					let bestCandidate = null;
					for (let i = 0; i < 4; i++) {
						if (Math.abs(p5.mouseY - this.wirePoints[i]) < best) {
							best = Math.abs(p5.mouseY - this.wirePoints[i]);
							bestCandidate = i;
						}
					}
					if (
						!this.wiresDone[this.clickStart] &&
						bestCandidate === this.rightOrder[this.clickStart]
					)
						this.wiresDone[this.clickStart] = true;
				}
				this.clickStart = null;
				if (this.wiresDone.reduce((a, c) => a + (c?1:0), 0) === 4) {
					this.onDone();
				}
			}
		}
	};
</script>

<style scoped>
	.Electricity {
		position: relative;
		height: 100vh;
		width: 100vh;
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
