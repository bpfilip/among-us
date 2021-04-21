<template>
	<div class="Main">
		<div class="NameInput" v-if="showNameInput">
			<p v-if="joinFailMessage">{{ joinFailMessage }}</p>
			<input
				class="username"
				v-model="username"
				placeholder="Username"
				v-on:keyup="usernameKeyUp"
			/>
			<div class="deviceSelector">
				<p
					class="minus"
					v-on:click="
						deviceId--;
						updateDeviceId();
					"
				>
					-
				</p>
				<p class="value">{{ deviceId }}</p>
				<p
					class="plus"
					v-on:click="
						deviceId++;
						updateDeviceId();
					"
				>
					+
				</p>
			</div>
			<img src="img/button/join.png" class="join" v-on:click="nameSubmit" />
			<div class="version">v{{ version }}</div>
			<div class="back" v-on:click="$router.push('/')">Back</div>
		</div>
		<div class="Lobby" v-if="!gameStarted&&!showNameInput">
			<img v-if="isHost" v-on:click="startGame" src="img/startButton.png" />
			<p class="players">{{ playersInLobby.count }}/{{ playersInLobby.slots }}</p>
			<img v-if="isHost" v-on:click="showSettings" src="img/button/settingsButton.png" />
			<Settings v-if="showSettingsMenu" :updateSettings="updateSettings" />
			<div class="leave" v-on:click="leave()">Leave Lobby</div>
		</div>
		<Game v-if="joined" v-show="gameStarted" v:name="username" :isHost="isHost" />
	</div>
</template>

<script>
	import { version } from "../../package.json";
	import Game from "./Game";
	import Settings from "./Settings";
	export default {
		name: "Lobby",
		components: {
			Game,
			Settings
		},
		sockets: {
			joined(data) {
				this.joined = true;
				this.isHost = data.isHost;
			},
			joinFail(msg) {
				this.joinFailMessage = msg;
				this.showNameInput = true;
			},
			gameStarted() {
				this.gameStarted = true;
				this.$socket.emit("loaded");
				console.log("gameStarted");
			},
			newPlayer(data) {
				this.playersInLobby = data;
			},
			isHost(isHost) {
				this.isHost = isHost;
			}
		},
		data() {
			return {
				version,
				username: localStorage.getItem("username"),
				deviceId: localStorage.getItem("deviceId") || "0",
				showNameInput: true,
				showLobby: false,
				joined: false,
				gameStarted: false,
				joinFailMessage: null,
				isHost: false,
				playersInLobby: { slots: 10, count: 1 },
				showSettingsMenu: false,
				settingsUpdated: false
			};
		},
		methods: {
			nameSubmit() {
				if (this.username.length > 1 && this.username.length <= 18) {
					this.showNameInput = false;
					this.$socket.emit("join", { name: this.username, deviceId: this.deviceId });
					localStorage.setItem("username", this.username);
				}
			},
			usernameKeyUp(e) {
				if (e.keyCode === 13) {
					this.nameSubmit();
				}
				if (this.username.length >= 18) {
					e.preventDefault();
					return false;
				}
			},
			startGame() {
				if (!this.settingsUpdated && localStorage.getItem("settings"))
					this.updateSettings(JSON.parse(localStorage.getItem("settings")));
				this.$socket.emit("startGame");
			},
			showSettings() {
				this.showSettingsMenu = true;
				this.settingsUpdated = true;
			},
			updateSettings(settings) {
				this.showSettingsMenu = false;
				this.$socket.emit("setSettings", settings);
			},
			updateDeviceId() {
				if (this.deviceId === undefined) {
					this.deviceId = 0;
				}
				if (this.deviceId < 0) {
					this.deviceId = 0;
				}
				if (this.deviceId > 9) {
					this.deviceId = 9;
				}
				localStorage.setItem("deviceId", this.deviceId);
			},
			leave() {
				location.href = "/";
			}
		}
	};
</script>

<style scoped>
	.Lobby {
		width: 100vw;
		height: 100vh;
		background-color: #3f4b4c;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: white;
		padding-top: 5%;
	}
	.deviceSelector {
		display: flex;
		-webkit-touch-callout: none;
		user-select: none;
	}
	.deviceSelector p {
		margin: 5px;
	}
	.players {
		margin-top: 50px;
		font-size: 30px;
	}
	.NameInput {
		width: 100vw;
		height: 100vh;

		background-color: black;
		background-image: url("../../public/img/stars.png");
		/* background-size: cover; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.NameInput p {
		color: white;
		font-size: 30px;
	}
	input {
		background-color: #000;
		border-color: #eee;
		margin-top: 0px;
		margin: 0px;
		color: white;
		font-size: 30px;
		border-radius: 10px;
		border: 2px solid;
		padding: 2px;
		text-align: center;
		width: 40%;
	}
	input:focus {
		outline: none;
		border-color: #fff;
	}
	.join {
		width: 20vw;
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
	.leave {
		position: absolute;
		bottom: 10px;
		left: -20px;
		color: white;
		border: 2px white solid;
		border-radius: 4px;
		padding: 4px;
		margin: 30px;
		font-size: 20px;
		background: black;
	}
	.back {
		position: absolute;
		left: 0;
		bottom: 0;
		color: white;
		border: 2px white solid;
		border-radius: 4px;
		padding: 4px;
		margin: 15px;
		font-size: 20px;
		background: black;
	}
</style>
