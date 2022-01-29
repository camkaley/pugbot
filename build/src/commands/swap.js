'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _pug = require('../assets/pug.js');

var pug = _interopRequireWildcard(_pug);

var _config = require('../../settings/config.js');

var _strings = require('../assets/strings.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
	name: 'swap',
	aliases: ['sw'],
	guildOnly: true,
	pugCommand: true,
	description: 'Swap in another member, replacing yourself or another PUG player',
	usage: '<@user-to-join> <@user-to-leave>',
	example: '@user-to-join',
	execute: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message, args) {
			var reply, oldPlayer, newPlayer, oldIndex, newIndex, _ref2;

			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							if (message.mentions.users.size) {
								_context.next = 4;
								break;
							}

							reply = '' + _strings.strings.noTaggedUser;

							if (this.usage) reply += '\n' + _strings.strings.commandUsageHeader + ' `' + _config.cfg.prefix + this.name + ' ' + this.usage + '`';
							return _context.abrupt('return', helpers.reply(message, reply, 6000));

						case 4:
							oldPlayer = message.author;
							newPlayer = message.mentions.users.first();

							if (!(message.mentions.users.size == 2)) {
								_context.next = 21;
								break;
							}

							_context.next = 9;
							return message.mentions.users.find(function (u) {
								return '<@' + u.id + '>' == args[0];
							});

						case 9:
							_context.t0 = _context.sent;

							if (_context.t0) {
								_context.next = 12;
								break;
							}

							_context.t0 = message.mentions.users.find(function (u) {
								return '<@!' + u.id + '>' == args[0];
							});

						case 12:
							newPlayer = _context.t0;
							_context.next = 15;
							return message.mentions.users.find(function (u) {
								return '<@' + u.id + '>' == args[1];
							});

						case 15:
							_context.t1 = _context.sent;

							if (_context.t1) {
								_context.next = 18;
								break;
							}

							_context.t1 = message.mentions.users.find(function (u) {
								return '<@!' + u.id + '>' == args[1];
							});

						case 18:
							oldPlayer = _context.t1;

							if (!(oldPlayer.id !== message.author.id && !message.member.roles.some(function (role) {
								return _config.cfg.botModeratorRoles.includes(role.name);
							}))) {
								_context.next = 21;
								break;
							}

							return _context.abrupt('return', helpers.reply(message, '' + _strings.strings.commandRequiresAdmin));

						case 21:
							if (!(oldPlayer == null || newPlayer == null)) {
								_context.next = 23;
								break;
							}

							return _context.abrupt('return', helpers.reply(message, 'please mention 1 person to swap out yourself, or 2 for swapping around others.', 8000));

						case 23:
							if (pug.queue.includes(oldPlayer.id)) {
								_context.next = 25;
								break;
							}

							return _context.abrupt('return', helpers.reply(message, '' + _strings.strings.wasntQueuedForPugOnRemove));

						case 25:
							if (pug.players.includes(oldPlayer.id)) {
								_context.next = 27;
								break;
							}

							return _context.abrupt('return', helpers.reply(message, '' + _strings.strings.notlockedPlayerOnSwap));

						case 27:
							if (!pug.players.includes(newPlayer.id)) {
								_context.next = 31;
								break;
							}

							return _context.abrupt('return', helpers.reply(message, '<@' + newPlayer.id + '> is already part of the PUG.'));

						case 31:
							if (!(message.mentions.users.size > 2)) {
								_context.next = 33;
								break;
							}

							return _context.abrupt('return', helpers.reply(message, 'please mention 1 person to swap out yourself, or 2 for swapping out others.', 8000));

						case 33:
							pug.players.splice(pug.players.indexOf(oldPlayer.id), 1, newPlayer.id);
							if (pug.ready.includes(oldPlayer.id)) pug.ready.splice(pug.ready.indexOf(oldPlayer.id), 1, newPlayer.id);
							if (pug.ready.includes('X' + oldPlayer.id)) pug.ready.splice(pug.ready.indexOf('X' + oldPlayer.id), 1, 'X' + newPlayer.id);
							if (pug.captains.includes(oldPlayer.id)) pug.captains.splice(pug.captains.indexOf(oldPlayer.id), 1, newPlayer.id);
							if (pug.teamOne.includes(oldPlayer.id)) pug.teamOne.splice(pug.teamOne.indexOf(oldPlayer.id), 1, newPlayer.id);
							if (pug.teamTwo.includes(oldPlayer.id)) pug.teamTwo.splice(pug.teamTwo.indexOf(oldPlayer.id), 1, newPlayer.id);
							if (pug.queue.includes(newPlayer.id)) {
								oldIndex = pug.queue.indexOf(oldPlayer.id);
								newIndex = pug.queue.indexOf(newPlayer.id);
								_ref2 = [pug.queue[newIndex], pug.queue[oldIndex]];
								pug.queue[oldIndex] = _ref2[0];
								pug.queue[newIndex] = _ref2[1];
							} else pug.queue.splice(pug.queue.indexOf(oldPlayer.id), 1, newPlayer.id);
							message.channel.send('<@' + newPlayer.id + '> subbed in for <@' + oldPlayer.id + '>');
							_context.next = 43;
							return pug.teams(message, 1);

						case 43:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, this);
		}));

		function execute(_x, _x2) {
			return _ref.apply(this, arguments);
		}

		return execute;
	}()
};