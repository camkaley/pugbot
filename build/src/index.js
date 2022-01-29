'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.client = undefined;

require('babel-register');

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _discord = require('discord.js');

var Discord = _interopRequireWildcard(_discord);

var _helpers = require('./assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _pug = require('./assets/pug.js');

var pug = _interopRequireWildcard(_pug);

var _states = require('./assets/states.json');

var states = _interopRequireWildcard(_states);

var _config = require('../settings/config.js');

var _strings = require('./assets/strings.js');

var _token = require('../settings/token.js');

var _package = require('../package.json');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // WarBot


var talkedRecently = new Set();
var client = exports.client = new Discord.Client();
client.commands = new Discord.Collection();
var commandFiles = _fs2.default.readdirSync('./src/commands').filter(function (file) {
	return file.endsWith('.js');
});
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
	for (var _iterator = commandFiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		var file = _step.value;

		var command = require('./commands/' + file).default;
		client.commands.set(command.name, command);
	}

	// Handle incoming messages
} catch (err) {
	_didIteratorError = true;
	_iteratorError = err;
} finally {
	try {
		if (!_iteratorNormalCompletion && _iterator.return) {
			_iterator.return();
		}
	} finally {
		if (_didIteratorError) {
			throw _iteratorError;
		}
	}
}

client.on('message', function (message) {

	// Exit if message was sent by a bot
	if (message.author.bot) return;

	// Exit if prefix missing
	if (!message.content.startsWith(_config.cfg.prefix) && _config.cfg.warbotOnlyChannels.includes(message.channel.name)) {
		message.delete().catch(function (cantDel) {
			return console.log(cantDel);
		});
		return helpers.reply(message, 'Only ' + _strings.strings.botName + ' commands are allowed in this channel');
	}
	if (!message.content.startsWith(_config.cfg.prefix)) return;

	var msg = message.content;
	var args = message.content.slice(_config.cfg.prefix.length).split(/\s+/g);
	var commandName = args.shift().toLowerCase();
	var command = client.commands.get(commandName) || client.commands.find(function (cmd) {
		return cmd.aliases && cmd.aliases.includes(commandName);
	});

	// Delete message if possible
	if (message.channel.type == 'text') message.delete().catch(function (cantDel) {
		return console.log(cantDel);
	});

	// Prefix used, but wrong or disabled command
	// if (!command) return;
	if (!command) return helpers.reply(message, '' + _strings.strings.unknownCommand, 4000);

	// Server only command use inside DM
	if (command.guildOnly && message.channel.type !== 'text') return message.reply('' + _strings.strings.serverCommandUsedOutsideServer);

	// TESTING PURPOSES ONLY!!!
	if ((_config.cfg.devMode || _config.cfg.testMode) && message.author.id !== '140437382704005130' && message.channel.type !== 'text') return message.channel.send(_strings.strings.botName + ' is under testing. Only **PGL_Ace#4831** has DM command permissions, at this time.');
	if (_config.cfg.devMode && message.channel.type == 'text' && !message.member.roles.some(function (role) {
		return _config.cfg.botTestModeRoles.includes(role.name);
	}) && message.author.id !== '140437382704005130') {
		return helpers.reply(message, _strings.strings.botName + ' is in development mode. Only PUG Helpers & EZ members have permissions at this time.', 3000);
	}

	// Cooldown / Timeout
	if (talkedRecently.has(message.author.id)) return helpers.reply(message, 'you\'re on cooldown... Wait a few seconds.');else {
		if (message.author.id !== '140437382704005130') talkedRecently.add(message.author.id);
		setTimeout(function () {
			return talkedRecently.delete(message.author.id);
		}, 4000);
	}

	// Non-admin using an admin command
	if (command.botModRoleRequired && !message.member.roles.some(function (role) {
		return _config.cfg.botModeratorRoles.includes(role.name);
	})) return helpers.reply(message, '' + _strings.strings.commandRequiresAdmin);
	if (command.staffRoleRequired && !message.member.roles.some(function (role) {
		return _config.cfg.adminRoles.includes(role.name);
	})) return helpers.reply(message, '' + _strings.strings.commandRequiresAdmin);

	// PUG command in non-pug channel
	if (command.pugCommand && !_config.cfg.pugTextChannels.includes(message.channel.name)) return helpers.reply(message, '' + _strings.strings.pugCommandInNonPugChannel, 5000);

	// No arguments provided when required (Check for missingArgsMessage)
	if (command.argsRequired && !args.length) {
		var reply = '' + _strings.strings.noArgsDefault;
		if (command.missingArgsMessage) reply = '' + command.missingArgsMessage;
		if (command.usage) reply += '\n\n' + _strings.strings.commandUsageHeader + ' `' + _config.cfg.prefix + command.name + ' ' + command.usage + '`';
		if (command.example) reply += '\n***Example: ***`' + _config.cfg.prefix + command.name + ' ' + command.example + '`';
		if (command.afterExample) reply += '\n\n' + command.afterExample;
		if (command.replyDelay) return helpers.reply(message, reply, command.replyDelay * 1000);
		return helpers.reply(message, reply, 6000);
	}

	// Log all valid commands, even if rejected/incorrect
	var date = new Date();
	var action = 'COMMAND';
	if (command.botModRoleRequired) action = 'ADMIN  ';
	if (_config.cfg.enableLogging) console.log(date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + '  ' + action + '  ' + message.author.tag + '  ' + msg);

	// Try to execute valid commands
	try {
		command.execute(message, args, command, _config.cfg);
	} catch (err) {
		console.error('User: ' + message.author.tag + '\nCommand: ' + message.content + '\nError:\n', err);
		var _reply = _strings.strings.commandError + ' `' + message.content + '`';
		_reply += '\nFor <@140437382704005130> to debug: *' + err + '*';
		message.reply(_reply);
	}

	// Reset Status if changed
	if (client.user.presence.game.name !== _strings.strings.botStatus) {
		client.user.setActivity('' + _strings.strings.botStatus, { type: 'PLAYING' });
		console.log('Activity Reset: Playing ' + _config.cfg.prefix + 'help');
	}
});

