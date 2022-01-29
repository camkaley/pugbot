'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _config = require('../../settings/config.js');

var _strings = require('../assets/strings.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
	name: 'team',
	guildOnly: true,
	argsRequired: true,
	description: 'Create/Edit/Join a team for events.',
	usage: '<action> <arg>',
	example: 'create My Team Name',
	execute: function execute(message, args) {
		var _this = this;

		if (args.length < 2) return helpers.reply(message, 'Invalid command use. Try `' + _config.cfg.prefix + 'help ' + this.name + '` for more info');
		var cmd = args[0];
		var teamName = args.slice(1, args.length).join(' ');
		switch (true) {
			case cmd == 'create':
				{
					if (message.guild.roles.find(function (r) {
						return r.name == teamName;
					})) return helpers.reply(message, 'This team already exists');
					helpers.makeRole(message, teamName).then(function () {
						var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(teamRole) {
							var voteOptions, voteResults, voteReactions, joinedEvents, embed, _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, chanName, i, embedMsg, _loop2, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, emoji, reactionFilter, collector, complete, _loop3, _i2, _loop4, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _chanName;

							return regeneratorRuntime.wrap(function _callee4$(_context6) {
								while (1) {
									switch (_context6.prev = _context6.next) {
										case 0:
											voteOptions = [];
											voteResults = [];
											voteReactions = [];
											joinedEvents = [];
											_context6.next = 6;
											return helpers.initEmbed(message, 1);

										case 6:
											embed = _context6.sent;

											console.log('Team created by ' + message.author.tag + ': ' + teamRole.name);

											if (!_config.cfg.announcementChannels) {
												_context6.next = 29;
												break;
											}

											_loop = function _loop(chanName) {
												var textChan = message.guild.channels.find(function (chan) {
													return chan.name == chanName;
												});
												textChan.send('**<@' + message.author.id + '> created a team:** <@&' + teamRole.id + '>');
											};

											_iteratorNormalCompletion = true;
											_didIteratorError = false;
											_iteratorError = undefined;
											_context6.prev = 13;

											for (_iterator = _config.cfg.announcementChannels[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
												chanName = _step.value;

												_loop(chanName);
											}
											_context6.next = 21;
											break;

										case 17:
											_context6.prev = 17;
											_context6.t0 = _context6['catch'](13);
											_didIteratorError = true;
											_iteratorError = _context6.t0;

										case 21:
											_context6.prev = 21;
											_context6.prev = 22;

											if (!_iteratorNormalCompletion && _iterator.return) {
												_iterator.return();
											}

										case 24:
											_context6.prev = 24;

											if (!_didIteratorError) {
												_context6.next = 27;
												break;
											}

											throw _iteratorError;

										case 27:
											return _context6.finish(24);

										case 28:
											return _context6.finish(21);

										case 29:
											delete embed.thumbnail;
											embed.title = '**Team Registration**';
											embed.description = '' + teamRole.name;
											embed.fields[0].name = 'Events';
											embed.fields[0].value = '';
											message.member.addRole(teamRole).catch(function (err) {
												return console.log(err);
											});
											message.guild.roles.map(function (role) {
												if (role.name.includes('Event:')) voteOptions.push(role);
											});
											for (i = 0; i < voteOptions.length; i++) {
												embed.fields[0].value += '\n:regional_indicator_' + helpers.alphabet[i] + ': - ' + voteOptions[i];
												voteReactions[i] = 'alph_' + helpers.alphabet[i];
												voteResults[i] = '0';
											}
											if (!voteOptions.length) embed.fields[0].value += 'No Events Available';
											embed.fields[0].value += '\n\n:white_check_mark: - Done';
											_context6.next = 41;
											return message.channel.send({ embed: embed });

										case 41:
											embedMsg = _context6.sent;
											_loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2(item) {
												var emoji;
												return regeneratorRuntime.wrap(function _loop2$(_context4) {
													while (1) {
														switch (_context4.prev = _context4.next) {
															case 0:
																emoji = message.guild.emojis.find(function (emojis) {
																	return emojis.name == item;
																});
																_context4.next = 3;
																return embedMsg.react(emoji);

															case 3:
															case 'end':
																return _context4.stop();
														}
													}
												}, _loop2, _this);
											});
											_iteratorNormalCompletion2 = true;
											_didIteratorError2 = false;
											_iteratorError2 = undefined;
											_context6.prev = 46;
											_iterator2 = voteReactions[Symbol.iterator]();

										case 48:
											if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
												_context6.next = 54;
												break;
											}

											item = _step2.value;
											return _context6.delegateYield(_loop2(item), 't1', 51);

										case 51:
											_iteratorNormalCompletion2 = true;
											_context6.next = 48;
											break;

										case 54:
											_context6.next = 60;
											break;

										case 56:
											_context6.prev = 56;
											_context6.t2 = _context6['catch'](46);
											_didIteratorError2 = true;
											_iteratorError2 = _context6.t2;

										case 60:
											_context6.prev = 60;
											_context6.prev = 61;

											if (!_iteratorNormalCompletion2 && _iterator2.return) {
												_iterator2.return();
											}

										case 63:
											_context6.prev = 63;

											if (!_didIteratorError2) {
												_context6.next = 66;
												break;
											}

											throw _iteratorError2;

										case 66:
											return _context6.finish(63);

										case 67:
											return _context6.finish(60);

										case 68:
											emoji = message.guild.emojis.find(function (emojis) {
												return emojis.name == 'yes';
											});
											_context6.next = 71;
											return embedMsg.react(emoji);

										case 71:
											reactionFilter = function reactionFilter(reaction, user) {
												return (voteReactions.includes(reaction.emoji.name) || reaction.emoji.name == 'yes') && user.id !== embedMsg.author.id;
											};

											_context6.next = 74;
											return embedMsg.createReactionCollector(reactionFilter);

										case 74:
											collector = _context6.sent;
											complete = false;
											_context6.next = 78;
											return collector.on('collect', function () {
												var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(reaction) {
													return regeneratorRuntime.wrap(function _callee$(_context) {
														while (1) {
															switch (_context.prev = _context.next) {
																case 0:
																	if (!(reaction.emoji.name !== 'yes')) {
																		_context.next = 2;
																		break;
																	}

																	return _context.abrupt('return');

																case 2:
																	collector.stop();

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

										case 78:
											_context6.next = 80;
											return collector.on('end', function () {
												var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(collected) {
													return regeneratorRuntime.wrap(function _callee3$(_context3) {
														while (1) {
															switch (_context3.prev = _context3.next) {
																case 0:
																	_context3.next = 2;
																	return collected.map(function () {
																		var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(reaction) {
																			var _i;

																			return regeneratorRuntime.wrap(function _callee2$(_context2) {
																				while (1) {
																					switch (_context2.prev = _context2.next) {
																						case 0:
																							_i = 0;

																						case 1:
																							if (!(_i < voteReactions.length)) {
																								_context2.next = 8;
																								break;
																							}

																							if (!(reaction.emoji.name == voteReactions[_i])) {
																								_context2.next = 5;
																								break;
																							}

																							_context2.next = 5;
																							return message.member.addRole(voteOptions[_i]).catch(function (err) {
																								return console.log(err);
																							});

																						case 5:
																							_i++;
																							_context2.next = 1;
																							break;

																						case 8:
																						case 'end':
																							return _context2.stop();
																					}
																				}
																			}, _callee2, _this);
																		}));

																		return function (_x4) {
																			return _ref4.apply(this, arguments);
																		};
																	}());

																case 2:
																	complete = true;

																case 3:
																case 'end':
																	return _context3.stop();
															}
														}
													}, _callee3, _this);
												}));

												return function (_x3) {
													return _ref3.apply(this, arguments);
												};
											}());

										case 80:
											if (complete) {
												_context6.next = 85;
												break;
											}

											_context6.next = 83;
											return helpers.delay(3000);

										case 83:
											_context6.next = 80;
											break;

										case 85:
											_context6.next = 87;
											return embedMsg.delete().catch(function (cantDel) {
												return console.log('embedMsg: ', cantDel);
											});

										case 87:
											_loop3 = /*#__PURE__*/regeneratorRuntime.mark(function _loop3(_i2) {
												return regeneratorRuntime.wrap(function _loop3$(_context5) {
													while (1) {
														switch (_context5.prev = _context5.next) {
															case 0:
																if (!(message.member.roles.find(function (role) {
																	return role.id == voteOptions[_i2].id;
																}) && !joinedEvents.includes(voteOptions[_i2]).id)) {
																	_context5.next = 3;
																	break;
																}

																_context5.next = 3;
																return joinedEvents.push(voteOptions[_i2].id);

															case 3:
															case 'end':
																return _context5.stop();
														}
													}
												}, _loop3, _this);
											});
											_i2 = 0;

										case 89:
											if (!(_i2 < voteOptions.length)) {
												_context6.next = 94;
												break;
											}

											return _context6.delegateYield(_loop3(_i2), 't3', 91);

										case 91:
											_i2++;
											_context6.next = 89;
											break;

										case 94:
											if (!_config.cfg.announcementChannels) {
												_context6.next = 115;
												break;
											}

											_loop4 = function _loop4(_chanName) {
												var textChan = message.guild.channels.find(function (chan) {
													return chan.name == _chanName;
												});
												if (joinedEvents.length == 1) textChan.send('**<@' + message.author.id + '> registered team <@&' + teamRole.id + '> for <@&' + joinedEvents.slice(0) + '>**');else if (joinedEvents.length > 1) textChan.send('**<@' + message.author.id + '> registered team <@&' + teamRole.id + '> for <@&' + joinedEvents.slice(0, -1).join('>, <@&') + '> & <@&' + joinedEvents.slice(-1) + '>**');
											};

											_iteratorNormalCompletion3 = true;
											_didIteratorError3 = false;
											_iteratorError3 = undefined;
											_context6.prev = 99;

											for (_iterator3 = _config.cfg.announcementChannels[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
												_chanName = _step3.value;

												_loop4(_chanName);
											}
											_context6.next = 107;
											break;

										case 103:
											_context6.prev = 103;
											_context6.t4 = _context6['catch'](99);
											_didIteratorError3 = true;
											_iteratorError3 = _context6.t4;

										case 107:
											_context6.prev = 107;
											_context6.prev = 108;

											if (!_iteratorNormalCompletion3 && _iterator3.return) {
												_iterator3.return();
											}

										case 110:
											_context6.prev = 110;

											if (!_didIteratorError3) {
												_context6.next = 113;
												break;
											}

											throw _iteratorError3;

										case 113:
											return _context6.finish(110);

										case 114:
											return _context6.finish(107);

										case 115:
										case 'end':
											return _context6.stop();
									}
								}
							}, _callee4, _this, [[13, 17, 21, 29], [22,, 24, 28], [46, 56, 60, 68], [61,, 63, 67], [99, 103, 107, 115], [108,, 110, 114]]);
						}));

						return function (_x) {
							return _ref.apply(this, arguments);
						};
					}()).catch(function (err) {
						return console.log(err);
					});
					break;
				}
			case cmd == 'delete' || cmd == 'del' || cmd == 'remove' || cmd == 'rem' || cmd == 'rm':
				{
					if (!message.member.roles.some(function (role) {
						return _config.cfg.botModeratorRoles.includes(role.name);
					})) return helpers.reply(message, '' + _strings.strings.commandRequiresAdmin);
					if (!message.mentions.roles.size) return helpers.reply(message, 'You must @mention the team');
					message.mentions.roles.map(function () {
						var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(teamRole) {
							return regeneratorRuntime.wrap(function _callee5$(_context7) {
								while (1) {
									switch (_context7.prev = _context7.next) {
										case 0:
											teamRole.delete().then(function () {
												console.log('Team removed by ' + message.author.tag + ': ' + teamRole.name);
												if (_config.cfg.announcementChannels) {
													var _loop5 = function _loop5(chanName) {
														var textChan = message.guild.channels.find(function (chan) {
															return chan.name == chanName;
														});
														textChan.send('**<@' + message.author.id + '> removed a team:** ' + teamRole.name);
													};

													var _iteratorNormalCompletion4 = true;
													var _didIteratorError4 = false;
													var _iteratorError4 = undefined;

													try {
														for (var _iterator4 = _config.cfg.announcementChannels[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
															var chanName = _step4.value;

															_loop5(chanName);
														}
													} catch (err) {
														_didIteratorError4 = true;
														_iteratorError4 = err;
													} finally {
														try {
															if (!_iteratorNormalCompletion4 && _iterator4.return) {
																_iterator4.return();
															}
														} finally {
															if (_didIteratorError4) {
																throw _iteratorError4;
															}
														}
													}
												}
											});

										case 1:
										case 'end':
											return _context7.stop();
									}
								}
							}, _callee5, _this);
						}));

						return function (_x5) {
							return _ref5.apply(this, arguments);
						};
					}());
					break;
				}
			case cmd == 'rename':
				{
					if (!message.mentions.roles.size) return helpers.reply(message, 'You must @mention the team');
					if (args.length < 3) return helpers.reply(message, 'Incorrect use. Try `' + _config.cfg.prefix + this.name + ' rename @team New Name`', 9000);
					teamName = args.slice(2, args.length).join(' ');
					if (message.guild.roles.find(function (r) {
						return r.name == teamName;
					})) return helpers.reply(message, 'This team already exists');
					message.mentions.roles.map(function () {
						var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(teamRole) {
							var oldName, _loop6, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, chanName;

							return regeneratorRuntime.wrap(function _callee6$(_context8) {
								while (1) {
									switch (_context8.prev = _context8.next) {
										case 0:
											if (message.member.roles.some(function (role) {
												return role.name == teamRole.name;
											})) {
												_context8.next = 2;
												break;
											}

											return _context8.abrupt('return', helpers.reply(message, 'You must be a member of this team, to edit it'));

										case 2:
											oldName = teamRole.name;

											console.log('Team ' + oldName + ' renamed to ' + teamName + ' by ' + message.author.tag);
											message.guild.roles.get(teamRole.id).setName(teamName).catch(function (err) {
												return console.log(err);
											});

											if (!_config.cfg.announcementChannels) {
												_context8.next = 26;
												break;
											}

											_loop6 = function _loop6(chanName) {
												var textChan = message.guild.channels.find(function (chan) {
													return chan.name == chanName;
												});
												textChan.send('**Team ' + oldName + ' renamed to <@&' + teamRole.id + '> by <@' + message.author.id + '>**');
											};

											_iteratorNormalCompletion5 = true;
											_didIteratorError5 = false;
											_iteratorError5 = undefined;
											_context8.prev = 10;

											for (_iterator5 = _config.cfg.announcementChannels[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
												chanName = _step5.value;

												_loop6(chanName);
											}
											_context8.next = 18;
											break;

										case 14:
											_context8.prev = 14;
											_context8.t0 = _context8['catch'](10);
											_didIteratorError5 = true;
											_iteratorError5 = _context8.t0;

										case 18:
											_context8.prev = 18;
											_context8.prev = 19;

											if (!_iteratorNormalCompletion5 && _iterator5.return) {
												_iterator5.return();
											}

										case 21:
											_context8.prev = 21;

											if (!_didIteratorError5) {
												_context8.next = 24;
												break;
											}

											throw _iteratorError5;

										case 24:
											return _context8.finish(21);

										case 25:
											return _context8.finish(18);

										case 26:
										case 'end':
											return _context8.stop();
									}
								}
							}, _callee6, _this, [[10, 14, 18, 26], [19,, 21, 25]]);
						}));

						return function (_x6) {
							return _ref6.apply(this, arguments);
						};
					}());
					break;
				}
			default:
				{
					return helpers.reply(message, 'Invalid command use. Try `' + _config.cfg.prefix + 'help ' + this.name + '` for more info');
				}
		}
	}
};