const express = require('express');
const Router = express.Router();

global.relations = [1
];

Router.post("/", (req, res) => {
	const data = req.body;

	if (data.token !== process.env.DEVICE_KEY) {
		return res.sendStatus(401);
	}

	relations = relations.filter(v => !(v.includes(data.id) || data.nearby.includes(v[0]) || data.nearby.includes(v[1])));

	data.nearby.forEach(v => {
		relations.push([data.id, v]);
	});

	res.send({ status: "ok" });
})

module.exports = Router;