<template>
	<div class="DownloadData">
		<div class="container">
			<img src="img/task/downloadData/background.png" class="background" />
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
		name: "DownloadData",
		data() {
			return {
				done: false,
				p5: null,
				font: "Arial",
				overlayImage: [],
				walk: [],
				startedAt: null,
				started: false,
				folderPosition: [
					[
						{ x: 55, y: 99 },
						{ x: 53, y: 99 },
						{ x: 52, y: 102 },
						{ x: 47, y: 107 }
					],
					[
						{ x: 333, y: 99 },
						{ x: 331, y: 99 },
						{ x: 330, y: 102 },
						{ x: 325, y: 107 }
					]
				],
				progress: 50
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
			this.p5.remove();
		},
		methods: {
			preLoad(p5) {
				this.p5 = p5;
				this.glassImage = p5.loadImage("img/task/downloadData/glassTop.png");
				this.overlayImage[0] = p5.loadImage(
					"img/task/downloadData/dataTransfer_folderOpen0002.png"
				);
				this.overlayImage[1] = p5.loadImage(
					"img/task/downloadData/dataTransfer_folderOpen0003.png"
				);
				this.overlayImage[2] = p5.loadImage(
					"img/task/downloadData/dataTransfer_folderOpen0004.png"
				);
				this.overlayImage[3] = p5.loadImage(
					"img/task/downloadData/dataTransfer_folderOpen0005.png"
				);
				this.downloadImage = p5.loadImage("img/task/downloadData/downloadButton.png");
				this.barImage = p5.loadImage("img/task/downloadData/bar.png");
				this.barFilledImage = p5.loadImage("img/task/downloadData/barFilled.png");
				this.test = p5.loadImage("img/task/downloadData/test.png");
				this.smallFileImage = p5.loadImage("img/task/downloadData/smallFile.png");
				this.font = p5.loadFont("varela.regular.ttf");
				for (let i = 1; i <= 4; i++) {
					this.walk[i - 1] = p5.loadImage(
						`img/task/downloadData/walk/running crewmate ${i} small.png`
					);
				}
			},
			setup(p5) {
				let c = p5.createCanvas(500, 326);
				c.elt.style.width = "60vw";
				c.elt.style.height = "39.12vw";
				p5.angleMode(p5.DEGREES);
				p5.imageMode(p5.CORNER);
				this.mask = p5.createImage(100, 1);
			},
			draw(p5) {
				p5.clear();

				//TODO: Add text under folders

				if (!this.started) {
					p5.image(this.downloadImage, 206, 193);
					p5.image(
						this.overlayImage[0],
						this.folderPosition[0][0].x,
						this.folderPosition[0][0].y
					);
					p5.image(
						this.overlayImage[0],
						this.folderPosition[1][0].x,
						this.folderPosition[1][0].y
					);
				} else {
					const now = performance.now();
					this.progress = (now - this.startedAt) / 80;
					if (this.progress >= 100) {
						this.progress = 100;
						if (!this.done) setTimeout(this.onDone, 500);
						this.done = true;
					}
					{
						const sinceStarted = now - this.startedAt;
						if (sinceStarted < 8000) {
							const position = (sinceStarted % 4000) / 4000;
							p5.image(
								this.walk[Math.floor(p5.frameCount / 4) % 4],
								115 + position * 280,
								103
							);
							p5.image(this.smallFileImage, 138 + position * 280, 128);
						}

						if (sinceStarted < 200) {
							p5.image(
								this.overlayImage[0],
								this.folderPosition[0][0].x,
								this.folderPosition[0][0].y
							);
						}
						if (sinceStarted < 250 && sinceStarted > 200) {
							p5.image(
								this.overlayImage[1],
								this.folderPosition[0][1].x,
								this.folderPosition[0][1].y
							);
						}
						if (sinceStarted < 300 && sinceStarted > 250) {
							p5.image(
								this.overlayImage[2],
								this.folderPosition[0][2].x,
								this.folderPosition[0][2].y
							);
						}
						if (sinceStarted > 300 && sinceStarted < 2000) {
							p5.image(
								this.overlayImage[3],
								this.folderPosition[0][3].x,
								this.folderPosition[0][3].y
							);
						}
						// #############################################################
						if (sinceStarted < 2000) {
							p5.image(
								this.overlayImage[0],
								this.folderPosition[1][0].x,
								this.folderPosition[1][0].y
							);
						}
						if (sinceStarted < 2050 && sinceStarted >= 2000) {
							p5.image(
								this.overlayImage[1],
								this.folderPosition[1][1].x,
								this.folderPosition[1][1].y
							);
							p5.image(
								this.overlayImage[2],
								this.folderPosition[0][2].x,
								this.folderPosition[0][2].y
							);
						}
						if (sinceStarted < 2100 && sinceStarted >= 2050) {
							p5.image(
								this.overlayImage[2],
								this.folderPosition[1][2].x,
								this.folderPosition[1][2].y
							);
							p5.image(
								this.overlayImage[1],
								this.folderPosition[0][1].x,
								this.folderPosition[0][1].y
							);
						}
						if (sinceStarted < 4000 && sinceStarted >= 2100) {
							p5.image(
								this.overlayImage[3],
								this.folderPosition[1][3].x,
								this.folderPosition[1][3].y
							);
							p5.image(
								this.overlayImage[0],
								this.folderPosition[0][0].x,
								this.folderPosition[0][0].y
							);
						}
						// #############################################################
						if (sinceStarted < 4050 && sinceStarted >= 4000) {
							p5.image(
								this.overlayImage[1],
								this.folderPosition[0][1].x,
								this.folderPosition[0][1].y
							);
							p5.image(
								this.overlayImage[2],
								this.folderPosition[1][2].x,
								this.folderPosition[1][2].y
							);
						}
						if (sinceStarted < 4100 && sinceStarted >= 4050) {
							p5.image(
								this.overlayImage[2],
								this.folderPosition[0][2].x,
								this.folderPosition[0][2].y
							);
							p5.image(
								this.overlayImage[1],
								this.folderPosition[1][1].x,
								this.folderPosition[1][1].y
							);
						}
						if (sinceStarted < 6000 && sinceStarted >= 4100) {
							p5.image(
								this.overlayImage[3],
								this.folderPosition[0][3].x,
								this.folderPosition[0][3].y
							);
							p5.image(
								this.overlayImage[0],
								this.folderPosition[1][0].x,
								this.folderPosition[1][0].y
							);
						}
						// #############################################################
						if (sinceStarted < 6050 && sinceStarted >= 6000) {
							p5.image(
								this.overlayImage[1],
								this.folderPosition[1][1].x,
								this.folderPosition[1][1].y
							);
							p5.image(
								this.overlayImage[2],
								this.folderPosition[0][2].x,
								this.folderPosition[0][2].y
							);
						}
						if (sinceStarted < 6100 && sinceStarted >= 6050) {
							p5.image(
								this.overlayImage[2],
								this.folderPosition[1][2].x,
								this.folderPosition[1][2].y
							);
							p5.image(
								this.overlayImage[1],
								this.folderPosition[0][1].x,
								this.folderPosition[0][1].y
							);
						}
						if (sinceStarted >= 6100) {
							p5.image(
								this.overlayImage[3],
								this.folderPosition[1][3].x,
								this.folderPosition[1][3].y
							);
							p5.image(
								this.overlayImage[0],
								this.folderPosition[0][0].x,
								this.folderPosition[0][0].y
							);
						}
					}

					this.mask.loadPixels();
					for (let i = 0; i < this.progress; i++) {
						this.mask.set(i, 0, p5.color(0, 0, 0));
					}
					this.mask.updatePixels();
					let barFilledImage = this.barFilledImage.get();
					barFilledImage.mask(this.mask);
					p5.image(this.barImage, 70, 200);
					p5.image(barFilledImage, 70, 200);
					p5.fill(255);
					p5.strokeWeight(3);
					p5.stroke(0);
					p5.textFont(this.font);
					p5.textSize(22);
					p5.text(Math.round(this.progress) + "%", 390, 218);
				}

				p5.image(this.glassImage, 30, 26);
			},
			touchStarted(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				let buttonX = 206;
				let buttonY = 193;
				if (
					x - buttonX < 91 &&
					x - buttonX > 0 &&
					y - buttonY < 28 &&
					y - buttonY > 0 &&
					!this.started
				) {
					this.started = true;
					this.startedAt = performance.now();
				}
			},
			touchEnded(p5) {}
		}
	};
</script>

<style scoped>
	.DownloadData {
		position: relative;
		height: 39.12vw;
		width: 60vw;
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
		height: 39.12vw;
		width: 60vw;
		display: flex;
		flex-direction: column;
	}
</style>
