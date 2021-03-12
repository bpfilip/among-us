<template>
	<div class="Home">
		<div class="logo">
			<img src="img/logoWhite.png" />
		</div>
		<div class="buttons">
			<img src="img/button/join.png" class="join" v-on:click="$router.push('game')" />
			<div class="small">
				<img src="img/button/annoucementButton.png" alt="" />
			</div>
		</div>
		<div class="version">v{{ version }}</div>
	</div>
</template>

<script>
	import { version } from "../../package.json";
	export default {
		name: "Home",
		data() {
			return { version };
		}
	};
</script>

<style scoped>
	.Home {
		width: 100vw;
		height: 100vh;

		background-color: black;
		background-image: url("../../public/img/stars.png");
		/* background-size: cover; */
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.logo {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
	.logo img {
		margin-top: 20px;
		width: 80vw;

	}
	.buttons {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}
	.join {
		width: 20vw;
	}
	.small {
		margin-top: 10px;
	}
	.small img {
		margin: 5px;
		width: 6vw;
	}
	.version {
		position: absolute;
		top: 0;
		left: 0;
		margin: 10px;
		color: white;
		-webkit-text-stroke: 0.5px black;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 2vw;
	}
</style>
