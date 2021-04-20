<template>
	<div class="Main">
		<QRScanner v-if="showScanner" :onDecode="onDecode" :closeScanner="closeScanner" />
		<Map v-show="showMap" :closeMap="closeMap" :tasks="tasks" />
		<SabotageMap v-if="showSabotageMap" :closeMap="closeMap" :sabotage="sabotage" />
		<Task
			v-if="showTask"
			:closeTask="closeTask"
			:type="taskType"
			:taskComplete="taskComplete"
		/>
		<Vote v-show="showVote" :dead="isDead" :voteEnded="voteEnded" />
		<div class="buttonPressed" v-if="showButtonPressed">
			Emergency Meeting
			<div v-if="isHost" v-on:click="$socket.emit('startDiscussion')" class="startDiscussion">
				Start discussion
			</div>
		</div>
		<div class="killed" v-if="newlyDead"></div>
		<div class="role" v-if="showRole">
			<h1 v-if="imposter">You are the impostor</h1>
			<h2 v-if="imposter">{{ imposters.join(", ") }}</h2>
			<h1 v-if="!imposter">You are a crewmate</h1>
		</div>
		<div class="ended" v-if="end">
			<h1 v-if="end.crematesWon">The crewmates won</h1>
			<h1 v-if="end.impostersWon">The imposters won</h1>
		</div>
		<div class="top">
			<div class="left">
				<div class="progressBar">
					<!-- <img src="img/progressBar.png" /> -->
					<VueCompareImage
						leftImage="img/progressBarFilled.png"
						rightImage="img/progressBar.png"
						:sliderPositionPercentage="
							//(taskProgress * (752 / 769 - (1 - 752 / 769))) / 100 + (1 - 752 / 769)
							17 / 769 + (147 * taskProgress) / 15380
						"
						:sliderLineWidth="0"
						:handleSize="0"
					/>
				</div>
				<div class="tasks">
					<div class="task" v-for="task in tasks" :key="task.id">
						{{ locationNames[task.location] }}: {{ taskNames[task.type] }}
					</div>
				</div>
			</div>
			<div class="sideButtons">
				<img src="img/button/settingsButton.png" />
				<img src="img/button/mapButtonDark.png" v-on:click="showMap = true" />
			</div>
		</div>
		<div class="bottomButtons">
			<img src="img/button/scan.png" v-on:click="showScanner = true" />
			<img
				v-show="reportAble"
				src="img/button/reportButton.png"
				v-on:click="$socket.emit('report')"
			/>
			<img v-show="!reportAble" src="img/button/reportButtonDisabled.png" />
			<img
				v-show="sabotageAble && imposter"
				src="img/button/sabotage.png"
				v-on:click="/*$socket.emit('sabotage', 0)*/ showSabotageMap = true"
			/>
			<img v-show="!sabotageAble && imposter" src="img/button/sabotageDisabled.png" />
			<img
				v-show="killAble && imposter"
				src="img/button/killButton.png"
				v-on:click="$socket.emit('kill')"
			/>
			<img v-show="!killAble && imposter" src="img/button/killButtonDisabled.png" />
		</div>
	</div>
</template>

