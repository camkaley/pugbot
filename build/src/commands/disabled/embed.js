"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _strings = require("../assets/strings.js");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
	name: "embed",
	aliases: ["em"],
	guildOnly: true,
	botModRoleRequired: true,
	execute: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message) {
			var _this = this;

			var embed;
			return regeneratorRuntime.wrap(function _callee3$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							embed = {
								"title": "Embed Test",
								"description": "This is to test the editing of embeds.",
								"color": 1878473,
								"author": {
									"name": "" + message.guild.name,
									"icon_url": "" + message.guild.iconURL
								},
								"footer": {
									"icon_url": "" + message.guild.iconURL,
									"text": "" + _strings.strings.author
								}
							};
							_context3.next = 3;
							return message.channel.send({ embed: embed }).then(function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(msg) {
									var emoji, reactionFilter, collector;
									return regeneratorRuntime.wrap(function _callee2$(_context2) {
										while (1) {
											switch (_context2.prev = _context2.next) {
												case 0:
													emoji = message.guild.emojis.find(function (emojis) {
														return emojis.name == "alph_a";
													});
													_context2.next = 3;
													return msg.react(emoji);

												case 3:
													reactionFilter = function reactionFilter(reaction, user) {
														return !user.bot && user.id !== msg.author.id;
													};

													_context2.next = 6;
													return msg.createReactionCollector(reactionFilter);

												case 6:
													collector = _context2.sent;
													_context2.next = 9;
													return collector.on("collect", function () {
														var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(reaction) {
															return regeneratorRuntime.wrap(function _callee$(_context) {
																while (1) {
																	switch (_context.prev = _context.next) {
																		case 0:
																			if (!(reaction.emoji.name == emoji.name)) {
																				_context.next = 4;
																				break;
																			}

																			embed.description += "\nEdited";
																			_context.next = 4;
																			return msg.edit({ embed: embed }).catch(function (err) {
																				return console.log(err);
																			});

																		case 4:
																		case "end":
																			return _context.stop();
																	}
																}
															}, _callee, _this);
														}));

														return function (_x3) {
															return _ref3.apply(this, arguments);
														};
													}());

												case 9:
												case "end":
													return _context2.stop();
											}
										}
									}, _callee2, _this);
								}));

								return function (_x2) {
									return _ref2.apply(this, arguments);
								};
							}()).catch(function (err) {
								return console.log(err);
							});

						case 3:
						case "end":
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