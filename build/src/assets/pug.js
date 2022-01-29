'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.teams = exports.end = exports.cleanUp = exports.run = exports.waitQuestion = exports.startQuestionEmbed = exports.startQuestion = exports.teamMsg = exports.finalPlayersMsg = exports.startMsg = exports.server = exports.embed = exports.captainsOnlyVote = exports.captainsPickResult = exports.teamPickResult = exports.channelTwo = exports.channelOne = exports.missedOutRoom = exports.waitingRoom = exports.lastPickerId = exports.lockedTeams = exports.ready = exports.teamTwo = exports.teamOne = exports.captains = exports.players = exports.queue = exports.voteResults = exports.voteReactions = exports.voteDelay = exports.statusCollector = exports.collector = exports.neededCount = exports.start = exports.startCount = exports.state = exports.trash = exports.playersField = exports.teamTwoField = undefined;

// =============== PUG FLOW ===============
var run = exports.run = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						exports.start = start = false;
						_context.next = 3;
						return startCheck(message);

					case 3:
						if (!(queue.length < startCount || state == 'waiting' || !start)) {
							_context.next = 5;
							break;
						}

						return _context.abrupt('return');

					case 5:
						_context.next = 7;
						return playersFound(message);

					case 7:
						_context.next = 9;
						return readyUp();

					case 9:
						_context.next = 11;
						return setUp(message);

					case 11:
						_context.next = 13;
						return playing(message);

					case 13:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function run(_x) {
		return _ref.apply(this, arguments);
	};
}();

var startCheck = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(message) {
		var _this = this;

		var count, i;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						exports.state = state = 'startCheck';
						exports.voteReactions = voteReactions = [];
						count = neededCount;

						if (!_config.cfg.requireReadyUp && !_config.cfg.devMode && !_config.cfg.testMode) count = startCount;
						_context5.next = 6;
						return helpers.initEmbed(message, 1);

					case 6:
						exports.embed = embed = _context5.sent;

						embed.title = '**Shall we start with these players?**';
						embed.description = '';
						for (i = 0; i < startCount; i++) {
							embed.description += '\n#' + (i + 1) + ' <@' + queue[i] + '>';
						}embed.fields[0].name = 'Start?';
						embed.fields[0].value = _strings.strings.startCheck;
						_context5.next = 14;
						return message.channel.send({ embed: embed }).then(function () {
							var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(question) {
								var result, emoji, reactionFilter;
								return regeneratorRuntime.wrap(function _callee4$(_context4) {
									while (1) {
										switch (_context4.prev = _context4.next) {
											case 0:
												result = 'none';

												trash.push(question);
												exports.startQuestion = startQuestion = question;
												exports.startQuestionEmbed = startQuestionEmbed = embed;
												_context4.next = 6;
												return message.guild.emojis.find(function (emojis) {
													return emojis.name == 'yes';
												});

											case 6:
												emoji = _context4.sent;
												_context4.next = 9;
												return question.react(emoji);

											case 9:
												_context4.next = 11;
												return voteReactions.push(emoji.name);

											case 11:
												_context4.next = 13;
												return message.guild.emojis.find(function (emojis) {
													return emojis.name == 'no';
												});

											case 13:
												emoji = _context4.sent;
												_context4.next = 16;
												return question.react(emoji);

											case 16:
												_context4.next = 18;
												return voteReactions.push(emoji.name);

											case 18:
												_context4.next = 20;
												return message.guild.emojis.find(function (emojis) {
													return emojis.name == 'kill';
												});

											case 20:
												emoji = _context4.sent;
												_context4.next = 23;
												return question.react(emoji);

											case 23:
												_context4.next = 25;
												return voteReactions.push(emoji.name);

											case 25:
												_context4.next = 27;
												return message.guild.emojis.find(function (emojis) {
													return emojis.name == 'play';
												});

											case 27:
												emoji = _context4.sent;
												_context4.next = 30;
												return question.react(emoji);

											case 30:
												_context4.next = 32;
												return voteReactions.push(emoji.name);

											case 32:
												reactionFilter = function reactionFilter(reaction, user) {
													return voteReactions.includes(reaction.emoji.name) && queue.slice(0, startCount).includes(user.id) && user.id !== question.author.id;
												};

												_context4.next = 35;
												return question.createReactionCollector(reactionFilter);

											case 35:
												exports.collector = collector = _context4.sent;
												_context4.next = 38;
												return collector.on('collect', function () {
													var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(reaction) {
														var _i, filter, member, _member;

														return regeneratorRuntime.wrap(function _callee3$(_context3) {
															while (1) {
																switch (_context3.prev = _context3.next) {
																	case 0:
																		if (!(reaction.emoji.name == 'yes')) {
																			_context3.next = 28;
																			break;
																		}

																		if (_config.cfg.requireReadyUp) {
																			_context3.next = 9;
																			break;
																		}

																		exports.embed = embed = startQuestionEmbed;
																		embed.description = '';
																		for (_i = 0; _i < startCount && _i < queue.length; _i++) {
																			if (reaction.users.map(function (u) {
																				return u.id;
																			}).includes(queue[_i])) embed.description += '\n#' + (_i + 1) + ' <@' + queue[_i] + '>  *Ready*';else embed.description += '\n#' + (_i + 1) + ' <@' + queue[_i] + '>';
																		}
																		_context3.next = 7;
																		return question.edit({ embed: embed }).catch(function (err) {
																			return console.log(err);
																		});

																	case 7:
																		exports.startQuestion = startQuestion = question;
																		exports.startQuestionEmbed = startQuestionEmbed = embed;

																	case 9:
																		if (!(reaction.users.map(function (u) {
																			return u;
																		}).length < count + 1)) {
																			_context3.next = 11;
																			break;
																		}

																		return _context3.abrupt('return');

																	case 11:
																		collector.stop();

																		if (!(question.channel && !question.deleted)) {
																			_context3.next = 15;
																			break;
																		}

																		_context3.next = 15;
																		return question.delete().catch(function (cantDel) {
																			return console.log('startQuestion: ', cantDel);
																		});

																	case 15:
																		if (!(queue.length >= startCount)) {
																			_context3.next = 20;
																			break;
																		}

																		_context3.next = 18;
																		return question.channel.send('**PUG Setup Ready!**\n<@' + queue.slice(0, startCount).join('>, <@') + '>\nPlease `' + _config.cfg.prefix + 'ready` if needed!');

																	case 18:
																		_context3.next = 22;
																		break;

																	case 20:
																		_context3.next = 22;
																		return question.channel.send('**No longer enough players to start PUG**');

																	case 22:
																		if (queue.length < startCount) exports.state = state = 'waiting';else exports.start = start = true;

																		if (!_config.cfg.requireReadyUp) {
																			_context3.next = 26;
																			break;
																		}

																		_context3.next = 26;
																		return teams(message, 1);

																	case 26:
																		_context3.next = 91;
																		break;

																	case 28:
																		if (!(reaction.emoji.name == 'no')) {
																			_context3.next = 50;
																			break;
																		}

																		collector.stop();

																		if (!(question.channel && !question.deleted)) {
																			_context3.next = 33;
																			break;
																		}

																		_context3.next = 33;
																		return question.delete().catch(function (cantDel) {
																			return console.log('startQuestion: ', cantDel);
																		});

																	case 33:
																		_context3.next = 35;
																		return question.channel.send('**PUG Setup Delayed!**\n**Reason: **PUG list rejected by <@' + reaction.users.map(function (u) {
																			return u;
																		})[1].id + '>\nYou may remove and add players as needed.\nWhen ' + startCount / 2 + ' players click :white_check_mark: or a PUG Helper types `' + _config.cfg.prefix + 'start`, it will to continue!');

																	case 35:
																		exports.waitQuestion = waitQuestion = _context3.sent;
																		_context3.next = 38;
																		return message.guild.emojis.find(function (emojis) {
																			return emojis.name == 'yes';
																		});

																	case 38:
																		emoji = _context3.sent;

																		waitQuestion.react(emoji);

																		filter = function filter(r, u) {
																			return r.emoji.name == emoji.name && queue.slice(0, 10).includes(u.id) && u.id !== waitQuestion.author.id;
																		};

																		_context3.next = 43;
																		return waitQuestion.createReactionCollector(filter);

																	case 43:
																		exports.statusCollector = statusCollector = _context3.sent;
																		_context3.next = 46;
																		return statusCollector.on('collect', function () {
																			var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(r) {
																				return regeneratorRuntime.wrap(function _callee2$(_context2) {
																					while (1) {
																						switch (_context2.prev = _context2.next) {
																							case 0:
																								if (!(r.users.map(function (u) {
																									return u;
																								}).length < startCount / 2 + 1)) {
																									_context2.next = 2;
																									break;
																								}

																								return _context2.abrupt('return');

																							case 2:
																								statusCollector.stop();
																								waitQuestion.delete().catch(function (cantDel) {
																									return console.log('startQuestion: ', cantDel);
																								});
																								if (!players[0] && queue.length >= startCount) run(message);

																							case 5:
																							case 'end':
																								return _context2.stop();
																						}
																					}
																				}, _callee2, _this);
																			}));

																			return function (_x5) {
																				return _ref5.apply(this, arguments);
																			};
																		}());

																	case 46:
																		_context3.next = 48;
																		return teams(message, 1);

																	case 48:
																		_context3.next = 91;
																		break;

																	case 50:
																		if (!(reaction.emoji.name == 'kill')) {
																			_context3.next = 70;
																			break;
																		}

																		member = message.guild.members.get(reaction.users.map(function (u) {
																			return u;
																		})[1].id);

																		if (member.roles.some(function (role) {
																			return _config.cfg.botModeratorRoles.includes(role.name);
																		})) {
																			_context3.next = 56;
																			break;
																		}

																		_context3.next = 55;
																		return reaction.remove(reaction.users.map(function (u) {
																			return u;
																		})[1].id);

																	case 55:
																		return _context3.abrupt('return', _context3.sent);

																	case 56:
																		collector.stop();

																		if (!(question.channel && !question.deleted)) {
																			_context3.next = 60;
																			break;
																		}

																		_context3.next = 60;
																		return question.delete().catch(function (cantDel) {
																			return console.log('startQuestion: ', cantDel);
																		});

																	case 60:
																		_context3.next = 62;
																		return [];

																	case 62:
																		exports.queue = queue = _context3.sent;

																		exports.state = state = 'waiting';
																		_context3.next = 66;
																		return question.channel.send('**PUG has ended!**\n**Reason: **PUG list rejected by <@' + reaction.users.map(function (u) {
																			return u;
																		})[1].id + '>\nThe queue has been reset!');

																	case 66:
																		_context3.next = 68;
																		return teams(message, 1);

																	case 68:
																		_context3.next = 91;
																		break;

																	case 70:
																		if (!(reaction.emoji.name == 'play')) {
																			_context3.next = 91;
																			break;
																		}

																		_member = message.guild.members.get(reaction.users.map(function (u) {
																			return u;
																		})[1].id);

																		if (_member.roles.some(function (role) {
																			return _config.cfg.botModeratorRoles.includes(role.name);
																		})) {
																			_context3.next = 76;
																			break;
																		}

																		_context3.next = 75;
																		return reaction.remove(reaction.users.map(function (u) {
																			return u;
																		})[1].id);

																	case 75:
																		return _context3.abrupt('return', _context3.sent);

																	case 76:
																		collector.stop();

																		if (!(question.channel && !question.deleted)) {
																			_context3.next = 80;
																			break;
																		}

																		_context3.next = 80;
																		return question.delete().catch(function (cantDel) {
																			return console.log('startQuestion: ', cantDel);
																		});

																	case 80:
																		if (!(queue.length >= startCount)) {
																			_context3.next = 85;
																			break;
																		}

																		_context3.next = 83;
																		return question.channel.send('**PUG Setup Ready!** *- Started by <@' + reaction.users.map(function (u) {
																			return u;
																		})[1].id + '>*\n<@' + queue.slice(0, startCount).join('>, <@') + '>\nPlease `' + _config.cfg.prefix + 'ready` if needed!');

																	case 83:
																		_context3.next = 87;
																		break;

																	case 85:
																		_context3.next = 87;
																		return question.channel.send('**No longer enough players to start PUG**');

																	case 87:
																		if (queue.length < startCount) exports.state = state = 'waiting';else exports.start = start = true;

																		if (!_config.cfg.requireReadyUp) {
																			_context3.next = 91;
																			break;
																		}

																		_context3.next = 91;
																		return teams(message, 1);

																	case 91:
																		result = reaction.emoji.name;

																	case 92:
																	case 'end':
																		return _context3.stop();
																}
															}
														}, _callee3, _this);
													}));

													return function (_x4) {
														return _ref4.apply(this, arguments);
													};
												}());

											case 38:
												if (voteReactions.includes(result)) {
													_context4.next = 43;
													break;
												}

												_context4.next = 41;
												return helpers.delay(5000);

											case 41:
												_context4.next = 38;
												break;

											case 43:
												exports.voteReactions = voteReactions = [];

											case 44:
											case 'end':
												return _context4.stop();
										}
									}
								}, _callee4, _this);
							}));

							return function (_x3) {
								return _ref3.apply(this, arguments);
							};
						}());

					case 14:
						return _context5.abrupt('return', queue);

					case 15:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, this);
	}));

	return function startCheck(_x2) {
		return _ref2.apply(this, arguments);
	};
}();

