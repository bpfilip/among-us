<template>
	<div class="UnlockManifold">
		<div class="container">
			<img src="img/task/unlockManifold/background.png" class="background" />
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
		name: "UnlockManifold",
		data() {
			return {
				clicked: false,
				done: false,
				p5: null,
				buttonPos: [
					{ x: 37, y: 39 },
					{ x: 122, y: 39 },
					{ x: 207, y: 39 },
					{ x: 292, y: 39 },
					{ x: 377, y: 39 },
					{ x: 37, y: 126 },
					{ x: 122, y: 126 },
					{ x: 207, y: 126 },
					{ x: 292, y: 126 },
					{ x: 377, y: 126 }
				],
				buttonsPressed: 0
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
				this.glassImage = p5.loadImage("img/task/unlockManifold/glass.png");
				this.buttonImages = [
					p5.loadImage("img/task/unlockManifold/reactorButton01.png"),
					p5.loadImage("img/task/unlockManifold/reactorButton02.png"),
					p5.loadImage("img/task/unlockManifold/reactorButton03.png"),
					p5.loadImage("img/task/unlockManifold/reactorButton04.png"),
					p5.loadImage("img/task/unlockManifold/reactorButton05.png"),
					p5.loadImage("img/task/unlockManifold/reactorButton06.png"),
					p5.loadImage("img/task/unlockManifold/reactorButton07.png"),
					p5.loadImage("img/task/unlockManifold/reactorButton08.png"),
					p5.loadImage("img/task/unlockManifold/reactorButton09.png"),
					p5.loadImage("img/task/unlockManifold/reactorButton10.png")
				];
				this.buttonPressedImages = [
					p5.loadImage("img/task/unlockManifold/1.png"),
					p5.loadImage("img/task/unlockManifold/2.png"),
					p5.loadImage("img/task/unlockManifold/3.png"),
					p5.loadImage("img/task/unlockManifold/4.png"),
					p5.loadImage("img/task/unlockManifold/5.png"),
					p5.loadImage("img/task/unlockManifold/6.png"),
					p5.loadImage("img/task/unlockManifold/7.png"),
					p5.loadImage("img/task/unlockManifold/8.png"),
					p5.loadImage("img/task/unlockManifold/9.png"),
					p5.loadImage("img/task/unlockManifold/10.png")
				];
			},
			shuffle(array) {
				var currentIndex = array.length,
					temporaryValue,
					randomIndex;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {
					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}

				return array;
			},
			setup(p5) {
				let c = p5.createCanvas(500, 245);
				c.elt.style.width = "163.27vh";
				c.elt.style.height = "80vh";
				p5.imageMode(p5.CORNER);
				p5.angleMode(p5.DEGREES);
				this.shuffle(this.buttonPos);
			},
			draw(p5) {
				p5.clear();

				for (let i = 0; i < 10; i++) {
					p5.image(this.buttonsPressed > i ? this.buttonPressedImages[i] : this.buttonImages[i], this.buttonPos[i].x, this.buttonPos[i].y);
				}

				p5.image(this.glassImage, 35, 36);
			},
			touchStarted(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				for (let i = 0; i < 10; i++) {
					let buttonX = this.buttonPos[i].x;
					let buttonY = this.buttonPos[i].y;
					if (
						x - buttonX < 82 &&
						x - buttonX > 0 &&
						y - buttonY < 82 &&
						y - buttonY > 0
					) {
						if (i === this.buttonsPressed) {
							this.buttonsPressed++;
							if (this.buttonsPressed === 10) {
								setTimeout(this.onDone, 500);
							}
						}
					}
				}
			},

			touchEnded(p5) {}
		}
	};
</script>

<style scoped>
	.UnlockManifold {
		position: relative;
		height: 80vh;
		width: 163.27vh;
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
		width: 163.27vh;
		display: flex;
		flex-direction: column;
	}
</style>
