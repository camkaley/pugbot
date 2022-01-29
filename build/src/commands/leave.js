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
	name: 'leave',
	aliases: ['remove', 'rem', 'rm'],
	guildOnly: true,
	pugCommand: true,
	description: 'Leave the PUG waiting list.',
	usage: '<@user>',
	execute: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message) {
			var _this = this;

			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (message.mentions.users.size) {
								_context2.next = 13;
								break;
							}

							if (pug.queue.includes(message.author.id)) {
								_context2.next = 3;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, '' + _strings.strings.wasntQueuedForPugOnRemove));

						case 3:
							if (!pug.players.includes(message.author.id)) {
								_context2.next = 5;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, '' + _strings.strings.lockedPlayerOnRemove));

						case 5:
							_context2.next = 7;
							return pug.queue.splice(pug.queue.indexOf(message.author.id), 1);

						case 7:
							_context2.next = 9;
							return helpers.reply(message, '<@' + message.author.id + '> ' + _strings.strings.leftPugQueue, pug.voteDelay * 2, true);

						case 9:
							_context2.next = 11;
							return pug.teams(message, 1);

						case 11:
							_context2.next = 18;
							break;

						case 13:
							if (!(message.mentions.users.size == 1)) {
								_context2.next = 17;
								break;
							}

							message.mentions.users.map(function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													if (!(user.id !== message.author.id && !message.member.roles.some(function (role) {
														return _config.cfg.botModeratorRoles.includes(role.name);
													}))) {
														_context.next = 2;
														break;
													}

													return _context.abrupt('return', helpers.reply(message, '' + _strings.strings.commandRequiresAdmin));

												case 2:
													if (pug.queue.includes(user.id)) {
														_context.next = 4;
														break;
													}

													return _context.abrupt('return', helpers.reply(message, '<@' + user.id + '> wasn\'t queued for the PUG.'));

												case 4:
													if (!pug.players.includes(user.id)) {
														_context.next = 6;
														break;
													}

													return _context.abrupt('return', helpers.reply(message, '' + _strings.strings.lockedPlayerOnRemove));

												case 6:
													_context.next = 8;
													return pug.queue.splice(pug.queue.indexOf(user.id), 1);

												case 8:
													if (!(user.id == message.author.id)) {
														_context.next = 13;
														break;
													}

													_context.next = 11;
													return helpers.reply(message, '<@' + message.author.id + '> ' + _strings.strings.leftPugQueue, pug.voteDelay * 2, true);

												case 11:
													_context.next = 15;
													break;

												case 13:
													_context.next = 15;
													return helpers.reply(message, '<@' + user.id + '> ' + _strings.strings.leftPugQueue.slice(0, _strings.strings.leftPugQueue.length - 1) + ' - *Removed by <@' + message.author.id + '>*', pug.voteDelay * 2, true);

												case 15:
													_context.next = 17;
													return pug.teams(message, 1);

												case 17:
												case 'end':
													return _context.stop();
											}
										}
									}, _callee, _this);
								}));

								return function (_x2) {
									return _ref2.apply(this, arguments);
								};
							}());
							_context2.next = 18;
							break;

						case 17:
							return _context2.abrupt('return', helpers.reply(message, 'please remove 1 person, per command', 5000));

						case 18:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, this);
		}));

		function execute(_x) {
			return _ref.apply(this, arguments);
		}

		return execute;
	}()
};