var playersFound = function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(message) {
		var _this2 = this;

		var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, svr, emoji, filter;

		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						exports.state = state = 'playersFound';
						exports.captains = captains = [];
						exports.teamOne = teamOne = [];
						exports.teamTwo = teamTwo = [];
						exports.ready = ready = [];
						exports.lockedTeams = lockedTeams = [];
						exports.server = server = {};
						_context8.next = 9;
						return [];

					case 9:
						exports.players = players = _context8.sent;
						_context8.next = 12;
						return queue.slice(0, startCount);

					case 12:
						exports.players = players = _context8.sent;

						exports.waitingRoom = waitingRoom = message.guild.channels.find(function (channel) {
							return channel.name == _config.cfg.pugVoiceChannels[0];
						});
						if (_config.cfg.useMissedPUGChannel) exports.missedOutRoom = missedOutRoom = message.guild.channels.find(function (channel) {
							return channel.name == _config.cfg.pugVoiceChannels[1];
						});
						if (!_config.cfg.requireReadyUp) exports.ready = ready = players.slice(0);
						embed.title = states.pug[state].name + '  ( ' + players.length + ' of ' + startCount + ' )';
						embed.description = 'The PUG is ready for setup!\n\u3164';
						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						_context8.prev = 21;
						for (_iterator = _config.cfg.gameServers.sandstorm[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							svr = _step.value;

							if (svr.isPugServer && !_config.cfg.gameServers.sandstorm.includes(server)) {
								exports.server = server = svr;
								if (server.pass) embed.description += '\n**PUG Server Info**\nPassword:   `' + server.pass + '`\n`' + server.ip + '`\n\u3164';else embed.description += '\nIf a server has not been chosen already, use `' + server.ip + '`\n\u3164';
							}
						}
						_context8.next = 29;
						break;

					case 25:
						_context8.prev = 25;
						_context8.t0 = _context8['catch'](21);
						_didIteratorError = true;
						_iteratorError = _context8.t0;

					case 29:
						_context8.prev = 29;
						_context8.prev = 30;

						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}

					case 32:
						_context8.prev = 32;

						if (!_didIteratorError) {
							_context8.next = 35;
							break;
						}

						throw _iteratorError;

					case 35:
						return _context8.finish(32);

					case 36:
						return _context8.finish(29);

					case 37:
						if (_config.cfg.unmuteToReady) embed.description += '\n**Note:**\nAll ' + startCount + ' players must be in **' + waitingRoom.name + '**\nUNMUTED for voting to begin!\n\u3164';else embed.description += '\n**Note:**\nAny player not in **' + waitingRoom.name + '** and unmuted,\nmust `' + _config.cfg.prefix + 'ready` for voting to begin!\n\u3164';
						waitingRoom.members.map(function () {
							var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(member) {
								return regeneratorRuntime.wrap(function _callee6$(_context6) {
									while (1) {
										switch (_context6.prev = _context6.next) {
											case 0:
												if (!(players.includes(member.user.id) && (!ready.includes(member.user.id) || !ready.includes('X' + member.user.id)) && !member.mute)) {
													_context6.next = 5;
													break;
												}

												_context6.next = 3;
												return ready.push(member.user.id);

											case 3:
												_context6.next = 8;
												break;

											case 5:
												if (!(players.includes(member.user.id) && ready.includes('X' + member.user.id) && !member.mute)) {
													_context6.next = 8;
													break;
												}

												_context6.next = 8;
												return ready.splice(ready.indexOf('X' + member.user.id), 1, member.user.id);

											case 8:
											case 'end':
												return _context6.stop();
										}
									}
								}, _callee6, _this2);
							}));

							return function (_x7) {
								return _ref7.apply(this, arguments);
							};
						}());
						_context8.next = 41;
						return message.channel.send({ embed: embed });

					case 41:
						exports.startMsg = startMsg = _context8.sent;
						_context8.next = 44;
						return message.guild.emojis.find(function (emojis) {
							return emojis.name == 'stop';
						});

					case 44:
						emoji = _context8.sent;

						startMsg.react(emoji);

						filter = function filter(r, u) {
							return r.emoji.name == emoji.name && players.includes(u.id) && u.id !== startMsg.author.id;
						};

						_context8.next = 49;
						return startMsg.createReactionCollector(filter);

					case 49:
						exports.statusCollector = statusCollector = _context8.sent;
						_context8.next = 52;
						return statusCollector.on('collect', function () {
							var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(r) {
								return regeneratorRuntime.wrap(function _callee7$(_context7) {
									while (1) {
										switch (_context7.prev = _context7.next) {
											case 0:
												if (!(r.users.map(function (u) {
													return u;
												}).length < neededCount + 1)) {
													_context7.next = 2;
													break;
												}

												return _context7.abrupt('return');

											case 2:
												statusCollector.stop();
												startMsg.clearReactions();
												_context7.next = 6;
												return end(message, 'PUG ended by players');

											case 6:
											case 'end':
												return _context7.stop();
										}
									}
								}, _callee7, _this2);
							}));

							return function (_x8) {
								return _ref8.apply(this, arguments);
							};
						}());

					case 52:
						_context8.next = 54;
						return teams(message, 1);

					case 54:
						_context8.next = 56;
						return helpers.delay(3000);

					case 56:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, this, [[21, 25, 29, 37], [30,, 32, 36]]);
	}));

	return function playersFound(_x6) {
		return _ref6.apply(this, arguments);
	};
}();

