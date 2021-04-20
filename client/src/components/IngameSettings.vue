<template>
	<div class="Settings">
		<div class="container">
			<div class="container2">
				<div class="button leave" v-on:click="leave()">Leave Game</div>
				<div class="button return" v-on:click="back()">Return To Game</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			leave() {
				location.reload();
			},
			back() {
				this.$parent.showSettings = false;
			}
		}
	};
</script>

<style scoped>
	.Settings {
		position: absolute;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		background-color: #444b;
		z-index: 100;
		display: flex;
		justify-content: center;
	}
	.container {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
	.container2:before {
		background: none;
		border: 2px solid #fff;
		content: "";
		display: block;
		position: absolute;
		top: 3px;
		left: 3px;
		right: 3px;
		bottom: 3px;
		pointer-events: none;
		border-radius: 8px;
	}
	.container2 {
		width: 70vw;
		height: 70vh;
		background-color: black;
		border-radius: 8px;
		border: 2px solid #fff;
		position: relative;

		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
		align-content: stretch;
	}

	.button {
		color: white;
		border: 2px white solid;
		border-radius: 4px;
		padding: 4px;
		margin: 10px;
		font-size: 35px;
	}

	.leave {
		margin-top: 50px;
	}

	.return {
		margin-bottom: 50px;
	}
</style>
