'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _pug = require('../assets/pug.js');

var pug = _interopRequireWildcard(_pug);

var _config = require('../../settings/config.js');

var _strings = require('../assets/strings.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_sqlite2.default.open('./src/assets/warbot.sqlite');
exports.default = {
	name: 'force',
	botModRoleRequired: true,
	guildOnly: true,
	pugCommand: true,
	description: 'Prefix command, to be used with other commands.\nCan be used to do things like edit user stats.',
	argsRequired: true,
	usage: '<command> <args>',
	example: 'xp @user +1',
	execute: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message, args) {
			var _this = this;

			var cmd, defaultRank, userRank, changed;
			return regeneratorRuntime.wrap(function _callee3$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							cmd = args[0], defaultRank = 'Member';
							userRank = defaultRank, changed = false;
							_context3.t0 = true;
							_context3.next = _context3.t0 === ['pugs', 'xp', 'stats'].includes(cmd) ? 5 : _context3.t0 === ['stop', 'reset', 'end'].includes(cmd) ? 12 : 17;
							break;

						case 5:
							if (message.mentions.members.size) {
								_context3.next = 7;
								break;
							}

							return _context3.abrupt('return', helpers.reply(message, '' + _strings.strings.noTaggedUser));

						case 7:
							if (args[2]) {
								_context3.next = 9;
								break;
							}

							return _context3.abrupt('return', helpers.reply(message, 'Incorrect use. Try `' + _config.cfg.prefix + this.name + ' ' + cmd + ' @user +1` or `' + _config.cfg.prefix + 'help ' + this.name + '` for more info.', 9000));

						case 9:
							_context3.next = 11;
							return message.mentions.users.map(function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user) {
									var member, vetRole, newPugsPlayed, editMethod;
									return regeneratorRuntime.wrap(function _callee2$(_context2) {
										while (1) {
											switch (_context2.prev = _context2.next) {
												case 0:
													member = message.guild.members.get(user.id);
													vetRole = message.guild.roles.find(function (role) {
														return role.name == _config.cfg.proPlayerRole;
													});
													newPugsPlayed = parseInt(args[2]), editMethod = 'total';

													if (args[2].includes('+')) {
														newPugsPlayed = parseInt(args[2].slice(1));
														editMethod = 'increase';
													}
													if (args[2].includes('-')) editMethod = 'decrease';

													if (!isNaN(newPugsPlayed)) {
														_context2.next = 7;
														break;
													}

													return _context2.abrupt('return', helpers.reply(message, '' + _strings.strings.notNumber));

												case 7:
													_context2.next = 9;
													return _sqlite2.default.get('SELECT * FROM stats WHERE userID = ' + user.id).then(function () {
														var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(row) {
															return regeneratorRuntime.wrap(function _callee$(_context) {
																while (1) {
																	switch (_context.prev = _context.next) {
																		case 0:
																			if (newPugsPlayed > _config.cfg.proPlayerRolePugCount) {
																				member.addRole(vetRole).catch(function (err) {
																					return console.log(err);
																				});
																				userRank = _config.cfg.proPlayerRole;
																			}
																			if (newPugsPlayed < _config.cfg.proPlayerRolePugCount) {
																				member.removeRole(vetRole).catch(function (err) {
																					return console.log(err);
																				});
																				userRank = defaultRank;
																			}

																			if (row) {
																				_context.next = 8;
																				break;
																			}

																			if (editMethod == 'decrease') newPugsPlayed = 0;
																			_sqlite2.default.run('INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)', [user.id, newPugsPlayed, userRank]).catch(function (err) {
																				return console.log('B1', err);
																			});
																			changed = true;
																			_context.next = 13;
																			break;

																		case 8:
																			if (editMethod !== 'total') newPugsPlayed = row.pugs + newPugsPlayed;
																			if (newPugsPlayed < 0) newPugsPlayed = 0;
																			_context.next = 12;
																			return _sqlite2.default.run('UPDATE stats SET pugs = ' + newPugsPlayed + ', rank = \'' + userRank + '\' WHERE userID = ' + user.id).catch(function (err) {
																				return console.log(err);
																			});

																		case 12:
																			changed = true;

																		case 13:
																		case 'end':
																			return _context.stop();
																	}
																}
															}, _callee, _this);
														}));

														return function (_x4) {
															return _ref3.apply(this, arguments);
														};
													}()).catch(function () {
														_sqlite2.default.run('CREATE TABLE IF NOT EXISTS stats (userID TEXT, pugs INTEGER, rank TEXT)').then(function () {
															if (newPugsPlayed > _config.cfg.proPlayerRolePugCount) {
																member.addRole(vetRole).catch(function (err) {
																	return console.log(err);
																});
																userRank = _config.cfg.proPlayerRole;
															}
															if (newPugsPlayed < _config.cfg.proPlayerRolePugCount) {
																member.removeRole(vetRole).catch(function (err) {
																	return console.log(err);
																});
																userRank = defaultRank;
															}
															if (editMethod == 'decrease') newPugsPlayed = 0;
															_sqlite2.default.run('INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)', [user.id, newPugsPlayed, userRank]).catch(function (err) {
																return console.log(err);
															});
															changed = true;
														}).catch(function (err) {
															return console.log(err);
														});
													});

												case 9:
													if (changed) {
														if (message.author.id == member.user.id) message.channel.send('**<@' + message.author.id + '> edited their stats**');else message.channel.send('**<@' + message.author.id + '> edited stats for <@' + user.id + '>**');
													}

												case 10:
												case 'end':
													return _context2.stop();
											}
										}
									}, _callee2, _this);
								}));

								return function (_x3) {
									return _ref2.apply(this, arguments);
								};
							}());

						case 11:
							return _context3.abrupt('break', 18);

						case 12:
							if (pug.queue[0]) {
								_context3.next = 14;
								break;
							}

							return _context3.abrupt('return', helpers.reply(message, 'No players queued for the PUG.'));

						case 14:
							_context3.next = 16;
							return pug.end(message, '`' + message.content + '` command used by <@' + message.author.id + '>');

						case 16:
							return _context3.abrupt('break', 18);

						case 17:
							return _context3.abrupt('return', helpers.reply(message, 'Please provide a valid command function. Try `' + _config.cfg.prefix + 'help ' + this.name + '` for more info'));

						case 18:
						case 'end':
							return _context3.stop();
					}
				}
			}, _callee3, this);
		}));

		function execute(_x, _x2) {
			return _ref.apply(this, arguments);
		}

		return execute;
	}()
};