<script>
	import QRScanner from "@/components/QRScanner";
	import Map from "@/components/MapP5";
	import SabotageMap from "@/components/MapP5Sabotage";
	import Task from "@/components/Task";
	import VueCompareImage from "@/components/VueCompareImage";
	import Vote from "@/components/Vote";
	export default {
		name: "Game",
		props: {
			name: {},
			isHost: {}
		},
		sockets: {
			tasks(tasks) {
				this.tasks = tasks;
			},
			progress(progress) {
				this.taskProgress = progress * 100;
				if (this.taskProgress === 0) this.taskProgress = -1;
			},
			id(id) {
				sessionStorage.setItem("id", id);
			},
			imposter({ isImposter, imposters }) {
				this.imposter = isImposter;
				this.imposters = imposters;
				this.showRole = true;
				setTimeout(()=>this.showRole = false, 2500);
				console.log("is Imposter", isImposter);
			},
			deadBodyReported() {
				this.showButtonPressed = true;
				this.newlyDead = false;
			},
			emergencyMeeting() {
				this.showButtonPressed = true;
				this.newlyDead = false;
			},
			discussionStarted() {
				this.showButtonPressed = false;
				this.discussionStarted = true;
				this.showVote = true;
				this.newlyDead = false;
			},
			killed() {
				this.isDead = true;
				this.newlyDead = true;
			},
			ejected() {
				this.isDead = true;
			},
			deviceUpdate({ killAble, reportAble }) {
				this.killAble = killAble;
				this.reportAble = reportAble;
			},
			end(end) {
				this.end = end;
			}
		},
		computed: {
			sabotageAble() {
				if (this.tasks.length < 1) return true;
				for (let i = 0; i < this.tasks.length; i++) {
					if (this.tasks[i].type !== 13) return true;
				}
				return false;
			}
		},
		data() {
			return {
				showScanner: false,
				showMap: false,
				showSabotageMap: false,
				showTask: false,
				showButtonPressed: false,
				taskType: null,
				currentTask: null,
				end: false,
				showRole: false,
				locationNames: [
					"Salen",
					"Salen",
					"Lok. 5",
					"Oasen",
					"Lok. 3",
					"Lok. 3",
					"Lok. 1",
					"Esport",
					"Daglig",
					"Daglig",
					"Spisesal",
					"Lounge",
					"Spisesal"
				],
				taskNames: [
					"Electricity",
					"Divert Power (0/2)",
					"Divert Power (1/2)",
					"Emergency Button",
					"Download Data (0/2)",
					"Admin",
					"Reactor",
					"Fuel (0/2)",
					"Fuel (1/2)",
					"Enter Id Code",
					"Unlock Manifolds",
					"O2",
					"Upload Data",
					"Fix Comms",
					"Upload Data (1/2)"
				],
				tasks: [],
				taskProgress: -1,
				reportAble: true,
				killAble: true,
				imposter: false,
				discussionStarted: false,
				isDead: false,
				showVote: false,
				newlyDead: false
			};
		},
		components: {
			QRScanner,
			Map,
			Task,
			VueCompareImage,
			Vote,
			SabotageMap
		},
		methods: {
			closeScanner() {
				this.showScanner = false;
			},
			closeMap() {
				this.showMap = false;
				this.showSabotageMap = false;
			},
			closeTask() {
				this.showTask = false;
			},
			onDecode(result) {
				if (!isNaN(result)) {
					result = parseInt(result);
					const task = this.tasks.find(task => task.location === result);
					if (task !== undefined) {
						// Valid QR Code
						navigator.vibrate(20);
						this.showScanner = false;
						this.taskType = task.type;
						this.showTask = true;
						this.currentTask = task ? task : { id: "", type: result, location: 0 };
					}
				} else if (result === "emergency") {
					navigator.vibrate(20);
					this.showScanner = false;
					this.taskType = 3;
					this.showTask = true;
					this.currentTask = { id: "", type: 3, location: 0 };
				}
			},
			sabotage(location) {
				this.$socket.emit("sabotage", location);
				this.showSabotageMap = false;
			},
			taskComplete(taskType) {
				this.showTask = false;
				if (taskType !== 3) {
					console.log(taskType, "Complete!!!", this.currentTask.id);
					this.$socket.emit("taskComplete", this.currentTask.id);
				} else {
					console.log("Emergency Button Pressed");
					this.$socket.emit("emergencyButtonPushed");
				}
			},
			voteEnded() {
				this.discussionStarted = false;
				this.showVote = false;
			}
		}
	};
</script>

<style scoped>
	.Main {
		background-color: #3a4848;
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		-webkit-text-stroke: 0.5px black;
		font-family: Arial, Helvetica, sans-serif;
	}
	.left {
		padding: 20px;
		padding-bottom: 0px;
		padding-right: 5px;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.progressBar {
		width: 70vw;
		pointer-events: none; /* Remove this line to move slider with touch */
	}
	.progressBar img {
		width: 100%;
	}
	.top {
		display: flex;
		height: 70%;
	}
	.sideButtons {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-end;
		align-items: baseline;
		align-content: flex-start;
		padding: 5px;
	}
	.sideButtons img {
		margin: 3px;
		width: 70px;
	}
	.tasks {
		background-color: #313d3d;
		margin-top: 20px;
		width: 100%;
		height: 80vh;
		/* padding: 10px; */
	}
	.tasks .task {
		color: white;
		font-size: 5vh;
		-webkit-text-stroke: 0.5px black;
		font-family: Arial, Helvetica, sans-serif;
		margin-left: 10px;
	}
	.tasks :first-child {
		margin-top: 10px;
	}
	.bottomButtons {
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
	}
	.bottomButtons img {
		height: 25vh;
		margin: 10px;
		margin-top: 5px;
	}
	.killed {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
		background-color: black;
		background-image: url("../../public/img/killed.png");
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.ended {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
		background-color: black;
		color: white;
		font-size: 40px;
		text-align: center;
		vertical-align: middle;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.role {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
		background-color: black;
		color: white;
		font-size: 40px;
		text-align: center;
		vertical-align: middle;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.buttonPressed {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
		background-color: black;
		/* background-image: url("../../public/img/buttonPressed.png"); */
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.buttonPressed > div {
		position: absolute;
		bottom: 20px;
		border: 2px solid white;
		border-radius: 5px;
		padding: 5px;
		font-size: 24px;
		background-color: #000;
		right: 20px;
		color: white;
	}
</style>
