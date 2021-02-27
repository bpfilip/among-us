<template>
	<div class="Map">
		<div class="container">
			<div class="container2">
				<img src="img/map.png" class="background" />
				<VueP5
					class="sketch"
					@setup="setup"
					@draw="draw"
					@preload="preLoad"
					@touchstarted="touchStarted"
					:additionalEvents="['preLoad', 'touchStarted']"
				/>
			</div>
		</div>
	</div>
</template>

<script>
	import VueP5 from "vue-p5";
	export default {
		name: "Map",
		data() {
			return {
				p5: null,
				taskPositions: [
					{ x: 28-35, y: 738-35 }, // Salen venstre
					{ x: 412-35, y: 738-35 }, // Salen højre
					{ x: 512-35, y: 738-35 }, // Lok. 5
					{ x: 837-35, y: 273-35 }, // Oasen
					{ x: 920-35, y: 418-35 }, // Lok. 3 Ned
					{ x: 920-35, y: 272-35 }, // Lok. 3 Op
					{ x: 987-35, y: 504-35 }, // Lok. 1
					{ x: 996-35, y: 88-35 }, // Esport
					{ x: 1204-35, y: 527-35 }, // Dagli venstre
					{ x: 1407-35, y: 363-35 }, // Dagli højre
					{ x: 1490-35, y: 17-35 }, // spisesal venstre
					{ x: 1718-35, y: 769-35 }, // Loungen
					{ x: 1813-35, y: 280-35 } // spisesal højre
				]
			};
		},
		components: {
			VueP5
		},
		props: {
			toggleTask: {},
			tasks: {}
		},
		beforeDestroy() {
			this.p5.noLoop();
			this.p5.remove();
		},
		methods: {
			preLoad(p5) {
				this.p5 = p5;
				this.taskImage = p5.loadImage("img/taskMapIcon.png");
				this.taskActiveImage = p5.loadImage("img/taskMapIconActive.png");
				this.emergencyButtonImage = p5.loadImage("img/emergencyButtonMapIcon.png");
			},
			setup(p5) {
				let c = p5.createCanvas(1900>>1, 853>>1);
				c.elt.style.width = "111.37vh";
				c.elt.style.height = "50vh";
				p5.angleMode(p5.DEGREES);
				p5.imageMode(p5.CORNER);
				for (let i = 0; i < 13; i++) {
					p5.image(
						this.tasks.indexOf(i) > -1 ? this.taskImage : this.taskActiveImage,
						this.taskPositions[i].x,
						this.taskPositions[i].y
					);
				}
				p5.image(this.emergencyButtonImage, 725, 434);
			},
			draw(p5) {
				p5.clear();
				for (let i = 0; i < 13; i++) {
					p5.image(
						this.tasks.indexOf(i) > -1 ? this.taskImage : this.taskActiveImage,
						this.taskPositions[i].x >>1,
						this.taskPositions[i].y >>1
					);
				}
				p5.image(this.emergencyButtonImage, 725>>1, 434>>1);
			},
			touchStarted(p5) {
				let x = p5.mouseX;
				let y = p5.mouseY;
				for (let i = 0; i < this.taskPositions.length; i++) {
					let taskX = this.taskPositions[i].x>>1;
					let taskY = this.taskPositions[i].y>>1;
					if (x - taskX < 70 && x - taskX > 0 && y - taskY < 70 && y - taskY > 0) {
						this.toggleTask(i);
						return;
					}
				}
			}
		}
	};
</script>

<style scoped>
	.Map {
		display: flex;
		justify-content: center;
	}
	.container {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
	.container2 {
		position: relative;
	}
	.background {
		height: 50vh;
	}
	.sketch {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
