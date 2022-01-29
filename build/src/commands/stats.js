'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _config = require('../../settings/config.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_sqlite2.default.open('./src/assets/warbot.sqlite');

exports.default = {
	name: 'stats',
	aliases: ['rank', 'level', 'lvl', 'about', 'info'],
	guildOnly: true,
	description: 'Display stats & info about yourself or others.',
	usage: '<@user>',
	execute: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message) {
			var _this = this;

			var userRank, pugs, fields, embed, member;
			return regeneratorRuntime.wrap(function _callee3$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							userRank = 'Member';
							pugs = 0;
							fields = [{
								"name": 'User',
								"value": '<@' + message.author.id + '>\n\u3164',
								"inline": true
							}, {
								"name": 'ID',
								"value": message.author.id + '\n\u3164',
								"inline": true
							}, {
								"name": 'PUGs Played',
								"value": pugs + '\n\u3164',
								"inline": true
							}, {
								"name": 'Rank',
								"value": userRank + '\n\u3164',
								"inline": true
							}];
							_context3.next = 5;
							return helpers.initEmbed(message);

						case 5:
							embed = _context3.sent;
							member = message.guild.members.get(message.author.id);
							// embed.image = {}

							embed.fields = fields;

							if (message.mentions.users.size) {
								_context3.next = 13;
								break;
							}

							embed.title = '**Stats & Info for ' + message.author.tag + '**';
							// embed.image.url = `${message.author.displayAvatarURL}`
							embed.thumbnail.url = '' + message.author.displayAvatarURL;
							_context3.next = 19;
							break;

						case 13:
							if (!(message.mentions.users.size == 1)) {
								_context3.next = 17;
								break;
							}

							message.mentions.users.map(function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													embed.title = '**Stats & Info for ' + user.tag + '**';
													// embed.image.url = `${user.displayAvatarURL}`
													embed.thumbnail.url = '' + user.displayAvatarURL;
													embed.fields[0].value = '<@' + user.id + '>\n\u3164';
													embed.fields[1].value = user.id + '\n\u3164';
													member = message.guild.members.get(user.id);

												case 5:
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
							_context3.next = 19;
							break;

						case 17:
							if (!(message.mentions.users.size > 1)) {
								_context3.next = 19;
								break;
							}

							return _context3.abrupt('return', helpers.reply(message, 'please mention 1 person, per command', 5000));

						case 19:
							_context3.next = 21;
							return _sqlite2.default.get('SELECT * FROM stats WHERE userID = ' + member.user.id).then(function () {
								var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(row) {
									return regeneratorRuntime.wrap(function _callee2$(_context2) {
										while (1) {
											switch (_context2.prev = _context2.next) {
												case 0:
													if (row) {
														_context2.next = 5;
														break;
													}

													_context2.next = 3;
													return _sqlite2.default.run('INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)', [member.user.id, 0, userRank]);

												case 3:
													_context2.next = 15;
													break;

												case 5:
													if (!(row.pugs > _config.cfg.proPlayerRolePugCount && row.rank !== _config.cfg.proPlayerRole)) {
														_context2.next = 9;
														break;
													}

													row.rank = _config.cfg.proPlayerRole;
													_context2.next = 9;
													return _sqlite2.default.run('UPDATE stats SET rank = \'' + row.rank + '\' WHERE userID = ' + member.user.id).catch(function (err) {
														return console.log(err);
													});

												case 9:
													_context2.next = 11;
													return row.pugs;

												case 11:
													embed.fields[2].value = _context2.sent;
													_context2.next = 14;
													return row.rank;

												case 14:
													embed.fields[3].value = _context2.sent;

												case 15:
												case 'end':
													return _context2.stop();
											}
										}
									}, _callee2, _this);
								}));

								return function (_x3) {
									return _ref3.apply(this, arguments);
								};
							}()).catch(function () {
								_sqlite2.default.run('CREATE TABLE IF NOT EXISTS stats (userID TEXT, pugs INTEGER, rank TEXT)').then(function () {
									_sqlite2.default.run('INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)', [member.user.id, 0, userRank]);
								});
							});

						case 21:
							message.channel.send({ embed: embed });

						case 22:
						case 'end':
							return _context3.stop();
					}
				}
			}, _callee3, this);
		}));

		function execute(_x) {
			return _ref.apply(this, arguments);
		}

		return execute;
	}()
};