var readyUp = function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						if (!(state == 'waiting')) {
							_context9.next = 2;
							break;
						}

						return _context9.abrupt('return');

					case 2:
						if (_config.cfg.requireReadyUp) {
							_context9.next = 4;
							break;
						}

						return _context9.abrupt('return');

					case 4:
						exports.state = state = 'ready';

					case 5:
						if (!(!players.some(function (player) {
							return !ready.includes(player);
						}) == false)) {
							_context9.next = 10;
							break;
						}

						_context9.next = 8;
						return helpers.delay(5000);

					case 8:
						_context9.next = 5;
						break;

					case 10:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, this);
	}));

	return function readyUp() {
		return _ref9.apply(this, arguments);
	};
}();

var setUp = function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(message) {
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						if (!(state == 'waiting')) {
							_context10.next = 2;
							break;
						}

						return _context10.abrupt('return');

					case 2:
						exports.state = state = 'settingUp';
						randomTeams(players);
						/*await askQuestion(message, votes.askPickTeams, `askPickTeams`)
      if (teamPickResult == votes.askPickTeams.options[1]) {
      	await askQuestion(message, votes.askPickCaptains, `askPickCaptains`)
      	if (captainsPickResult == votes.askPickCaptains.options[1]) {
      		await askQuestion(message, votes.pickCaptains, `pickCaptains`)
      		await askQuestion(message, votes.pickTeams, `pickTeams`)
      	}
      	else {
      		await randomCaptains()
      		await askQuestion(message, votes.pickTeams, `pickTeams`)
      	}
      }
      else randomTeams(players)
      	
      */

					case 4:
					case 'end':
						return _context10.stop();
				}
			}
		}, _callee10, this);
	}));

	return function setUp(_x9) {
		return _ref10.apply(this, arguments);
	};
}();

var playing = function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(message) {
		var _this3 = this;

		var emoji, filter, channelNames, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, player, member, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _player, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _player2;

		return regeneratorRuntime.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						if (!(state == 'waiting')) {
							_context12.next = 2;
							break;
						}

						return _context12.abrupt('return');

					case 2:
						exports.state = state = 'playing';
						_context12.next = 5;
						return statusCollector.stop();

					case 5:
						_context12.next = 7;
						return startMsg.clearReactions();

					case 7:
						_context12.next = 9;
						return cleanUp(trash, 5000, 3000);

					case 9:
						_context12.next = 11;
						return teams(message, 2);

					case 11:
						exports.finalPlayersMsg = finalPlayersMsg = _context12.sent;
						_context12.next = 14;
						return message.guild.emojis.find(function (emojis) {
							return emojis.name == 'stop';
						});

					case 14:
						emoji = _context12.sent;

						finalPlayersMsg.react(emoji);

						filter = function filter(r, u) {
							return r.emoji.name == emoji.name && players.includes(u.id) && u.id !== finalPlayersMsg.author.id;
						};

						_context12.next = 19;
						return finalPlayersMsg.createReactionCollector(filter);

					case 19:
						exports.statusCollector = statusCollector = _context12.sent;
						_context12.next = 22;
						return statusCollector.on('collect', function () {
							var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(r) {
								return regeneratorRuntime.wrap(function _callee11$(_context11) {
									while (1) {
										switch (_context11.prev = _context11.next) {
											case 0:
												if (!(r.users.map(function (u) {
													return u;
												}).length < neededCount + 1)) {
													_context11.next = 2;
													break;
												}

												return _context11.abrupt('return');

											case 2:
												statusCollector.stop();
												finalPlayersMsg.clearReactions();
												_context11.next = 6;
												return end(message, 'PUG ended by players');

											case 6:
											case 'end':
												return _context11.stop();
										}
									}
								}, _callee11, _this3);
							}));

							return function (_x11) {
								return _ref12.apply(this, arguments);
							};
						}());

					case 22:
						helpers.reply(message, '**PUG is starting!** Prepare to fight!', voteDelay * 2, true);
						_context12.next = 25;
						return helpers.delay(3000);

					case 25:
						channelNames = [_config.cfg.pugVoiceChannels[1], _config.cfg.pugVoiceChannels[2]];

						if (_config.cfg.useMissedPUGChannel) channelNames = [_config.cfg.pugVoiceChannels[2], _config.cfg.pugVoiceChannels[3]];
						_context12.next = 29;
						return helpers.makeChannel(message, channelNames[0], 'voice', 10);

					case 29:
						exports.channelOne = channelOne = _context12.sent;
						_context12.next = 32;
						return helpers.makeChannel(message, channelNames[1], 'voice', 10);

					case 32:
						exports.channelTwo = channelTwo = _context12.sent;
						_context12.next = 35;
						return channelOne.setParent(_config.cfg.pugCategoryId).then(function (channel) {
							return channel.lockPermissions().catch(function (err) {
								return console.log(err);
							});
						}).catch(function (err) {
							return console.log(err);
						});

					case 35:
						_context12.next = 37;
						return channelTwo.setParent(_config.cfg.pugCategoryId).then(function (channel) {
							return channel.lockPermissions().catch(function (err) {
								return console.log(err);
							});
						}).catch(function (err) {
							return console.log(err);
						});

					case 37:
						if (teamPickResult == votes.askPickTeams.options[0] || teamPickResult == votes.askPickTeams.options[1] && captainsPickResult == votes.askPickCaptains.options[0]) {
							channelOne.setName('\uD83C\uDFC6 Security').catch(function (err) {
								return console.log(err);
							});
							channelTwo.setName('\uD83C\uDFC6 Insurgents').catch(function (err) {
								return console.log(err);
							});
						}
						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						_context12.prev = 41;
						_iterator2 = teamOne[Symbol.iterator]();

					case 43:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							_context12.next = 51;
							break;
						}

						player = _step2.value;
						member = message.guild.members.get(player);
						_context12.next = 48;
						return member.setVoiceChannel(channelOne).catch(function (err) {
							return console.log(err);
						});

					case 48:
						_iteratorNormalCompletion2 = true;
						_context12.next = 43;
						break;

					case 51:
						_context12.next = 57;
						break;

					case 53:
						_context12.prev = 53;
						_context12.t0 = _context12['catch'](41);
						_didIteratorError2 = true;
						_iteratorError2 = _context12.t0;

					case 57:
						_context12.prev = 57;
						_context12.prev = 58;

						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}

					case 60:
						_context12.prev = 60;

						if (!_didIteratorError2) {
							_context12.next = 63;
							break;
						}

						throw _iteratorError2;

					case 63:
						return _context12.finish(60);

					case 64:
						return _context12.finish(57);

					case 65:
						_iteratorNormalCompletion3 = true;
						_didIteratorError3 = false;
						_iteratorError3 = undefined;
						_context12.prev = 68;
						_iterator3 = teamTwo[Symbol.iterator]();

					case 70:
						if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
							_context12.next = 78;
							break;
						}

						_player = _step3.value;
						member = message.guild.members.get(_player);
						_context12.next = 75;
						return member.setVoiceChannel(channelTwo).catch(function (err) {
							return console.log(err);
						});

					case 75:
						_iteratorNormalCompletion3 = true;
						_context12.next = 70;
						break;

					case 78:
						_context12.next = 84;
						break;

					case 80:
						_context12.prev = 80;
						_context12.t1 = _context12['catch'](68);
						_didIteratorError3 = true;
						_iteratorError3 = _context12.t1;

					case 84:
						_context12.prev = 84;
						_context12.prev = 85;

						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}

					case 87:
						_context12.prev = 87;

						if (!_didIteratorError3) {
							_context12.next = 90;
							break;
						}

						throw _iteratorError3;

					case 90:
						return _context12.finish(87);

					case 91:
						return _context12.finish(84);

					case 92:
						_iteratorNormalCompletion4 = true;
						_didIteratorError4 = false;
						_iteratorError4 = undefined;
						_context12.prev = 95;
						_iterator4 = queue[Symbol.iterator]();

					case 97:
						if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
							_context12.next = 106;
							break;
						}

						_player2 = _step4.value;
						member = message.guild.members.get(_player2);

						if (!(_config.cfg.useMissedPUGChannel && missedOutRoom.position && !players.includes(_player2))) {
							_context12.next = 103;
							break;
						}

						_context12.next = 103;
						return member.setVoiceChannel(missedOutRoom).catch(function (err) {
							return console.log(err);
						});

					case 103:
						_iteratorNormalCompletion4 = true;
						_context12.next = 97;
						break;

					case 106:
						_context12.next = 112;
						break;

					case 108:
						_context12.prev = 108;
						_context12.t2 = _context12['catch'](95);
						_didIteratorError4 = true;
						_iteratorError4 = _context12.t2;

					case 112:
						_context12.prev = 112;
						_context12.prev = 113;

						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}

					case 115:
						_context12.prev = 115;

						if (!_didIteratorError4) {
							_context12.next = 118;
							break;
						}

						throw _iteratorError4;

					case 118:
						return _context12.finish(115);

					case 119:
						return _context12.finish(112);

					case 120:
						helpers.xpHandler(message, players);

					case 121:
					case 'end':
						return _context12.stop();
				}
			}
		}, _callee12, this, [[41, 53, 57, 65], [58,, 60, 64], [68, 80, 84, 92], [85,, 87, 91], [95, 108, 112, 120], [113,, 115, 119]]);
	}));

	return function playing(_x10) {
		return _ref11.apply(this, arguments);
	};
}();

