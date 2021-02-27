<template>
	<div class="O2">
		<div class="container">
			<img src="img/task/o2/background.png" class="background" />
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
		name: "O2",
		data() {
			return {
				clicked: false,
				done: false,
				p5: null,
				leafPos: [
					{ x: 222, y: 130 },
					{ x: 442, y: 133 },
					{ x: 310, y: 270 },
					{ x: 245, y: 358 },
					{ x: 300, y: 420 },
					{ x: 434, y: 288 },
					{ x: 312, y: 96 }
				],
				leafsRemoved: [false, false, false, false, false, false, false],
				leafsRemovedCount: 0,
				dragging: null
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
				this.topImage = p5.loadImage("img/task/o2/top.png");
				this.leftArrowImage = p5.loadImage("img/task/o2/leftArrow.png");
				this.rightArrowImage = p5.loadImage("img/task/o2/rightArrow.png");
				this.leafImages = [
					p5.loadImage("img/task/o2/o2_leaf1.png"),
					p5.loadImage("img/task/o2/o2_leaf2.png"),
					p5.loadImage("img/task/o2/o2_leaf3.png"),
					p5.loadImage("img/task/o2/o2_leaf4.png"),
					p5.loadImage("img/task/o2/o2_leaf5.png"),
					p5.loadImage("img/task/o2/o2_leaf6.png"),
					p5.loadImage("img/task/o2/o2_leaf7.png")
				];
			},
			setup(p5) {
				let c = p5.createCanvas(500, 500);
				c.elt.style.width = "80vh";
				c.elt.style.height = "80vh";
				p5.imageMode(p5.CORNER);
				p5.angleMode(p5.DEGREES);
			},
			draw(p5) {
				p5.clear();
				
				p5.imageMode(p5.CORNER);
				if (!this.done && Math.floor(p5.frameCount / 15) % 2 == 0) {
					p5.image(this.leftArrowImage, 77, 236);
				}

				p5.imageMode(p5.CENTER);
				for (let i = 0; i < 7; i++) {
					if (!this.leafsRemoved[i])
						p5.image(this.leafImages[i], this.leafPos[i].x, this.leafPos[i].y);
				}

				p5.imageMode(p5.CORNER);
				p5.image(this.topImage, 0, 0);
				if (!this.done && Math.floor(p5.frameCount / 15) % 2 == 0) {
					p5.image(this.rightArrowImage, 11, 223);
				}

				if (this.dragging !== null) {
					this.leafPos[this.dragging].x = p5.mouseX;
					this.leafPos[this.dragging].y = p5.mouseY;
				}
			},
			touchStarted(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				for (let i = 0; i < 7; i++) {
					let leafX = this.leafPos[i].x;
					let leafY = this.leafPos[i].y;
					if (
						Math.abs(x - leafX) < 30 &&
						Math.abs(y - leafY) < 30 &&
						!this.leafsRemoved[i]
					) {
						this.dragging = i;
					}
				}
			},

			touchEnded(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				let dropoffX = 0;
				let dropoffY = 147;
				if (
					x - dropoffX < 77 &&
					x - dropoffX > 0 &&
					y - dropoffY < 218 &&
					y - dropoffY > 0
				) {
					this.leafsRemoved[this.dragging] = true;
					this.leafsRemovedCount++;
					if (this.leafsRemovedCount === 7) {
						this.done = true;
						setTimeout(this.onDone, 500);
					}
				}
				this.dragging = null;
			}
		}
	};
</script>

<style scoped>
	.O2 {
		position: relative;
		height: 80vh;
		width: 80vh;
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
		width: 80vh;
		display: flex;
		flex-direction: column;
	}
</style>
