'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _strings = require('../assets/strings.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_sqlite2.default.open('./src/assets/warbot.sqlite');

exports.default = {
	name: 'top',
	aliases: ['leaders', 'leaderboards'],
	guildOnly: true,
	description: 'Display the leaderboard.',
	usage: '<@user>',
	execute: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message) {
			var _this = this;

			var fields, embed;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							fields = [{
								"name": '#1-10',
								"value": '',
								"inline": true
							}, {
								"name": '\u3164',
								"value": '',
								"inline": true
							}, {
								"name": '#11-20',
								"value": '',
								"inline": true
							}, {
								"name": '\u3164',
								"value": '',
								"inline": true
							}];
							_context2.next = 3;
							return helpers.initEmbed(message, 1);

						case 3:
							embed = _context2.sent;

							delete embed.image;
							embed.title = '**Top Players**';
							embed.description = _strings.strings.botName + ' Leaderboards (PUGs Played)';
							_context2.next = 9;
							return _sqlite2.default.all('SELECT * FROM stats ORDER BY pugs DESC LIMIT 20').then(function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(rows) {
									var i, _i, _i2, _i3;

									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													if (rows.length > 0) {
														embed.fields[0] = fields[0];
														for (i = 0; i < 5 && i < rows.length; i++) {
															embed.fields[0].value += '\n' + rows[i].pugs + '    <@' + rows[i].userID + '>';
														}
													}
													if (rows.length > 5) {
														embed.fields[1] = fields[1];
														for (_i = 5; _i < 10 && _i < rows.length; _i++) {
															embed.fields[1].value += '\n' + rows[_i].pugs + '    <@' + rows[_i].userID + '>';
														}
													}
													if (rows.length > 10) {
														embed.fields[2] = fields[2];
														for (_i2 = 10; _i2 < 15 && _i2 < rows.length; _i2++) {
															embed.fields[2].value += '\n' + rows[_i2].pugs + '    <@' + rows[_i2].userID + '>';
														}
													}
													if (rows.length > 15) {
														embed.fields[3] = fields[3];
														for (_i3 = 15; _i3 < 20 && _i3 < rows.length; _i3++) {
															embed.fields[3].value += '\n' + rows[_i3].pugs + '    <@' + rows[_i3].userID + '>';
														}
													}

												case 4:
												case 'end':
													return _context.stop();
											}
										}
									}, _callee, _this);
								}));

								return function (_x2) {
									return _ref2.apply(this, arguments);
								};
							}()).catch(function () {
								embed.description = '\u3164\nLeaderboard unavailable\n\u3164';
							});

						case 9:
							message.channel.send({ embed: embed });

						case 10:
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