// =============== ASK QUESTIONS ===============


var askQuestion = function () {
	var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(message, vote, type) {
		var _this4 = this;

		var winningOption, winningCount, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, player, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _player3, i;

		return regeneratorRuntime.wrap(function _callee21$(_context22) {
			while (1) {
				switch (_context22.prev = _context22.next) {
					case 0:
						if (!(state == 'waiting')) {
							_context22.next = 2;
							break;
						}

						return _context22.abrupt('return');

					case 2:
						winningOption = '', winningCount = 0;
						_context22.next = 5;
						return helpers.initEmbed(message, 1);

					case 5:
						exports.embed = embed = _context22.sent;

						exports.voteReactions = voteReactions = [];
						exports.voteResults = voteResults = [];
						embed.title = '' + vote.question;
						embed.description = '\u3164';
						embed.fields[0].value = '';

						if (!(type == 'pickCaptains')) {
							_context22.next = 41;
							break;
						}

						vote.options = [];
						_iteratorNormalCompletion5 = true;
						_didIteratorError5 = false;
						_iteratorError5 = undefined;
						_context22.prev = 16;
						_iterator5 = players[Symbol.iterator]();

					case 18:
						if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
							_context22.next = 25;
							break;
						}

						player = _step5.value;
						_context22.next = 22;
						return vote.options.push(player);

					case 22:
						_iteratorNormalCompletion5 = true;
						_context22.next = 18;
						break;

					case 25:
						_context22.next = 31;
						break;

					case 27:
						_context22.prev = 27;
						_context22.t0 = _context22['catch'](16);
						_didIteratorError5 = true;
						_iteratorError5 = _context22.t0;

					case 31:
						_context22.prev = 31;
						_context22.prev = 32;

						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}

					case 34:
						_context22.prev = 34;

						if (!_didIteratorError5) {
							_context22.next = 37;
							break;
						}

						throw _iteratorError5;

					case 37:
						return _context22.finish(34);

					case 38:
						return _context22.finish(31);

					case 39:
						_context22.next = 80;
						break;

					case 41:
						if (!(type == 'pickTeams')) {
							_context22.next = 80;
							break;
						}

						embed.description = 'One at a time, starting with Team #1';
						embed.fields[0].name = 'Team #1';
						embed.fields[0].value = '<@' + captains[0] + '>';
						embed.fields[0].inline = true;
						embed.fields[1] = teamTwoField;
						embed.fields[1].value = '<@' + captains[1] + '>';
						embed.fields[2] = playersField;
						embed.fields[2].value = '';
						_context22.next = 52;
						return [];

					case 52:
						vote.options = _context22.sent;
						_iteratorNormalCompletion6 = true;
						_didIteratorError6 = false;
						_iteratorError6 = undefined;
						_context22.prev = 56;
						_iterator6 = players[Symbol.iterator]();

					case 58:
						if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
							_context22.next = 66;
							break;
						}

						_player3 = _step6.value;

						if (captains.includes(_player3)) {
							_context22.next = 63;
							break;
						}

						_context22.next = 63;
						return vote.options.push(_player3);

					case 63:
						_iteratorNormalCompletion6 = true;
						_context22.next = 58;
						break;

					case 66:
						_context22.next = 72;
						break;

					case 68:
						_context22.prev = 68;
						_context22.t1 = _context22['catch'](56);
						_didIteratorError6 = true;
						_iteratorError6 = _context22.t1;

					case 72:
						_context22.prev = 72;
						_context22.prev = 73;

						if (!_iteratorNormalCompletion6 && _iterator6.return) {
							_iterator6.return();
						}

					case 75:
						_context22.prev = 75;

						if (!_didIteratorError6) {
							_context22.next = 78;
							break;
						}

						throw _iteratorError6;

					case 78:
						return _context22.finish(75);

					case 79:
						return _context22.finish(72);

					case 80:
						for (i = 0; i < vote.options.length; i++) {
							if (type == 'askPickTeams' || type == 'askPickCaptains') embed.fields[0].value += '\n:regional_indicator_' + helpers.alphabet[i] + ': - ' + vote.options[i];
							if (type == 'pickCaptains') embed.fields[0].value += '\n:regional_indicator_' + helpers.alphabet[i] + ': - <@' + vote.options[i] + '>';
							if (embed.fields[2]) embed.fields[2].value += '\n:regional_indicator_' + helpers.alphabet[i] + ': - <@' + vote.options[i] + '>';
							voteReactions[i] = 'alph_' + helpers.alphabet[i];
							//voteReactions[i] = `regional_indicator_${helpers.alphabet[i]}`
							voteResults[i] = '0';
						}
						_context22.next = 83;
						return message.channel.send({ embed: embed }).then(function () {
							var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(question) {
								var _loop, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, item, reactionFilter, _reactionFilter, _reactionFilter2, lastPickMsg;

								return regeneratorRuntime.wrap(function _callee20$(_context21) {
									while (1) {
										switch (_context21.prev = _context21.next) {
											case 0:
												trash.push(question);
												_loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(item) {
													var emoji;
													return regeneratorRuntime.wrap(function _loop$(_context20) {
														while (1) {
															switch (_context20.prev = _context20.next) {
																case 0:
																	emoji = message.guild.emojis.find(function (emojis) {
																		return emojis.name == item;
																	});
																	_context20.next = 3;
																	return question.react(emoji);

																case 3:
																case 'end':
																	return _context20.stop();
															}
														}
													}, _loop, _this4);
												});
												_iteratorNormalCompletion7 = true;
												_didIteratorError7 = false;
												_iteratorError7 = undefined;
												_context21.prev = 5;
												_iterator7 = voteReactions[Symbol.iterator]();

											case 7:
												if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
													_context21.next = 13;
													break;
												}

												item = _step7.value;
												return _context21.delegateYield(_loop(item), 't0', 10);

											case 10:
												_iteratorNormalCompletion7 = true;
												_context21.next = 7;
												break;

											case 13:
												_context21.next = 19;
												break;

											case 15:
												_context21.prev = 15;
												_context21.t1 = _context21['catch'](5);
												_didIteratorError7 = true;
												_iteratorError7 = _context21.t1;

											case 19:
												_context21.prev = 19;
												_context21.prev = 20;

												if (!_iteratorNormalCompletion7 && _iterator7.return) {
													_iterator7.return();
												}

											case 22:
												_context21.prev = 22;

												if (!_didIteratorError7) {
													_context21.next = 25;
													break;
												}

												throw _iteratorError7;

											case 25:
												return _context21.finish(22);

											case 26:
												return _context21.finish(19);

											case 27:
												_context21.t2 = true;
												_context21.next = _context21.t2 === (type == 'askPickTeams' || type == 'askPickCaptains') ? 30 : _context21.t2 === (type == 'pickCaptains') ? 44 : _context21.t2 === (type == 'pickTeams') ? 58 : 79;
												break;

											case 30:
												reactionFilter = function reactionFilter(reaction, user) {
													return voteReactions.includes(reaction.emoji.name) && !user.bot && players.includes(user.id) && user.id !== question.author.id;
												};

												_context21.next = 33;
												return question.createReactionCollector(reactionFilter, { time: voteDelay });

											case 33:
												exports.collector = collector = _context21.sent;
												_context21.next = 36;
												return collector.on('end', function () {
													var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(collected, reason) {
														var results, collectedCount, _i2, total, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, item;

														return regeneratorRuntime.wrap(function _callee15$(_context15) {
															while (1) {
																switch (_context15.prev = _context15.next) {
																	case 0:
																		if (!(reason == 'Admin Stop')) {
																			_context15.next = 2;
																			break;
																		}

																		return _context15.abrupt('return');

																	case 2:
																		_context15.next = 4;
																		return collected.map(function () {
																			var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(reaction) {
																				return regeneratorRuntime.wrap(function _callee14$(_context14) {
																					while (1) {
																						switch (_context14.prev = _context14.next) {
																							case 0:
																								voteResults[voteReactions.indexOf(reaction.emoji.name)] = reaction.users.map(function () {
																									var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(user) {
																										return regeneratorRuntime.wrap(function _callee13$(_context13) {
																											while (1) {
																												switch (_context13.prev = _context13.next) {
																													case 0:
																														return _context13.abrupt('return', user);

																													case 1:
																													case 'end':
																														return _context13.stop();
																												}
																											}
																										}, _callee13, _this4);
																									}));

																									return function (_x19) {
																										return _ref17.apply(this, arguments);
																									};
																								}()).length - 1;

																							case 1:
																							case 'end':
																								return _context14.stop();
																						}
																					}
																				}, _callee14, _this4);
																			}));

																			return function (_x18) {
																				return _ref16.apply(this, arguments);
																			};
																		}());

																	case 4:
																		results = parseInt(voteResults.reduce(function (a, b) {
																			return a + b;
																		}));
																		collectedCount = 0;

																		while (results) {
																			collectedCount += results % 10;
																			results = Math.floor(results / 10);
																		}

																		if (!(!collectedCount > 0)) {
																			_context15.next = 13;
																			break;
																		}

																		winningOption = vote.options[0];
																		_context15.next = 11;
																		return question.channel.send('No players voted in time... The winning option will be **' + winningOption + '**').then(function (resultMsg) {
																			return trash.push(resultMsg);
																		});

																	case 11:
																		_context15.next = 44;
																		break;

																	case 13:
																		// await question.channel.send(`**${collectedCount} votes collected**`).then(countMsg => trash.push(countMsg));
																		winningCount = Math.max.apply(Math, _toConsumableArray(voteResults));
																		_i2 = voteResults.indexOf(winningCount);

																		winningOption = vote.options[_i2];
																		if (!winningOption) winningOption = vote.options[Math.floor(Math.random() * vote.options.length)];
																		total = 0;
																		_iteratorNormalCompletion8 = true;
																		_didIteratorError8 = false;
																		_iteratorError8 = undefined;
																		_context15.prev = 21;

																		for (_iterator8 = voteResults[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
																			item = _step8.value;
																			if (item == winningCount) total++;
																		}_context15.next = 29;
																		break;

																	case 25:
																		_context15.prev = 25;
																		_context15.t0 = _context15['catch'](21);
																		_didIteratorError8 = true;
																		_iteratorError8 = _context15.t0;

																	case 29:
																		_context15.prev = 29;
																		_context15.prev = 30;

																		if (!_iteratorNormalCompletion8 && _iterator8.return) {
																			_iterator8.return();
																		}

																	case 32:
																		_context15.prev = 32;

																		if (!_didIteratorError8) {
																			_context15.next = 35;
																			break;
																		}

																		throw _iteratorError8;

																	case 35:
																		return _context15.finish(32);

																	case 36:
																		return _context15.finish(29);

																	case 37:
																		if (!(total == 1 && winningOption)) {
																			_context15.next = 42;
																			break;
																		}

																		_context15.next = 40;
																		return question.channel.send('The winner is **' + winningOption + '** with ' + winningCount + ' votes.').then(function (resultMsg) {
																			return trash.push(resultMsg);
																		});

																	case 40:
																		_context15.next = 44;
																		break;

																	case 42:
																		_context15.next = 44;
																		return question.channel.send(helpers.getNum(question, total).toUpperCase() + ' options were tied with ' + winningCount + ' votes, so the winner will be **' + winningOption + '**.').then(function (resultMsg) {
																			return trash.push(resultMsg);
																		});

																	case 44:
																	case 'end':
																		return _context15.stop();
																}
															}
														}, _callee15, _this4, [[21, 25, 29, 37], [30,, 32, 36]]);
													}));

													return function (_x16, _x17) {
														return _ref15.apply(this, arguments);
													};
												}());

											case 36:
												if (vote.options.includes(winningOption)) {
													_context21.next = 41;
													break;
												}

												_context21.next = 39;
												return helpers.delay(3000);

											case 39:
												_context21.next = 36;
												break;

											case 41:
												if (type == 'askPickTeams') exports.teamPickResult = teamPickResult = winningOption;
												if (type == 'askPickCaptains') exports.captainsPickResult = captainsPickResult = winningOption;
												return _context21.abrupt('break', 79);

											case 44:
												_reactionFilter = function _reactionFilter(reaction, user) {
													return voteReactions.includes(reaction.emoji.name) && !user.bot && players.includes(user.id) && user.id !== question.author.id;
												};

												_context21.next = 47;
												return question.createReactionCollector(_reactionFilter, { time: voteDelay });

											case 47:
												exports.collector = collector = _context21.sent;
												_context21.next = 50;
												return collector.on('end', function () {
													var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(collected, reason) {
														var results, collectedCount, _i3, temp;

														return regeneratorRuntime.wrap(function _callee18$(_context18) {
															while (1) {
																switch (_context18.prev = _context18.next) {
																	case 0:
																		if (!(reason == 'Admin Stop')) {
																			_context18.next = 2;
																			break;
																		}

																		return _context18.abrupt('return');

																	case 2:
																		_context18.next = 4;
																		return collected.map(function () {
																			var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(reaction) {
																				return regeneratorRuntime.wrap(function _callee17$(_context17) {
																					while (1) {
																						switch (_context17.prev = _context17.next) {
																							case 0:
																								voteResults[voteReactions.indexOf(reaction.emoji.name)] = reaction.users.map(function () {
																									var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(user) {
																										return regeneratorRuntime.wrap(function _callee16$(_context16) {
																											while (1) {
																												switch (_context16.prev = _context16.next) {
																													case 0:
																														return _context16.abrupt('return', user);

																													case 1:
																													case 'end':
																														return _context16.stop();
																												}
																											}
																										}, _callee16, _this4);
																									}));

																									return function (_x23) {
																										return _ref20.apply(this, arguments);
																									};
																								}()).length - 1;

																							case 1:
																							case 'end':
																								return _context17.stop();
																						}
																					}
																				}, _callee17, _this4);
																			}));

																			return function (_x22) {
																				return _ref19.apply(this, arguments);
																			};
																		}());

																	case 4:
																		results = parseInt(voteResults.reduce(function (a, b) {
																			return a + b;
																		}));
																		collectedCount = 0;

																		while (results) {
																			collectedCount += results % 10;
																			results = Math.floor(results / 10);
																		}

																		if (!(!collectedCount > 0)) {
																			_context18.next = 14;
																			break;
																		}

																		_context18.next = 10;
																		return randomCaptains();

																	case 10:
																		_context18.next = 12;
																		return message.channel.send('No players voted in time... The captains will be **<@' + captains[0] + '>** & **<@' + captains[1] + '>**').then(function (resultMsg) {
																			return trash.push(resultMsg);
																		});

																	case 12:
																		_context18.next = 30;
																		break;

																	case 14:
																		// await question.channel.send(`**${collectedCount} votes collected**`).then(countMsg => trash.push(countMsg));
																		winningCount = Math.max.apply(Math, _toConsumableArray(voteResults));
																		_i3 = voteResults.indexOf(winningCount);

																		captains[0] = vote.options[_i3];
																		_context18.next = 19;
																		return voteResults.splice(_i3, 1, -1);

																	case 19:
																		_context18.next = 21;
																		return voteResults.indexOf(Math.max.apply(Math, _toConsumableArray(voteResults)));

																	case 21:
																		_i3 = _context18.sent;

																		captains[1] = vote.options[_i3];
																		_context18.next = 25;
																		return voteResults.splice(voteResults.indexOf(-1), 1, winningCount);

																	case 25:
																		if (!captains[1]) {
																			temp = players;

																			temp.splice(temp.indexOf(captains[0]), 1);
																			captains[1] = temp[Math.floor(Math.random() * temp.length)];
																		}
																		teamOne[0] = captains[0];
																		teamTwo[0] = captains[1];
																		_context18.next = 30;
																		return question.channel.send('The captains are **<@' + captains[0] + '>** and **<@' + captains[1] + '>**').then(function (resultMsg) {
																			return trash.push(resultMsg);
																		});

																	case 30:
																	case 'end':
																		return _context18.stop();
																}
															}
														}, _callee18, _this4);
													}));

													return function (_x20, _x21) {
														return _ref18.apply(this, arguments);
													};
												}());

											case 50:
												if (!(!captains[0] || !captains[1])) {
													_context21.next = 55;
													break;
												}

												_context21.next = 53;
												return helpers.delay(3000);

											case 53:
												_context21.next = 50;
												break;

											case 55:
												_context21.next = 57;
												return helpers.delay(3000);

											case 57:
												return _context21.abrupt('break', 79);

											case 58:
												_reactionFilter2 = function _reactionFilter2(reaction, user) {
													return voteReactions.includes(reaction.emoji.name) && !user.bot && captains.includes(user.id) && user.id !== question.author.id;
												};

												_context21.next = 61;
												return question.createReactionCollector(_reactionFilter2);

											case 61:
												exports.collector = collector = _context21.sent;
												lastPickMsg = void 0;

												exports.captainsOnlyVote = captainsOnlyVote = true;
												_context21.next = 66;
												return collector.on('collect', function () {
													var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(reaction) {
														var picker, pickerTeam, otherTeam, _ref22, _i4;

														return regeneratorRuntime.wrap(function _callee19$(_context19) {
															while (1) {
																switch (_context19.prev = _context19.next) {
																	case 0:
																		_context19.next = 2;
																		return reaction.users.map(function (user) {
																			return user;
																		})[1];

																	case 2:
																		picker = _context19.sent;
																		_context19.next = 5;
																		return reaction.remove(picker.id);

																	case 5:
																		pickerTeam = teamOne, otherTeam = teamTwo;

																		if (captains.includes(picker.id)) {
																			_context19.next = 8;
																			break;
																		}

																		return _context19.abrupt('return');

																	case 8:
																		if (teamTwo.includes(picker.id)) {
																			;
																			_ref22 = [otherTeam, pickerTeam];
																			pickerTeam = _ref22[0];
																			otherTeam = _ref22[1];
																		}
																		if (!(lastPickerId !== picker.id && !(pickerTeam.length - otherTeam.length + 1 > 1))) {
																			_context19.next = 40;
																			break;
																		}

																		_context19.next = 12;
																		return reaction.remove(question.author.id);

																	case 12:
																		if (!(pickerTeam == teamOne && !teamOne.includes(vote.options[voteReactions.indexOf(reaction.emoji.name)]) && !teamTwo.includes(vote.options[voteReactions.indexOf(reaction.emoji.name)]))) {
																			_context19.next = 17;
																			break;
																		}

																		_context19.next = 15;
																		return teamOne.push(vote.options[voteReactions.indexOf(reaction.emoji.name)]);

																	case 15:
																		_context19.next = 23;
																		break;

																	case 17:
																		if (!(pickerTeam == teamTwo && !teamOne.includes(vote.options[voteReactions.indexOf(reaction.emoji.name)]) && !teamTwo.includes(vote.options[voteReactions.indexOf(reaction.emoji.name)]))) {
																			_context19.next = 22;
																			break;
																		}

																		_context19.next = 20;
																		return teamTwo.push(vote.options[voteReactions.indexOf(reaction.emoji.name)]);

																	case 20:
																		_context19.next = 23;
																		break;

																	case 22:
																		return _context19.abrupt('return');

																	case 23:
																		exports.lastPickerId = lastPickerId = picker.id;
																		embed.description = 'One at a time, starting with Team #1';
																		embed.fields[2].value = '';
																		for (_i4 = 0; _i4 < vote.options.length; _i4++) {
																			if (teamOne.includes(vote.options[_i4])) embed.fields[2].value += '\n:one: - <@' + vote.options[_i4] + '>';else if (teamTwo.includes(vote.options[_i4])) embed.fields[2].value += '\n:two: - <@' + vote.options[_i4] + '>';else embed.fields[2].value += '\n:regional_indicator_' + helpers.alphabet[_i4] + ': - <@' + vote.options[_i4] + '>';
																		}
																		_context19.next = 29;
																		return question.edit({ embed: embed }).catch(function (err) {
																			return console.log(err);
																		});

																	case 29:
																		exports.startQuestion = startQuestion = question;
																		exports.startQuestionEmbed = startQuestionEmbed = embed;

																		if (!lastPickMsg) {
																			_context19.next = 36;
																			break;
																		}

																		_context19.next = 34;
																		return lastPickMsg.edit(picker.username + ' just picked!').catch(function (err) {
																			return console.log(err);
																		});

																	case 34:
																		_context19.next = 39;
																		break;

																	case 36:
																		_context19.next = 38;
																		return question.channel.send(picker.username + ' just picked!');

																	case 38:
																		lastPickMsg = _context19.sent;

																	case 39:
																		delete reaction.users.map(function (user) {
																			return user;
																		})[1];

																	case 40:
																	case 'end':
																		return _context19.stop();
																}
															}
														}, _callee19, _this4);
													}));

													return function (_x24) {
														return _ref21.apply(this, arguments);
													};
												}());

											case 66:
												if (!(teamOne.length + teamTwo.length < startCount)) {
													_context21.next = 71;
													break;
												}

												_context21.next = 69;
												return helpers.delay(3000);

											case 69:
												_context21.next = 66;
												break;

											case 71:
												if (!lastPickMsg) {
													_context21.next = 74;
													break;
												}

												_context21.next = 74;
												return lastPickMsg.delete().catch(function () {
													return console.log('' + _strings.strings.cantDel);
												});

											case 74:
												_context21.next = 76;
												return message.channel.send('Teams picked! Setting up...').then(function (resultMsg) {
													return trash.push(resultMsg);
												});

											case 76:
												collector.stop();
												exports.captainsOnlyVote = captainsOnlyVote = false;
												return _context21.abrupt('break', 79);

											case 79:
											case 'end':
												return _context21.stop();
										}
									}
								}, _callee20, _this4, [[5, 15, 19, 27], [20,, 22, 26]]);
							}));

							return function (_x15) {
								return _ref14.apply(this, arguments);
							};
						}());

					case 83:
					case 'end':
						return _context22.stop();
				}
			}
		}, _callee21, this, [[16, 27, 31, 39], [32,, 34, 38], [56, 68, 72, 80], [73,, 75, 79]]);
	}));

	return function askQuestion(_x12, _x13, _x14) {
		return _ref13.apply(this, arguments);
	};
}();

