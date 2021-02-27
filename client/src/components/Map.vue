<template>
	<div class="Map">
		<img class="close" src="img/button/closeButton.png" alt="" v-on:click="closeMap" />
		<div class="map">
			<img src="img/map.png" />
			<div class="tasks" v-for="task in tasks" :key="task.location">
				<img
					src="img/task.png"
					v-show="task.active"
					v-bind:style="{
						top: position[task.location].y + 'px',
						left: position[task.location].x + 'px'
					}"
				/>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Map",
		data() {
			return {
				positions: {
					2: {
						// Midten af oasen
						x: 760,
						y: 390
					}
				}
			};
		},
		computed: {
			position() {
				// const originalPositions = {
				// 	2: {
				// 		// Midten af oasen
				// 		x: 760,
				// 		y: 390
				// 	}
				// };
				const width = screen.width * 0.9;
				const newPositions = {};
				for (const [location, pos] of Object.entries(this.positions)) {
					newPositions[location] = {
						x: (pos.x * width) / 1961 - width * 0.02,
						y: (pos.y * width) / 1961 - width * 0.02
					};
				}
				return newPositions;
			}
		},
		components: {},
		props: {
			closeMap: {
				required: true
			},
			tasks: {
				required: false
			}
		},
		methods: {}
	};
</script>

<style scoped>
	.Map {
		position: absolute;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		background-color: #444b;
		z-index: 100;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.close {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 100;
		margin: 5px;
		width: 70px;
	}
	.map {
		position: relative;
		width: 90%;
	}
	.map img {
		opacity: 90%;
		width: 100%;
	}
	.tasks {
		position: absolute;
		top: 0px;
		left: 0px;
	}
	.tasks img {
		position: absolute;
		width: 4vw;
		opacity: 100%;
	}
</style>
