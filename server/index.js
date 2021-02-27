require('dotenv').config();

const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const WebSocket = require('ws');
const url = require('url');
const auth = require('basic-auth');
const { v4: uuidv4 } = require('uuid');
const { disconnect } = require('process');
const { options } = require('./routes');

const relations = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
const tasks = [
	{
		type: 4,
		location: 2,
		id: "de6a2996-3843-4156-99b8-5e21e869aa64",
		player: "filli1303",
		complete: false
	},
	{
		location: 0,
		id: "3b758724-4100-44fc-8008-64372656a4fa",
		type: 5,
		player: "filli1303",
		complete: false
	}
];
const players = [];
let gameStarted = false;
let settings = {
	imposterCount: 1,
	roomsDisabled: [],
	emergencyButtonCount: 1,
	discussionTime: 45,
	votingTime: 45,
	killCooldown: 20,
};
let sabotage = false;
let diedThisRound = [];
let roundActive = true;
let discussionStarted = false;
let discussionStartedAt = 0;
let votingStarted = false;
let votingStartedAt = 0;

// Device
{
	const wss = new WebSocket.Server({ noServer: true });

	http.on('upgrade', function upgrade(req, socket, head) {
		const pathname = url.parse(req.url).pathname;

		const user = auth(req);

		if (!user) return;
		if (user.name !== process.env.DEVICE_USERNAME || user.pass !== process.env.DEVICE_PASSWORD) return;

		if (pathname === '/device') {
			wss.handleUpgrade(req, socket, head, function done(ws) {
				wss.emit('connection', ws, req);
			});
		}
	});

	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			console.log('received: %s', message);
			relations[message[0]] = message.split("").slice(1);

			// let i = players.findIndex(player => player.deviceId === message[0]);

		});
	});
}