// =============== PUG FUNCTIONS ===============

var randomCaptains = function () {
	var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
		var randomIndex;
		return regeneratorRuntime.wrap(function _callee22$(_context23) {
			while (1) {
				switch (_context23.prev = _context23.next) {
					case 0:
						randomIndex = Math.floor(Math.random() * players.length);

						captains[0] = players[randomIndex];
						randomIndex = Math.floor(Math.random() * players.length);
						while (captains.length < 2) {
							if (!captains.includes(players[randomIndex])) captains[1] = players[randomIndex];
						}
						teamOne[0] = captains[0];
						teamTwo[0] = captains[1];

					case 6:
					case 'end':
						return _context23.stop();
				}
			}
		}, _callee22, this);
	}));

	return function randomCaptains() {
		return _ref23.apply(this, arguments);
	};
}();

var randomTeams = function () {
	var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(list) {
		var bool, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, player;

		return regeneratorRuntime.wrap(function _callee23$(_context24) {
			while (1) {
				switch (_context24.prev = _context24.next) {
					case 0:
						bool = true;
						_context24.next = 3;
						return helpers.shuffle(list);

					case 3:
						_iteratorNormalCompletion9 = true;
						_didIteratorError9 = false;
						_iteratorError9 = undefined;
						_context24.prev = 6;
						_iterator9 = list[Symbol.iterator]();

					case 8:
						if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
							_context24.next = 21;
							break;
						}

						player = _step9.value;

						if (!(!teamOne.includes(player) && !teamTwo.includes(player))) {
							_context24.next = 18;
							break;
						}

						if (!bool) {
							_context24.next = 14;
							break;
						}

						_context24.next = 14;
						return teamOne.push(player);

					case 14:
						if (bool) {
							_context24.next = 17;
							break;
						}

						_context24.next = 17;
						return teamTwo.push(player);

					case 17:
						bool = !bool;

					case 18:
						_iteratorNormalCompletion9 = true;
						_context24.next = 8;
						break;

					case 21:
						_context24.next = 27;
						break;

					case 23:
						_context24.prev = 23;
						_context24.t0 = _context24['catch'](6);
						_didIteratorError9 = true;
						_iteratorError9 = _context24.t0;

					case 27:
						_context24.prev = 27;
						_context24.prev = 28;

						if (!_iteratorNormalCompletion9 && _iterator9.return) {
							_iterator9.return();
						}

					case 30:
						_context24.prev = 30;

						if (!_didIteratorError9) {
							_context24.next = 33;
							break;
						}

						throw _iteratorError9;

					case 33:
						return _context24.finish(30);

					case 34:
						return _context24.finish(27);

					case 35:
					case 'end':
						return _context24.stop();
				}
			}
		}, _callee23, this, [[6, 23, 27, 35], [28,, 30, 34]]);
	}));

	return function randomTeams(_x25) {
		return _ref24.apply(this, arguments);
	};
}();

