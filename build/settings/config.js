"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var cfg = exports.cfg = {
	"testMode": false,
	"devMode": false,
	"hostName": "AIC",
	"websiteUrl": "www.rickroll.com",
	"permDiscordInvite": "https://discord.gg/6T4bTk3bzp",
	"prefix": ".",
	"botsRoleName": "WarBot",
	"mapVoting": true,
	"requireReadyUp": false,
	"unmuteToReady": false,
	"useMissedPUGChannel": false, //was true
	"voteDelay": 15000,
	"maxTeamSize": 5,
	"maxTeamsPerPlayer": 2,
	"enableLogging": true,
	"newMemberRole": "Guest",
	// "proPlayerRole": `PUG Pro`,
	"proPlayerRole": "PUG Regulars",
	"proPlayerRolePugCount": 30,
	"botTestModeRoles": ["OG", "PUG Helper", "Moderator", "Full-blown Comedian", "Admin"],
	"botModeratorRoles": ["Moderator", "Admin", "OG", "PUG Helper"],
	"adminRoles": ["Moderator", "Admin", "OG", "Event Staff"],
	"logChannels": ["log", "logs"],
	"announcementChannels": [
	// `announcements`,
	// `pugs`,
	// `warbot`,
	// `ez-chat`,
	"announcements"],
	"pugTextChannels": [
	// `pugs`,
	"warbot", "phresh-pugbot", "bot-test", "teampick"],
	"warbotOnlyChannels": [
		// `warbot`,
	],
	"archiveCategoryId": "434942884396007424",
	"pugCategoryId": "704919963093303406",
	"pugVoiceChannels": ["Voice Chat", // First must be waiting room
	"Security", // Second must be Missed Out room, ONLY if useMissedPUGChannel is true
	"Insurgents", "elite"],
	"gameSubRoles": { // "command": `Role Name`,
		"aoe": "Age of Empires",
		"arma": "Arma",
		"bf": "Battlefield",
		"hll": "Hell Let Loose",
		"ins": "Insurgency",
		"pubg": "PUBG",
		"rl": "Rocket League",
		"squad": "Squad"
	},
	"pugGameCfg": {
		"sandstorm": {
			"gameName": "Insurgency Sandstorm",
			"teamSize": 5
		},
		"ins": {
			"gameName": "Insurgency 2014",
			"teamSize": 5
		}
	},
	"gameServers": { // gameServers[key] must have a matching pugGameCfg[key] & gameName
		"sandstorm": [{
			"name": "#1 PUSH",
			"ip": "139.99.130.137:27569",
			"url": "https://www.gametracker.com/server_info/139.99.130.137:27569"
		}, {
			"name": "#2 FIREFIGHT",
			"ip": "139.99.130.137:27560",
			"url": "https://www.gametracker.com/server_info/139.99.130.137:27560"
		}, {
			"name": "OSG Firefight #1",
			"ip": "45.121.209.65:27112",
			"url": "https://www.gametracker.com/server_info/45.121.209.65:27112",
			"pass": "ocesg",
			"isPugServer": true
		}, {
			"name": "#4 COOP",
			"ip": "139.99.130.237:27578",
			"url": "https://www.gametracker.com/server_info/139.99.130.237:27578"
		}],
		"ins": [{
			"name": "#1 SUSTAINED",
			"ip": "connect 139.99.130.177:27094",
			"url": "https://www.gametracker.com/server_info/139.99.130.177:27094"
		}, {
			"name": "#2 SUSTAINED",
			"ip": "connect 108.61.213.66:27015",
			"url": "https://www.gametracker.com/server_info/108.61.213.66:27015"
		}, {
			"name": "#3 MATCH",
			"ip": "connect 139.99.130.177:27092",
			"url": "https://www.gametracker.com/server_info/139.99.130.177:27092",
			"pass": "pacific",
			"isPugServer": true
		}],
		"ts": {
			"name": "no TeamSpeak nerds",
			"ip": "www.rickrol.com"
		}
	},
	//"welcomeMessage": `Welcome to Pacific Gaming League's Discord!\nPlease be sure to read #rules and then visit #region-registry to unlock our full server and get involved.\nInvite you friends anytime, with https://discord.gg/EJ44zZb. Have fun!`,
	//"onRegistrationMessage": `Thank you for registering with Pacific Gaming League! All member level, text & voice channels are now unlocked and available to you. Enjoy!`,
	"welcomeMessage": "welcome Nerds",
	"onRegistrationMessage": "u did a rego or someting"
};