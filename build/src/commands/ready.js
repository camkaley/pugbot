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
	name: 'ready',
	aliases: ['rdy'],
	guildOnly: true,
	pugCommand: true,
	description: 'Ready up for the PUG, once teams are set.',
	usage: '<@user>',
	example: 'all',
	execute: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message, args) {
			var _this = this;

			var mentions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, player, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _player;

			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							mentions = [];

							if (!(pug.state !== 'ready')) {
								_context2.next = 3;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, 'you can\'t ready up at this time.'));

						case 3:
							if (message.mentions.users.size) {
								_context2.next = 52;
								break;
							}

							if (!(args[0] == 'all')) {
								_context2.next = 41;
								break;
							}

							if (message.member.roles.some(function (role) {
								return _config.cfg.botModeratorRoles.includes(role.name);
							})) {
								_context2.next = 7;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, '' + _strings.strings.commandRequiresAdmin));

						case 7:
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context2.prev = 10;
							_iterator = pug.players[Symbol.iterator]();

						case 12:
							if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
								_context2.next = 25;
								break;
							}

							player = _step.value;

							if (!pug.ready.includes('X' + player)) {
								_context2.next = 19;
								break;
							}

							_context2.next = 17;
							return pug.ready.splice(pug.ready.indexOf('X' + player), 1, player);

						case 17:
							_context2.next = 22;
							break;

						case 19:
							if (pug.ready.includes(player)) {
								_context2.next = 22;
								break;
							}

							_context2.next = 22;
							return pug.ready.push(player);

						case 22:
							_iteratorNormalCompletion = true;
							_context2.next = 12;
							break;

						case 25:
							_context2.next = 31;
							break;

						case 27:
							_context2.prev = 27;
							_context2.t0 = _context2['catch'](10);
							_didIteratorError = true;
							_iteratorError = _context2.t0;

						case 31:
							_context2.prev = 31;
							_context2.prev = 32;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 34:
							_context2.prev = 34;

							if (!_didIteratorError) {
								_context2.next = 37;
								break;
							}

							throw _iteratorError;

						case 37:
							return _context2.finish(34);

						case 38:
							return _context2.finish(31);

						case 39:
							_context2.next = 50;
							break;

						case 41:
							if (pug.players.includes(message.author.id)) {
								_context2.next = 45;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, '' + _strings.strings.wasntInPugOnReady));

						case 45:
							if (!pug.ready.includes(message.author.id)) {
								_context2.next = 49;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, 'you are already ready.'));

						case 49:
							if (pug.ready.includes('X' + message.author.id)) pug.ready.splice(pug.ready.indexOf(message.author.id), 1, message.author.id);else pug.ready.push(message.author.id);

						case 50:
							_context2.next = 89;
							break;

						case 52:
							if (message.member.roles.some(function (role) {
								return _config.cfg.botModeratorRoles.includes(role.name);
							})) {
								_context2.next = 54;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, '' + _strings.strings.commandRequiresAdmin));

						case 54:
							message.mentions.users.map(function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													if (!(pug.players.includes(user.id) && !pug.ready.includes(user.id))) {
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

								return function (_x3) {
									return _ref2.apply(this, arguments);
								};
							}());

							if (mentions.length) {
								_context2.next = 57;
								break;
							}

							return _context2.abrupt('return', helpers.reply(message, 'you can\'t ready them at this time.'));

						case 57:
							_iteratorNormalCompletion2 = true;
							_didIteratorError2 = false;
							_iteratorError2 = undefined;
							_context2.prev = 60;
							_iterator2 = mentions[Symbol.iterator]();

						case 62:
							if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
								_context2.next = 75;
								break;
							}

							_player = _step2.value;

							if (!pug.ready.includes('X' + _player)) {
								_context2.next = 69;
								break;
							}

							_context2.next = 67;
							return pug.ready.splice(pug.ready.indexOf('X' + _player), 1, _player);

						case 67:
							_context2.next = 72;
							break;

						case 69:
							if (pug.ready.includes(_player)) {
								_context2.next = 72;
								break;
							}

							_context2.next = 72;
							return pug.ready.push(_player);

						case 72:
							_iteratorNormalCompletion2 = true;
							_context2.next = 62;
							break;

						case 75:
							_context2.next = 81;
							break;

						case 77:
							_context2.prev = 77;
							_context2.t1 = _context2['catch'](60);
							_didIteratorError2 = true;
							_iteratorError2 = _context2.t1;

						case 81:
							_context2.prev = 81;
							_context2.prev = 82;

							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}

						case 84:
							_context2.prev = 84;

							if (!_didIteratorError2) {
								_context2.next = 87;
								break;
							}

							throw _iteratorError2;

						case 87:
							return _context2.finish(84);

						case 88:
							return _context2.finish(81);

						case 89:
							_context2.next = 91;
							return pug.teams(message, 1);

						case 91:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, this, [[10, 27, 31, 39], [32,, 34, 38], [60, 77, 81, 89], [82,, 84, 88]]);
		}));

		function execute(_x, _x2) {
			return _ref.apply(this, arguments);
		}

		return execute;
	}()
};