var cleanUp = exports.cleanUp = function () {
	var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(messages, delayBefore, delayAfter) {
		var _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, msg;

		return regeneratorRuntime.wrap(function _callee24$(_context25) {
			while (1) {
				switch (_context25.prev = _context25.next) {
					case 0:
						if (!delayBefore) {
							_context25.next = 3;
							break;
						}

						_context25.next = 3;
						return helpers.delay(delayBefore);

					case 3:
						if (!messages.length) {
							_context25.next = 23;
							break;
						}

						_iteratorNormalCompletion10 = true;
						_didIteratorError10 = false;
						_iteratorError10 = undefined;
						_context25.prev = 7;

						for (_iterator10 = messages[Symbol.iterator](); !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
							msg = _step10.value;

							trash.splice(trash.indexOf(msg), 1);
							msg.delete().catch(function () {
								return console.log('' + _strings.strings.cantCleanUp);
							});
						}
						_context25.next = 15;
						break;

					case 11:
						_context25.prev = 11;
						_context25.t0 = _context25['catch'](7);
						_didIteratorError10 = true;
						_iteratorError10 = _context25.t0;

					case 15:
						_context25.prev = 15;
						_context25.prev = 16;

						if (!_iteratorNormalCompletion10 && _iterator10.return) {
							_iterator10.return();
						}

					case 18:
						_context25.prev = 18;

						if (!_didIteratorError10) {
							_context25.next = 21;
							break;
						}

						throw _iteratorError10;

					case 21:
						return _context25.finish(18);

					case 22:
						return _context25.finish(15);

					case 23:
						if (!delayAfter) {
							_context25.next = 26;
							break;
						}

						_context25.next = 26;
						return helpers.delay(delayAfter);

					case 26:
					case 'end':
						return _context25.stop();
				}
			}
		}, _callee24, this, [[7, 11, 15, 23], [16,, 18, 22]]);
	}));

	return function cleanUp(_x26, _x27, _x28) {
		return _ref25.apply(this, arguments);
	};
}();

