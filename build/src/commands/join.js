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
	name: 'join',
	aliases: ['add'],
	guildOnly: true,
	pugCommand: true,
	description: 'Join the PUG waiting list.',
	usage: '<@user>',
	example: '@user1 @user2 @etc',
	execute: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message) {
			var _this = this;

			var mentions, startHit, newStartCount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, player;

			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							mentions = [];
							startHit = false;

							if (!(message.mentions.users.size > pug.startCount)) {
								_context2.next = 4;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, 'You may only add a max of ' + pug.startCount + ' players, at a time.'));

						case 4:
							newStartCount = pug.startCount;

							if (pug.queue.length >= pug.startCount) newStartCount = pug.startCount * Math.floor(pug.queue.length / pug.startCount);

							if (message.mentions.users.size) {
								_context2.next = 25;
								break;
							}

							if (!pug.queue.includes(message.author.id)) {
								_context2.next = 9;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, '' + _strings.strings.alreadyInPugQueue));

						case 9:
							_context2.next = 11;
							return pug.queue.push(message.author.id);

						case 11:
							_context2.next = 13;
							return helpers.reply(message, '<@' + message.author.id + '> ' + _strings.strings.joinedPugQueue, pug.voteDelay * 2, true);

						case 13:
							if (!(pug.queue.length == newStartCount)) {
								_context2.next = 20;
								break;
							}

							_context2.next = 16;
							return pug.startCount;

						case 16:
							_context2.t0 = _context2.sent;
							_context2.t1 = Math.floor(pug.queue.length / pug.startCount);
							newStartCount = _context2.t0 * _context2.t1;

							startHit = true;

						case 20:
							if (!(!startHit || pug.state == 'startCheck')) {
								_context2.next = 23;
								break;
							}

							_context2.next = 23;
							return pug.teams(message, 1);

						case 23:
							_context2.next = 78;
							break;

						case 25:
							if (!((message.mentions.users.size > 1 || message.mentions.users.first().id !== message.author.id) && !message.member.roles.some(function (role) {
								return _config.cfg.botModeratorRoles.includes(role.name);
							}))) {
								_context2.next = 27;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, 'Just type `' + _config.cfg.prefix + 'join`, as only Bot Moderators may @mention others.'));

						case 27:
							message.mentions.users.map(function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													if (pug.queue.includes(user.id)) {
														_context.next = 3;
														break;
													}

													_context.next = 3;
													return mentions.push(user.id);

												case 3:
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

							if (mentions.length) {
								_context2.next = 30;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, 'they are already queued for the PUG.'));

						case 30:
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context2.prev = 33;
							_iterator = mentions[Symbol.iterator]();

						case 35:
							if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
								_context2.next = 49;
								break;
							}

							player = _step.value;
							_context2.next = 39;
							return pug.queue.push(player);

						case 39:
							if (!(pug.queue.length == newStartCount)) {
								_context2.next = 46;
								break;
							}

							_context2.next = 42;
							return pug.startCount;

						case 42:
							_context2.t2 = _context2.sent;
							_context2.t3 = Math.floor(pug.queue.length / pug.startCount);
							newStartCount = _context2.t2 * _context2.t3;

							startHit = true;

						case 46:
							_iteratorNormalCompletion = true;
							_context2.next = 35;
							break;

						case 49:
							_context2.next = 55;
							break;

						case 51:
							_context2.prev = 51;
							_context2.t4 = _context2['catch'](33);
							_didIteratorError = true;
							_iteratorError = _context2.t4;

						case 55:
							_context2.prev = 55;
							_context2.prev = 56;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 58:
							_context2.prev = 58;

							if (!_didIteratorError) {
								_context2.next = 61;
								break;
							}

							throw _iteratorError;

						case 61:
							return _context2.finish(58);

						case 62:
							return _context2.finish(55);

						case 63:
							if (!(mentions[0] == message.author.id)) {
								_context2.next = 68;
								break;
							}

							_context2.next = 66;
							return helpers.reply(message, '<@' + message.author.id + '> ' + _strings.strings.joinedPugQueue, pug.voteDelay * 2, true);

						case 66:
							_context2.next = 75;
							break;

						case 68:
							if (!(mentions.length == 1)) {
								_context2.next = 73;
								break;
							}

							_context2.next = 71;
							return helpers.reply(message, '<@' + mentions[0] + '> was queued by <@' + message.author.id + '>', pug.voteDelay * 2, true);

						case 71:
							_context2.next = 75;
							break;

						case 73:
							_context2.next = 75;
							return helpers.reply(message, '<@' + mentions.slice(0, -1).join('>, <@') + '> & <@' + mentions.slice(-1) + '> were queued by <@' + message.author.id + '>', pug.voteDelay * 2, true);

						case 75:
							if (!(!startHit || pug.state == 'startCheck')) {
								_context2.next = 78;
								break;
							}

							_context2.next = 78;
							return pug.teams(message, 1);

						case 78:
							if (!(startHit && pug.state !== 'startCheck')) {
								_context2.next = 82;
								break;
							}

							_context2.next = 81;
							return helpers.delay(1000);

						case 81:
							pug.run(message);

						case 82:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, this, [[33, 51, 55, 63], [56,, 58, 62]]);
		}));

		function execute(_x) {
			return _ref.apply(this, arguments);
		}

		return execute;
	}()
};