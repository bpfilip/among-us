<template>
	<div class="Settings">
		<MapP5Settings :tasks="settings.roomsDisabled" :toggleTask="toggleTask" />
		<div class="settings">
			<div class="setting">
				<p class="settingName">Imposters:</p>
				<p
					class="minus"
					v-on:click="
						settings.impostorCount++;
						update();
					"
				>
					+
				</p>
				<p class="value">{{ settings.impostorCount }}</p>
				<p
					class="plus"
					v-on:click="
						settings.impostorCount--;
						update();
					"
				>
					-
				</p>
			</div>
			<div class="setting">
				<p class="settingName"># Emergency Mettings:</p>
				<p
					class="minus"
					v-on:click="
						settings.emergencyButtonCount++;
						update();
					"
				>
					+
				</p>
				<p class="value">{{ settings.emergencyButtonCount }}</p>
				<p
					class="plus"
					v-on:click="
						settings.emergencyButtonCount--;
						update();
					"
				>
					-
				</p>
			</div>
			<div class="setting">
				<p class="settingName">Discussion Time:</p>
				<p
					class="minus"
					v-on:click="
						settings.discussionTime++;
						update();
					"
				>
					+
				</p>
				<p class="value">{{ settings.discussionTime }}</p>
				<p
					class="plus"
					v-on:click="
						settings.discussionTime--;
						update();
					"
				>
					-
				</p>
			</div>
			<div class="setting">
				<p class="settingName">Voting Time:</p>
				<p
					class="minus"
					v-on:click="
						settings.votingTime++;
						update();
					"
				>
					+
				</p>
				<p class="value">{{ settings.votingTime }}</p>
				<p
					class="plus"
					v-on:click="
						settings.votingTime--;
						update();
					"
				>
					-
				</p>
			</div>
			<div class="setting">
				<p class="settingName">Kill Cooldown:</p>
				<p
					class="minus"
					v-on:click="
						settings.killCooldown++;
						update();
					"
				>
					+
				</p>
				<p class="value">{{ settings.killCooldown }}</p>
				<p
					class="plus"
					v-on:click="
						settings.killCooldown--;
						update();
					"
				>
					-
				</p>
			</div>
		</div>
		<div class="button reset" v-on:click="reset()">Reset</div>
		<div class="button confirm" v-on:click="confirm()">Confirm</div>
	</div>
</template>

<script>
	import MapP5Settings from "../components/MapP5Settings";
	export default {
		components: {
			MapP5Settings
		},
		data() {
			return {
				settings: {
					impostorCount: 1,
					roomsDisabled: [],
					emergencyButtonCount: 1,
					discussionTime: 45,
					votingTime: 45,
					killCooldown: 20
				},
				tasks: []
			};
		},
		methods: {
			toggleTask(room) {
				let index = this.settings.roomsDisabled.indexOf(room);
				if (index > -1) {
					this.settings.roomsDisabled.splice(index, 1);
				} else {
					this.settings.roomsDisabled.push(room);
				}
				this.saveSettings();
			},
			update() {
				if (this.settings.impostorCount < 1) {
					this.settings.impostorCount = 1;
				}
				if (this.settings.impostorCount > 5) {
					this.settings.impostorCount = 5;
				}
				if (this.settings.emergencyButtonCount < 1) {
					this.settings.emergencyButtonCount = 1;
				}
				if (this.settings.emergencyButtonCount > 5) {
					this.settings.emergencyButtonCount = 5;
				}
				if (this.settings.discussionTime < 10) {
					this.settings.discussionTime = 10;
				}
				if (this.settings.discussionTime > 300) {
					this.settings.discussionTime = 300;
				}
				if (this.settings.votingTime < 10) {
					this.settings.votingTime = 10;
				}
				if (this.settings.votingTime > 300) {
					this.settings.votingTime = 300;
				}
				if (this.settings.killCooldown < 0) {
					this.settings.killCooldown = 0;
				}
				if (this.settings.killCooldown > 120) {
					this.settings.killCooldown = 120;
				}
				this.saveSettings();
			},
			saveSettings() {
				localStorage.setItem("settings", JSON.stringify(this.settings));
			},
			reset() {
				this.settings = {
					impostorCount: 1,
					roomsDisabled: [],
					emergencyButtonCount: 1,
					discussionTime: 45,
					votingTime: 45,
					killCooldown: 20
				};
				this.saveSettings();
			},
			confirm() {
				this.saveSettings();
				this.updateSettings(this.settings);
			}
		},
		mounted() {
			if (localStorage.getItem("settings")) {
				this.settings = JSON.parse(localStorage.getItem("settings"));
			}
			this.saveSettings();
		},
		props: {
			updateSettings: {}
		}
	};
</script>

<style scoped>
	.Settings {
		background-color: #3f4b4c;
		position: absolute;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: Arial;
		text-shadow: 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000;
	}
	.Settings .button {
		position: absolute;
		bottom: 20px;
		border: 2px solid white;
		border-radius: 5px;
		padding: 5px;
		font-size: 24px;
		background-color: #000;
	}
	.Settings .reset {
		left: 20px;
	}
	.Settings .confirm {
		right: 20px;
	}
	.settings {
		display: flex;
		flex-direction: column;
	}
	.setting {
		/* display: flex; */
		flex-direction: row;
		justify-content: space-between;
		width: 111.37vh;
	}
	.setting p {
		margin: 5px;
		float: right;
	}
	.setting p.settingName {
		float: left;
	}
	.setting p.value {
		width: 50px;
		text-align: center;
	}
	.setting .seetingName {
		margin-left: auto;
	}
	.Map {
		border: 3px white solid;
		border-radius: 10px;
		padding: 10px;
	}
</style>
