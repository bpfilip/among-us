<template>
	<div class="Vote">
		<div class="container">
			<div class="container2">
				<VueP5
					class="sketch"
					@setup="setup"
					@draw="draw"
					@preload="preLoad"
					@touchended="touchEnded"
					:additionalEvents="['preLoad', 'touchEnded']"
				/>
			</div>
		</div>
		<div v-if="showResults" class="result">
			<p>{{ resultText }}</p>
		</div>
	</div>
</template>

<script>
	import VueP5 from "vue-p5";
	export default {
		name: "Vote",
		data() {
			return {
				p5: null,
				voted: false,
				voteStarted: false,
				clicked: -1,
				players: [
					{
						name: "filli1303",
						deviceId: 0,
						dead: false,
						reported: true,
						voted: undefined
					},
					{ name: "filli1304", deviceId: 2, dead: false, reported: false, voted: null },
					{ name: "filli1305", deviceId: 5, dead: false, reported: false, voted: 8 },
					{ name: "filli1306", deviceId: 8, dead: true, reported: false, voted: 5 },
					{ name: "filli1307", deviceId: 4, dead: true, reported: false, voted: 5 },
					{ name: "filli1308", deviceId: 7, dead: true, reported: false, voted: null }
				],
				discussionEndingAt: Date.now() + 45000,
				voteEndingAt: Date.now() + 45000,
				dead: false,
				showResults: false,
				resultText: "",
				result: { name: "", state: -1 },
				showResultsStart: 0,
				lastLetter: -1
			};
		},
		components: {
			VueP5
		},
		props: {
			voteEnded: {},
			dead: {}
		},
		beforeDestroy() {
			this.p5.noLoop();
			this.p5.remove();
		},
		sockets: {
			voteUpdate({ players, endingAt }) {
				this.players = players;
				this.voteEndingAt = endingAt;
				this.voteStarted = true;
				console.log(players);
			},
			discussionStarted({ players, endingAt }) {
				this.players = players;
				this.discussionEndingAt = endingAt;
			},
			votingStarted({ players, endingAt }) {
				this.players = players;
				this.voteEndingAt = endingAt;
				this.voteStarted = true;
			},
			voteResult(result) {
				this.showResults = true;
				this.result = result;
				console.log(result);
				this.showResultsStart = performance.now();
			}
		},
		methods: {
			preLoad(p5) {
				this.p5 = p5;
				this.baseImage = p5.loadImage("img/vote/base.png");
				this.baseGlassImage = p5.loadImage("img/vote/baseGlass.png");
				this.playerBaseImage = p5.loadImage("img/vote/votePlayerBase.png");
				this.baseGlassGhostImage = p5.loadImage("img/vote/baseGlassGhost.png");
				this.reportedImage = p5.loadImage("img/vote/reported.png");
				this.votedImage = p5.loadImage("img/vote/i_voted.png");
				this.skipVoteImage = p5.loadImage("img/vote/skipVote.png");
				this.confirmImage = p5.loadImage("img/vote/voteConfirm.png");
				this.cancelImage = p5.loadImage("img/vote/voteCancel.png");
				this.skippedVotingImage = p5.loadImage("img/vote/skippedVotingTally.png");
			},
			setup(p5) {
				let c = p5.createCanvas(854, 579);
				c.elt.style.width = "132.746vh";
				c.elt.style.height = "90vh";
				p5.angleMode(p5.DEGREES);
				p5.imageMode(p5.CORNER);
			},
			draw(p5) {
				p5.image(this.baseImage, 0, 0);

				p5.textAlign(p5.CENTER);
				p5.textSize(42);
				p5.fill(255);
				p5.stroke(0);
				p5.strokeWeight(4);
				p5.textStyle(p5.NORMAL);
				p5.textFont("Helvetica");
				p5.text("Who Is The Impostor?", 402.5, 80);

				p5.textAlign(p5.LEFT);
				p5.textSize(24);
				for (let i = 0; i < this.players.length; i++) {
					let x = i % 2 == 0 ? 45 : 410;
					let y = (i >> 1) * 75 + 110;
					p5.image(this.playerBaseImage, x, y);

					p5.textSize(24);
					p5.strokeWeight(4);
					p5.textStyle(p5.NORMAL);
					p5.fill(255);
					p5.text(this.players[i].name, x + 15, y + 30);

					p5.strokeWeight(0);
					p5.fill(0);
					p5.text(
						`(${this.players[i].deviceId})`,
						x + 20 + p5.textWidth(this.players[i].name),
						y + 30
					);

					if (this.players[i].reported) {
						p5.image(this.reportedImage, x + 270, y + 1);
					}

					if (this.players[i].dead) {
						p5.push();
						p5.tint(0, 127);
						p5.image(this.playerBaseImage, x, y);
						p5.pop();
					}

					if (this.players[i].voted !== undefined) {
						p5.image(this.votedImage, x - 18, y - 18);
					}

					if (this.voted || this.dead) {
						let width = 0;
						for (let j = 0; j < this.players.length; j++) {
							if (this.players[j].voted === this.players[i].deviceId) {
								p5.textAlign(p5.LEFT);
								p5.textSize(18);
								p5.strokeWeight(0);
								p5.fill(0);
								p5.text(this.players[j].deviceId, x + 15 + width, y + 52);
								width += p5.textWidth(this.players[j].deviceId) + 5;
							}
						}
					}
				}

				if (this.voted || this.dead) {
					let width = 0;
					for (let i = 0; i < this.players.length; i++) {
						if (this.players[i].voted === null) {
							p5.textAlign(p5.LEFT);
							p5.textSize(24);
							p5.strokeWeight(0);
							p5.fill(0);
							p5.text(this.players[i].deviceId, 130 + width, 520);
							width += p5.textWidth(this.players[i].deviceId) + 10;
						}
					}
					p5.image(this.skippedVotingImage, 50, 490);
				}

				if (!this.voted && !this.dead && this.voteStarted) {
					p5.image(this.skipVoteImage, 50, 500);
				}

				if (this.clicked > -1 && !this.voted) {
					let x = this.clicked % 2 == 0 ? 45 : 410;
					let y = (this.clicked >> 1) * 75 + 110;

					p5.image(this.confirmImage, x + 230, y + 5);
					p5.image(this.cancelImage, x + 288, y + 5);
				}

				p5.textAlign(p5.LEFT);
				p5.textSize(24);
				p5.textSize(24);
				p5.strokeWeight(4);
				p5.textStyle(p5.NORMAL);
				p5.fill(255);
				if (this.voteStarted)
					p5.text(
						`Voting Ends In: ${Math.floor((this.voteEndingAt - Date.now()) / 1000) +
							1}s`,
						530,
						520
					);
				else
					p5.text(
						`Voting Begins In: ${Math.floor(
							(this.discussionEndingAt - Date.now()) / 1000
						) + 1}s`,
						530,
						520
					);

				p5.image(this.baseGlassImage, 36, 33);
				if (this.dead) p5.image(this.baseGlassGhostImage, 34, 31);

				if (this.showResults) {
					const messages = [
						" Was The Impostor",
						" Was Not The Impostor",
						"No One Was Ejected (Skipped)",
						"No One Was Ejected (Tie)"
					];
					let time = Math.floor((performance.now() - this.showResultsStart) / 200) - 1;
					if (time > this.lastLetter) {
						this.lastLetter = time;
						if (this.result.state < 2) {
							if (this.lastLetter < this.result.name.length)
								this.resultText += this.result.name[this.lastLetter];
							else if (
								messages[this.result.state][
									this.lastLetter - this.result.name.length
								]
							)
								this.resultText +=
									messages[this.result.state][
										this.lastLetter - this.result.name.length
									];
						} else if (messages[this.result.state][this.lastLetter]) {
							this.resultText += messages[this.result.state][this.lastLetter];
						}
						if (
							(this.result.state < 2 &&
								this.lastLetter >
									this.result.name.length + messages[this.result.state].length + 5) ||
							(this.result.state !== 0 &&
								this.lastLetter > messages[this.result.state].length + 5)
						) {
							this.voteEnded();
							this.cleanup();
						}
					}
				}
			},
			touchEnded(p5) {
				if (this.dead || !this.voteStarted) return;
				let mx = p5.mouseX;
				let my = p5.mouseY;
				if (!this.voted) {
					if (this.clicked > -1) {
						let x = this.clicked % 2 == 0 ? 45 : 410;
						let y = (this.clicked >> 1) * 75 + 110 + 5;
						if (
							mx - (x + 230) < 50 &&
							mx - (x + 230) > 0 &&
							my - y < 50 &&
							my - y > 0
						) {
							this.vote(this.players[this.clicked].deviceId);
							this.voted = true;
							return;
						}
						if (
							mx - (x + 288) < 50 &&
							mx - (x + 288) > 0 &&
							my - y < 50 &&
							my - y > 0
						) {
							this.clicked = -1;
							return;
						}
					}
					for (let i = 0; i < this.players.length; i++) {
						let x = i % 2 == 0 ? 45 : 410;
						let y = (i >> 1) * 75 + 110;
						if (
							mx - x < 348 &&
							mx - x > 0 &&
							my - y < 63 &&
							my - y > 0 &&
							!this.players[i].dead
						) {
							if (this.clicked === i) {
								this.clicked = -1;
								return;
							}
							this.clicked = i;
						}
					}
					if (mx - 50 < 110 && mx - 50 > 0 && my - 500 < 25 && my - 500 > 0) {
						this.vote(null);
						this.voted = true;
					}
				}
			},
			vote(player) {
				this.$socket.emit("vote", player);
			},
			cleanup() {
				this.players = [];
				this.voted = false;
				this.voteStarted = false;
				this.clicked = -1;
				this.discussionEndingAt = Date.now() + 45000;
				this.voteEndingAt = Date.now() + 45000;
				this.showResults = false;
				this.resultText = "";
				this.result = { name: "", state: -1 };
				this.showResultsStart = 0;
				this.lastLetter = -1;
			}
		}
	};
</script>

<style scoped>
	.Vote {
		position: absolute;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		background-color: #444b;
		z-index: 200;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.result {
		position: absolute;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		background-color: black;
		z-index: 300;
		background-image: url("../../public/img/stars.png");
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.result p {
		color: white;
		text-align: center;
	}
	.container {
		position: relative;
		height: 90vh;
		width: 132.746vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 200;
	}
	.background {
		width: 132.746vh;
	}
	.sketch {
		position: absolute;
		top: 0;
		left: 0;
		height: 90vh;
		width: 132.746vh;
	}
</style>