io.on("connection", socket => {
	socket.on("join", ({ name, deviceId }) => {
		if (!name || typeof name !== "string" || name.length > 18) {
			socket.emit("joinFail", "Invalid name");
			return;
		}
		if (isNaN(deviceId)) {
			socket.emit("joinFail", "Invalid device id");
			return;
		}
		deviceId = parseInt(deviceId);
		// If the socket already have been registered
		if (players.findIndex(player => player.socket.id === socket.id) > -1) {
			let i = players.findIndex(player => player.socket.id === socket.id);
			socket.emit("joined", { name, isHost: players[i].host });
			return;
		}

		if (gameStarted) {
			socket.emit("joinFail", "Game is already started");
			return;
		}
		let i = players.findIndex(player => player.name === name);
		if (i > -1) {
			players[i].socket = socket;
			socket.emit("joinFail", "username is taken");
			return;
		}
		if (players.length >= 10) {
			socket.emit("joinFail", "server is full");
		}

		socket.on("disconnect", () => {
			let i = players.findIndex(player => player.name === name)
			players[i].socket.disconnect(true);
			players.splice(i, 1);
			io.emit("newPlayer", { count: players.length, slots: 10 });
			console.log(`'${name}' disconnected ${players.length} remaining`);
			if (players.length > 0) {
				players[0].host = true;
				players[0].socket.emit("isHost", true);
			}
		})

		let isHost = players.length === 0;
		players.push({
			name,
			socket,
			host: isHost,
			deviceId
		});
		if (!relations[deviceId])
			relations[deviceId] = [];
		socket.emit("joined", { name, isHost });
		io.emit("newPlayer", { count: players.length, slots: 10 });
		console.log(`'${name}' joined ${players.length} players in lobby`);

		// Host can start the game
		socket.on("startGame", () => {
			if (players.findIndex(player => player.name === name) !== 0) return // not host
			io.emit("gameStarted");
			gameStarted = true;
			for (let i = 0; i < settings.imposterCount; i++) {
				let hasGiven = false;
				while (!hasGiven) {
					let p = Math.floor(Math.random() * players.length);
					if (!players[p].isImposter) {
						players[p].isImposter = true;
						hasGiven = true;
					}
				}
			}
			for (let i = 0; i < players.length; i++) {
				console.log(players[i].isImposter);
				players[i].socket.emit("imposter", players[i].isImposter ? true : false);
			}
			console.log("Game Started");
		});

		// Host can set settings
		socket.on("setSettings", newSettings => {
			if (players.findIndex(player => player.name === name) !== 0) return // not host
			settings = { ...settings, ...newSettings };
		});

		// When the clients have loaded
		socket.on("loaded", () => {
			if (!gameStarted) return; // Check if client is trying to load before game is started
			socket.emit("tasks", tasks.filter(task => !task.complete && task.player === name && !task.locked));
			socket.emit("progress", tasks.reduce((acc, cur) => acc += cur.complete ? 1 / tasks.length : 0, 0));

			// If player is imposter
			let playerIndex = players.findIndex(player => player.name === name);
			if (players[playerIndex].isImposter) {
				// When imposter kills a person
				socket.on("kill", () => {
					console.log("kill");
					let playerIndex = players.findIndex(player => player.name === name);
					let i = Math.floor(Math.random() * players.length);
					while (playerIndex === i || players[i].isDead || players[i].isImposter || !relations[players[playerIndex].deviceId].includes(players[i].deviceId)) {
						i = Math.floor(Math.random() * players.length);
					}
					console.log("killed", i);
					players[i].isDead = true;
					players[i].socket.emit("killed");
					diedThisRound.push(players[i].deviceId);
					const alive = players.reduce((count, p) => count += !p.isDead && !p.isImposter, 0);
					if (alive <= settings.imposterCount) {
						console.log("Game ended", "impostors won");
						io.emit("end", { impostersWon: true, crematesWon: false });
					}
				});

				// When imposter sabotages
				socket.on("sabotage", location => {
					sabotage = true;
					io.emit("tasks", [{ location, type: 13, id: "sabotage", complete: false, locked: false, sabotage: true }]);
					io.emit("progress", 0);
				});
			}

			socket.on("startDiscussion", () => {
				let playerIndex = players.findIndex(player => player.name === name);
				if (!players[playerIndex].host) return; // Only hosts can start the discussion
				if (roundActive || discussionStarted || votingStarted) return;

				for (let i = 0; i < players.length; i++) {
					players[i].voted = undefined;
				}

				discussionStartedAt = Date.now();
				discussionStarted = true;
				let playersToSend = []
				players.forEach(p => playersToSend.push({ name: p.name, deviceId: p.deviceId, dead: p.isDead, reported: p.reported, voted: p.voted }));
				io.emit("discussionStarted", { endingAt: discussionStartedAt + settings.discussionTime * 1000, players: playersToSend });
				setTimeout(() => {
					let playersToSend = []
					players.forEach(p => playersToSend.push({ name: p.name, deviceId: p.deviceId, dead: p.isDead, reported: p.reported, voted: p.voted }));
					discussionStarted = false;
					votingStartedAt = Date.now();
					votingStarted = true;
					io.emit("votingStarted", { endingAt: votingStartedAt + settings.votingTime * 1000, players: playersToSend });

					setTimeout(() => {
						let votes = [];
						let skips = 0;
						for (let i = 0; i < 10; i++) {
							votes[i] = { id: i, count: 0 };
						}
						for (let i = 0; i < players.length; i++) {
							if (!players[i].isDead)
								if (!isNaN(players[i].voted) && players[i].voted !== null) {
									votes[players[i].voted].count++;
								} else {
									skips++;
								}
						}
						votes.sort((a, b) => b.count - a.count);
						if (skips >= votes[0].count) {
							console.log("Skipped");
							io.emit("voteResult", { state: 2 });
						} else if (votes[0].count === votes[1].count) {
							console.log("Tie");
							io.emit("voteResult", { state: 3 });
						} else {
							let ejectedPlayer = players.findIndex(player => player.deviceId === votes[0].id);
							console.log(`${players[ejectedPlayer].name} (${votes[0].id}) was ejected`);

							io.emit("voteResult", { state: players[ejectedPlayer].isImposter ? 0 : 1, name: players[ejectedPlayer].name });
							players[ejectedPlayer].socket.emit("ejected");
							players[ejectedPlayer].isDead = true;
						}

						sabotage = false;
						diedThisRound = [];
						roundActive = true;
						discussionStarted = false;
						discussionStartedAt = 0;
						votingStarted = false;
						votingStartedAt = 0;
					}, settings.votingTime * 1000)
				}, settings.discussionTime * 1000)
			});

			socket.on("vote", deviceId => {
				if (!votingStarted) return;
				if (players[players.findIndex(player => player.name === name)].voted !== undefined) return;
				players[players.findIndex(player => player.name === name)].voted = deviceId;
				let playersToSend = []
				players.forEach(p => playersToSend.push({ name: p.name, deviceId: p.deviceId, dead: p.isDead, reported: p.reported, voted: p.voted }));
				io.emit("voteUpdate", { endingAt: votingStartedAt + settings.votingTime * 1000, players: playersToSend });
			});

			socket.on("report", () => {
				let playerIndex = players.findIndex(player => player.name === name);
				let nearby = false;
				diedThisRound.forEach(id => {
					if (relations[players[playerIndex].deviceId].includes(id)) {
						nearby = true;
					}
				})
				console.log(nearby);
				if (!nearby) return;
				roundActive = false;
				for (let i = 0; i < players.length; i++) {
					players[i].reported = false;
				}
				players[playerIndex].reported = true;
				io.emit("deadBodyReported");
			});

			socket.on("emergencyButtonPushed", () => {
				roundActive = false;
				for (let i = 0; i < players.length; i++) {
					players[i].reported = false;
				}
				io.emit("emergencyMeeting");
			});

			socket.on("taskComplete", id => {
				if (id === "sabotage" && sabotage) {
					players.forEach(p => {
						p.socket.emit("tasks", tasks.filter(task => !task.complete && task.player === p.name && !task.locked))
					});
					io.emit("progress", tasks.reduce((acc, cur) => acc += cur.complete ? 1 / tasks.length : 0, 0));
					return;
				}
				let i = -1;
				tasks.forEach((task, index) => { if (task.id === id) i = index })
				tasks[i].complete = true;
				if (tasks[i].type === 1 || tasks[i].type === 7) { // if is "Divert Power (0/2)" or "Fuel (0/2)"
					tasks[i].type++;
					tasks[i].id = uuidv4();
					tasks[i].complete = false;
				}
				if (tasks[i].type === 4) { // if is "Download Data (0/2)"
					tasks[i].type = 14;
					tasks[i].id = uuidv4();
					tasks[i].complete = false;
				}

				socket.emit("tasks", tasks.filter(task => !task.complete && task.player === name && !task.locked));
				io.emit("progress", tasks.reduce((acc, cur) => acc += cur.complete ? 1 / tasks.length : 0, 0));
				if (tasks.reduce((acc, cur) => acc += cur.complete ? 1 / tasks.length : 0, 0) == 1) {
					io.emit("end", { impostersWon: false, crematesWon: true });
				}
			});
		});
	});
});

// Express
{
	const cors = require('cors');

	app.use(express.json());
	app.use(cors());

	http.listen(process.env.HTTP_PORT || 8080, () => {
		console.log('listening on *:' + (process.env.HTTP_PORT || 8080));
	});

	app.use(require("./routes"));
}