process.on('unhandledRejection', function (err) {
	return console.error('Uncaught Promise Rejection', err);
});

client.on('messageReactionRemove', function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(reaction, user) {
		var embed, i;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (!(user.id == client.user.id || reaction.message.author.id !== client.user.id || _config.cfg.requireReadyUp)) {
							_context.next = 2;
							break;
						}

						return _context.abrupt('return');

					case 2:
						if (!(reaction.message.id !== pug.startQuestion.id)) {
							_context.next = 4;
							break;
						}

						return _context.abrupt('return');

					case 4:
						if (!(reaction.emoji.name !== pug.voteReactions[0])) {
							_context.next = 6;
							break;
						}

						return _context.abrupt('return');

					case 6:
						embed = pug.startQuestionEmbed;

						embed.description = '';
						for (i = 0; i < pug.startCount && i < pug.queue.length; i++) {
							if (reaction.users.map(function (u) {
								return u.id;
							}).includes(pug.queue[i])) embed.description += '\n#' + (i + 1) + ' <@' + pug.queue[i] + '>  *Ready*';else embed.description += '\n#' + (i + 1) + ' <@' + pug.queue[i] + '>';
						}
						_context.next = 11;
						return pug.startQuestion.edit({ embed: embed }).catch(function (err) {
							return console.log(err);
						});

					case 11:
						pug.startQuestionEmbed = embed;

					case 12:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

client.on('messageReactionAdd', function (reaction, user) {
	if (user.id == client.user.id || reaction.message.author.id !== client.user.id || !Object.keys(states.pug).slice(2).includes(pug.state)) return;
	if ([pug.startMsg.id, pug.finalPlayersMsg.id].includes(reaction.message.id) && reaction.emoji.name == 'stop' && pug.players.includes(user.id)) return;
	if (!pug.voteReactions.includes(reaction.emoji.name) || !pug.players.includes(user.id)) reaction.remove(user.id);else if ((!pug.voteReactions.includes(reaction.emoji.name) || !pug.captains.includes(user.id)) && pug.captainsOnlyVote) reaction.remove(user.id);
});

client.on('voiceStateUpdate', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(oldMember, newMember) {
		var readyChannel, newUserChannel;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						if (_config.cfg.unmuteToReady) {
							_context2.next = 2;
							break;
						}

						return _context2.abrupt('return');

					case 2:
						if (!(oldMember.id !== newMember.id)) {
							_context2.next = 4;
							break;
						}

						return _context2.abrupt('return');

					case 4:
						if (pug.players.includes(newMember.id)) {
							_context2.next = 6;
							break;
						}

						return _context2.abrupt('return');

					case 6:
						if (!(pug.state !== 'ready')) {
							_context2.next = 8;
							break;
						}

						return _context2.abrupt('return');

					case 8:
						readyChannel = pug.waitingRoom;
						newUserChannel = newMember.voiceChannel;

						if (!(newUserChannel == readyChannel && !newMember.mute)) {
							_context2.next = 21;
							break;
						}

						if (!pug.ready.includes('X' + newMember.id)) {
							_context2.next = 16;
							break;
						}

						_context2.next = 14;
						return pug.ready.splice(pug.ready.indexOf('X' + newMember.id), 1, newMember.id);

					case 14:
						_context2.next = 19;
						break;

					case 16:
						if (!(!pug.ready.includes(newMember.id) && !pug.ready.includes('X' + newMember.id))) {
							_context2.next = 19;
							break;
						}

						_context2.next = 19;
						return pug.ready.push(newMember.id);

					case 19:
						_context2.next = 25;
						break;

					case 21:
						if (!(newMember.mute || newUserChannel !== readyChannel)) {
							_context2.next = 25;
							break;
						}

						if (!pug.ready.includes(newMember.id)) {
							_context2.next = 25;
							break;
						}

						_context2.next = 25;
						return pug.ready.splice(pug.ready.indexOf(newMember.id), 1, 'X' + newMember.id);

					case 25:
						_context2.next = 27;
						return pug.teams(pug.startMsg, 1);

					case 27:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function (_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}());

client.on('presenceUpdate', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(oldMember, newMember) {
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						// Reset Status if changed
						if (client.user.presence.game.name !== _strings.strings.botStatus) {
							client.user.setActivity('' + _strings.strings.botStatus, { type: 'PLAYING' });
							console.log('Activity Reset: Playing ' + _config.cfg.prefix + 'help');
						}
						// PUG players going offline

						if (!(oldMember.id !== newMember.id)) {
							_context3.next = 3;
							break;
						}

						return _context3.abrupt('return');

					case 3:
						if (pug.queue.includes(oldMember.id)) {
							_context3.next = 5;
							break;
						}

						return _context3.abrupt('return');

					case 5:
						if (!(pug.state !== 'waiting')) {
							_context3.next = 7;
							break;
						}

						return _context3.abrupt('return');

					case 7:
						if (!(oldMember.presence.status !== 'offline' && newMember.presence.status == 'offline')) {
							_context3.next = 12;
							break;
						}

						pug.queue.splice(pug.queue.indexOf(oldMember.id), 1);
						pug.teamMsg.channel.send('<@' + oldMember.id + '> ' + _strings.strings.leftPugQueueOffline + '  **' + pug.queue.length + ' Players**');
						_context3.next = 12;
						return pug.teams(pug.teamMsg, 1);

					case 12:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function (_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}());

client.on('ready', function () {
	if (_config.cfg.prefix == '') return console.log('\n Error: Please correctly set \'prefix\' in config.js and restart the bot!');
	if (_config.cfg.hostName == '') _config.cfg.hostName = _strings.strings.botName;
	console.log('Connected!\nLogged in as: ' + client.user.tag + ' (' + client.user.username + ' ' + _package.version + ') #' + client.user.id);
	client.user.setActivity('' + _strings.strings.botStatus, { type: 'PLAYING' });
});

client.login(_token.token);