var end = exports.end = function () {
	var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(message) {
		var _this5 = this;

		var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Game finished';

		var reply, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, player, member;

		return regeneratorRuntime.wrap(function _callee26$(_context27) {
			while (1) {
				switch (_context27.prev = _context27.next) {
					case 0:
						if (statusCollector) statusCollector.stop();
						if (startMsg.reactions) startMsg.clearReactions();

						if (!finalPlayersMsg.reactions) {
							_context27.next = 5;
							break;
						}

						_context27.next = 5;
						return finalPlayersMsg.clearReactions();

					case 5:
						reply = '**PUG has ended!**\n**Reason: **' + reason;

						if (_config.cfg.useMissedPUGChannel && missedOutRoom) {
							missedOutRoom.members.map(function () {
								var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(member) {
									return regeneratorRuntime.wrap(function _callee25$(_context26) {
										while (1) {
											switch (_context26.prev = _context26.next) {
												case 0:
													_context26.next = 2;
													return member.setVoiceChannel(waitingRoom).catch(function (err) {
														return console.log(err);
													});

												case 2:
												case 'end':
													return _context26.stop();
											}
										}
									}, _callee25, _this5);
								}));

								return function (_x31) {
									return _ref27.apply(this, arguments);
								};
							}());
						}
						_iteratorNormalCompletion11 = true;
						_didIteratorError11 = false;
						_iteratorError11 = undefined;
						_context27.prev = 10;
						_iterator11 = players[Symbol.iterator]();

					case 12:
						if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
							_context27.next = 20;
							break;
						}

						player = _step11.value;
						member = message.guild.members.get(player);
						_context27.next = 17;
						return member.setVoiceChannel(waitingRoom).catch(function (err) {
							return console.log(err);
						});

					case 17:
						_iteratorNormalCompletion11 = true;
						_context27.next = 12;
						break;

					case 20:
						_context27.next = 26;
						break;

					case 22:
						_context27.prev = 22;
						_context27.t0 = _context27['catch'](10);
						_didIteratorError11 = true;
						_iteratorError11 = _context27.t0;

					case 26:
						_context27.prev = 26;
						_context27.prev = 27;

						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}

					case 29:
						_context27.prev = 29;

						if (!_didIteratorError11) {
							_context27.next = 32;
							break;
						}

						throw _iteratorError11;

					case 32:
						return _context27.finish(29);

					case 33:
						return _context27.finish(26);

					case 34:
						exports.state = state = 'waiting';
						exports.start = start = false;
						exports.captainsOnlyVote = captainsOnlyVote = false;

						if (!finalPlayersMsg.reactions) {
							_context27.next = 40;
							break;
						}

						_context27.next = 40;
						return finalPlayersMsg.clearReactions();

					case 40:
						exports.server = server = {};
						exports.lockedTeams = lockedTeams = [];
						exports.ready = ready = [];
						exports.teamTwo = teamTwo = [];
						exports.teamOne = teamOne = [];
						exports.captains = captains = [];
						_context27.next = 48;
						return [];

					case 48:
						exports.players = players = _context27.sent;

						if (!(queue.length > startCount)) {
							_context27.next = 58;
							break;
						}

						_context27.next = 52;
						return queue.slice(startCount, queue.length);

					case 52:
						exports.queue = queue = _context27.sent;
						_context27.next = 55;
						return '\nWaiting players have been added!';

					case 55:
						reply += _context27.sent;
						_context27.next = 64;
						break;

					case 58:
						_context27.next = 60;
						return [];

					case 60:
						exports.queue = queue = _context27.sent;
						_context27.next = 63;
						return '\nThe queue has been reset!';

					case 63:
						reply += _context27.sent;

					case 64:
						_context27.next = 66;
						return [];

					case 66:
						votes.pickCaptains.options = _context27.sent;
						_context27.next = 69;
						return [];

					case 69:
						votes.pickTeams.options = _context27.sent;
						_context27.next = 72;
						return message.channel.send(reply);

					case 72:
						if (channelOne) channelOne.delete().catch(function (cantDel) {
							return console.log('Channel: ', cantDel);
						});
						if (channelTwo) channelTwo.delete().catch(function (cantDel) {
							return console.log('Channel: ', cantDel);
						});
						_context27.next = 76;
						return cleanUp(trash, 0, 3000);

					case 76:
						if (!(queue.length == startCount)) {
							_context27.next = 80;
							break;
						}

						run(message);
						_context27.next = 83;
						break;

					case 80:
						if (!queue[0]) {
							_context27.next = 83;
							break;
						}

						_context27.next = 83;
						return teams(message, 1);

					case 83:
					case 'end':
						return _context27.stop();
				}
			}
		}, _callee26, this, [[10, 22, 26, 34], [27,, 29, 33]]);
	}));

	return function end(_x30) {
		return _ref26.apply(this, arguments);
	};
}();

