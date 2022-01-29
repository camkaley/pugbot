'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _strings = require('../assets/strings.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
	name: 'help',
	aliases: ['commands', 'cmds', 'list', 'h'],
	description: 'List all of my commands or info about a specific command.',
	usage: '<command>',
	execute: function execute(message, args, cmd, cfg) {
		var commands = message.client.commands;

		if (!args.length) {
			var _embed = {
				"title": '**' + _strings.strings.botName + ' Help**',
				"color": 1878473,
				"timestamp": new Date(Date.now()).toISOString(),
				"author": {
					"name": '' + cfg.hostName,
					"url": 'http://discord.gg/EJ44zZb',
					"icon_url": 'https://pacificgl.com/images/500x500_PGL_Logo.png'
				},
				"thumbnail": {
					"url": 'https://pacificgl.com/images/500x500_PGL_Logo.png'
				},
				"footer": {
					"icon_url": 'https://pacificgl.com/images/500x500_PGL_Logo.png',
					"text": '' + _strings.strings.author
				},
				"fields": [{
					"name": 'Here are my commands',
					"value": commands.map(function (command) {
						return command.name;
					}).join(', ')
				}, {
					"name": 'Need info on a specific command?',
					"value": '\nYou can send `' + cfg.prefix + 'help <command>` to get info on any command you want!'
				}]
			};
			return message.author.send({ embed: _embed }).then(function () {
				if (message.channel.type !== 'text') return;
				message.reply('I\'ve sent you a DM with my commands!');
			}).catch(function (err) {
				console.log('Could not send help DM to ' + message.author.tag + '.\n', err);
				helpers.reply(message, 'it seems like I can\'t DM you!');
			});
		}
		var name = args[0].toLowerCase();
		var command = commands.get(name) || commands.find(function (c) {
			return c.aliases && c.aliases.includes(name);
		});
		if (!command) return helpers.reply(message, 'that\'s not a valid command!');
		var embed = {
			"title": '**' + _strings.strings.botName + ' Help**',
			"color": 1878473,
			"timestamp": new Date(Date.now()).toISOString(),
			"author": {
				"name": '' + cfg.hostName,
				"url": 'http://discord.gg/EJ44zZb',
				"icon_url": 'https://pacificgl.com/images/500x500_PGL_Logo.png'
			},
			"thumbnail": {
				"url": 'https://pacificgl.com/images/500x500_PGL_Logo.png'
			},
			"footer": {
				"icon_url": 'https://pacificgl.com/images/500x500_PGL_Logo.png',
				"text": '' + _strings.strings.author
			},
			"fields": [{
				"name": 'Command',
				"value": '`' + command.name + '`',
				"inline": true
			}]
		};
		if (command.aliases) {
			var cmdAliases = {
				"name": 'Aliases',
				"value": '' + command.aliases.join(', '),
				"inline": true
			};
			embed.fields.push(cmdAliases);
		}
		if (command.description) {
			var cmdDesc = {
				"name": 'Description',
				"value": '' + command.description
			};
			embed.fields.push(cmdDesc);
		}
		if (command.usage) {
			var cmdUsage = {
				"name": 'Usage',
				"value": '```' + cfg.prefix + command.name + ' ' + command.usage + '```'
			};
			embed.fields.push(cmdUsage);
		}
		if (command.example) {
			var cmdExample = {
				"name": 'Example / Alt. Usage',
				"value": '```' + cfg.prefix + command.name + ' ' + command.example + '```'
			};
			embed.fields.push(cmdExample);
		}
		message.channel.send({ embed: embed });
	}
};