var teams = exports.teams = function () {
	var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(message) {
		var sticky = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		var _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, player, _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, _player4, i, limit, _i5, _i6, msg;

		return regeneratorRuntime.wrap(function _callee27$(_context28) {
			while (1) {
				switch (_context28.prev = _context28.next) {
					case 0:
						if (!(teamMsg.channel && !teamMsg.deleted)) {
							_context28.next = 4;
							break;
						}

						trash.splice(trash.indexOf(teamMsg), 1);
						_context28.next = 4;
						return teamMsg.delete().catch(function (err) {
							return console.log('teamMsg\n', err);
						});

					case 4:
						_context28.next = 6;
						return helpers.initEmbed(message, 1);

					case 6:
						exports.embed = embed = _context28.sent;

						if (!players[0] && state !== 'startCheck') exports.state = state = 'waiting';
						embed.title = '**PUG Status**   ( ' + queue.length + ' Players )';
						if (state == 'playersFound' && _config.cfg.requireReadyUp || state == 'ready') embed.title = '**PUG Status**   ( ' + ready.length + ' of ' + startCount + ' Ready )';else embed.title = '**PUG Status**   ( ' + queue.length + ' Players )';
						embed.description = '' + states.pug[state].name;
						embed.fields[0].name = 'Queue';
						embed.fields[0].value = '' + _strings.strings.noPlayersQueudForPug;
						// No players queued

						if (queue[0]) {
							_context28.next = 15;
							break;
						}

						return _context28.abrupt('return', helpers.reply(message, { embed: embed }, 6000, true));

					case 15:
						if (!(teamOne.length == startCount / 2)) {
							_context28.next = 63;
							break;
						}

						embed.fields[0].name = 'Team #1';
						embed.fields[0].value = '';
						_iteratorNormalCompletion12 = true;
						_didIteratorError12 = false;
						_iteratorError12 = undefined;
						_context28.prev = 21;
						for (_iterator12 = teamOne[Symbol.iterator](); !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
							player = _step12.value;

							if (state == 'ready' && ready.includes(player) && _config.cfg.requireReadyUp) embed.fields[0].value += '\n<@' + player + '> *- Ready*';else embed.fields[0].value += '\n<@' + player + '>';
						}
						_context28.next = 29;
						break;

					case 25:
						_context28.prev = 25;
						_context28.t0 = _context28['catch'](21);
						_didIteratorError12 = true;
						_iteratorError12 = _context28.t0;

					case 29:
						_context28.prev = 29;
						_context28.prev = 30;

						if (!_iteratorNormalCompletion12 && _iterator12.return) {
							_iterator12.return();
						}

					case 32:
						_context28.prev = 32;

						if (!_didIteratorError12) {
							_context28.next = 35;
							break;
						}

						throw _iteratorError12;

					case 35:
						return _context28.finish(32);

					case 36:
						return _context28.finish(29);

					case 37:
						if (!(teamTwo.length == startCount / 2)) {
							_context28.next = 60;
							break;
						}

						embed.fields[0].inline = true;
						embed.fields[1] = teamTwoField;
						embed.fields[1].value = '';
						_iteratorNormalCompletion13 = true;
						_didIteratorError13 = false;
						_iteratorError13 = undefined;
						_context28.prev = 44;
						for (_iterator13 = teamTwo[Symbol.iterator](); !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
							_player4 = _step13.value;

							if (state == 'ready' && ready.includes(_player4) && _config.cfg.requireReadyUp) embed.fields[1].value += '\n<@' + _player4 + '> *- Ready*';else embed.fields[1].value += '\n<@' + _player4 + '>';
						}
						_context28.next = 52;
						break;

					case 48:
						_context28.prev = 48;
						_context28.t1 = _context28['catch'](44);
						_didIteratorError13 = true;
						_iteratorError13 = _context28.t1;

					case 52:
						_context28.prev = 52;
						_context28.prev = 53;

						if (!_iteratorNormalCompletion13 && _iterator13.return) {
							_iterator13.return();
						}

					case 55:
						_context28.prev = 55;

						if (!_didIteratorError13) {
							_context28.next = 58;
							break;
						}

						throw _iteratorError13;

					case 58:
						return _context28.finish(55);

					case 59:
						return _context28.finish(52);

					case 60:
						exports.lockedTeams = lockedTeams = players.slice(0);
						_context28.next = 64;
						break;

					case 63:
						// Players have no captains / teams
						if (players[0]) {
							embed.fields[0].value = '';
							for (i = 0; i < players.length; i++) {
								if (ready.includes(players[i]) && _config.cfg.requireReadyUp) embed.fields[0].value += '\n#' + (i + 1) + ' <@' + players[i] + '> *- Ready*';else embed.fields[0].value += '\n#' + (i + 1) + ' <@' + players[i] + '>';
							}
						}
						// Queue but no players
						else if (queue[0]) {
								limit = queue.length;

								if (state == 'startCheck' && queue.length > startCount) limit = startCount;
								embed.fields[0].value = '';
								for (_i5 = 0; _i5 < limit; _i5++) {
									embed.fields[0].value += '\n#' + (_i5 + 1) + ' <@' + queue[_i5] + '>';
								}
							}

					case 64:
						if (!(queue.length > startCount)) {
							_context28.next = 71;
							break;
						}

						_context28.next = 67;
						return embed.fields.push(playersField);

					case 67:
						embed.fields[embed.fields.length - 2].value += '\n\u3164';
						embed.fields[embed.fields.length - 1].name = 'Missed Out';
						embed.fields[embed.fields.length - 1].value = '';
						for (_i6 = 0; _i6 < queue.length; _i6++) {
							if (!players.includes(queue[_i6]) && _i6 >= startCount) embed.fields[embed.fields.length - 1].value += '\n#' + (_i6 - startCount + 1) + ' <@' + queue[_i6] + '>';
						}

					case 71:
						msg = {};
						_context28.t2 = sticky;
						_context28.next = _context28.t2 === 0 ? 75 : _context28.t2 === 1 ? 77 : _context28.t2 === 2 ? 79 : 81;
						break;

					case 75:
						// Temp
						msg = helpers.reply(message, { embed: embed }, 10000, true);
						return _context28.abrupt('return', msg);

					case 77:
						// Semi-Perm
						msg = message.channel.send({ embed: embed }).then(function (teamsMsg) {
							exports.teamMsg = teamMsg = teamsMsg;
						});
						return _context28.abrupt('return', msg);

					case 79:
						// Perm
						msg = message.channel.send({ embed: embed });
						return _context28.abrupt('return', msg);

					case 81:
					case 'end':
						return _context28.stop();
				}
			}
		}, _callee27, this, [[21, 25, 29, 37], [30,, 32, 36], [44, 48, 52, 60], [53,, 55, 59]]);
	}));

	return function teams(_x33) {
		return _ref28.apply(this, arguments);
	};
}();

var _helpers = require('./helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _states = require('./states.json');

var states = _interopRequireWildcard(_states);

var _votes = require('./votes.json');

var votes = _interopRequireWildcard(_votes);

var _config = require('../../settings/config.js');

var _strings = require('./strings.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var teamTwoField = exports.teamTwoField = {
	"name": 'Team #2',
	"value": '',
	"inline": true
},
    playersField = exports.playersField = {
	"name": 'Players',
	"value": '',
	"inline": false
},
    trash = exports.trash = [];

var state = exports.state = void 0,
    startCount = exports.startCount = _config.cfg.pugGameCfg.sandstorm.teamSize * 2,
    start = exports.start = false,
    neededCount = exports.neededCount = startCount / 5 + 1,
    collector = exports.collector = void 0,
    statusCollector = exports.statusCollector = void 0,
    voteDelay = exports.voteDelay = _config.cfg.voteDelay,
    voteReactions = exports.voteReactions = [],
    voteResults = exports.voteResults = [],
    queue = exports.queue = [],
    players = exports.players = [],
    captains = exports.captains = [],
    teamOne = exports.teamOne = [],
    teamTwo = exports.teamTwo = [],
    ready = exports.ready = [],
    lockedTeams = exports.lockedTeams = [],
    lastPickerId = exports.lastPickerId = '',
    waitingRoom = exports.waitingRoom = void 0,
    missedOutRoom = exports.missedOutRoom = void 0,
    channelOne = exports.channelOne = void 0,
    channelTwo = exports.channelTwo = void 0,
    teamPickResult = exports.teamPickResult = void 0,
    captainsPickResult = exports.captainsPickResult = void 0,
    captainsOnlyVote = exports.captainsOnlyVote = false,
    embed = exports.embed = {},
    server = exports.server = {},
    startMsg = exports.startMsg = {},
    finalPlayersMsg = exports.finalPlayersMsg = {},
    teamMsg = exports.teamMsg = {},
    startQuestion = exports.startQuestion = {},
    startQuestionEmbed = exports.startQuestionEmbed = {},
    waitQuestion = exports.waitQuestion = {};

if (state == undefined || state == null) exports.state = state = 'waiting';

// For Testing
if (_config.cfg.testMode && !_config.cfg.devMode) {
	exports.startCount = startCount = 4;
	exports.voteDelay = voteDelay = 6000;
	exports.neededCount = neededCount = startCount / 2;
}
if (_config.cfg.devMode) {
	exports.startCount = startCount = 4;
	exports.voteDelay = voteDelay = 5000;
	exports.neededCount = neededCount = startCount / 2;
}