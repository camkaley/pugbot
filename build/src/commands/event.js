'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _config = require('../../settings/config.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
	name: 'event',
	guildOnly: true,
	staffRoleRequired: true,
	argsRequired: true,
	description: 'Create/Edit/Delete an event.',
	usage: '<action> <arg>',
	example: 'create Event Name',
	execute: function execute(message, args) {
		var _this = this;

		if (args.length < 2) return helpers.reply(message, 'Please provide a command function and event name. Try `' + _config.cfg.prefix + 'help ' + this.name + '` for more info');
		var eventName = args.slice(1, args.length).join(' '),
		    channel = void 0;
		switch (true) {
			case args[0] == 'create':
				{
					if (message.guild.roles.find(function (r) {
						return r.name == 'Event: ' + eventName;
					})) return helpers.reply(message, 'This event already exists');
					helpers.makeRole(message, 'Event: ' + eventName).then(function (eventRole) {
						helpers.makeChannel(message, eventName, 'text', 10).then(function () {
							var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(eventChan) {
								return regeneratorRuntime.wrap(function _callee$(_context) {
									while (1) {
										switch (_context.prev = _context.next) {
											case 0:
												if (!(_config.cfg.devMode || _config.cfg.testMode)) {
													_context.next = 7;
													break;
												}

												_context.next = 3;
												return eventChan.overwritePermissions(message.guild.roles.find(function (r) {
													return r.name == '@everyone';
												}), {
													VIEW_CHANNEL: false
												}).catch(function (err) {
													return console.log(err);
												});

											case 3:
												_context.next = 5;
												return eventChan.overwritePermissions(message.guild.roles.find(function (r) {
													return r.name == '' + _config.cfg.botsRoleName;
												}), {
													VIEW_CHANNEL: true
												}).catch(function (err) {
													return console.log(err);
												});

											case 5:
												_context.next = 10;
												break;

											case 7:
												if (!(!_config.cfg.devMode && !_config.cfg.testMode)) {
													_context.next = 10;
													break;
												}

												_context.next = 10;
												return eventChan.overwritePermissions(message.guild.roles.find(function (r) {
													return r.name == '@everyone';
												}), {
													VIEW_CHANNEL: null
												}).catch(function (err) {
													return console.log(err);
												});

											case 10:
												eventChan.setParent(_config.cfg.pugCategoryId).catch(function (err) {
													return console.log(err);
												});
												eventChan.send('**<@' + message.author.id + '> created an event:** <@&' + eventRole.id + '>');
												channel = eventChan;

											case 13:
											case 'end':
												return _context.stop();
										}
									}
								}, _callee, _this);
							}));

							return function (_x) {
								return _ref.apply(this, arguments);
							};
						}()).catch(function (err) {
							return console.log(err);
						});
						console.log('Event created by ' + message.author.tag + ': ' + eventName);
						if (_config.cfg.announcementChannels) {
							var _loop = function _loop(chanName) {
								var textChan = message.guild.channels.find(function (chan) {
									return chan.name == chanName;
								});
								textChan.send('**<@' + message.author.id + '> created an event:** <@&' + eventRole.id + '>');
							};

							var _iteratorNormalCompletion = true;
							var _didIteratorError = false;
							var _iteratorError = undefined;

							try {
								for (var _iterator = _config.cfg.announcementChannels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
									var chanName = _step.value;

									_loop(chanName);
								}
							} catch (err) {
								_didIteratorError = true;
								_iteratorError = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion && _iterator.return) {
										_iterator.return();
									}
								} finally {
									if (_didIteratorError) {
										throw _iteratorError;
									}
								}
							}
						}
					}).catch(function (err) {
						return console.log(err);
					});
					break;
				}
			case args[0] == 'delete' || args[0] == 'del':
				{
					// While being completed
					if (message.author.id !== '140437382704005130') return helpers.reply(message, 'this is under development. Only <@140437382704005130> has access atm');
					if (!message.mentions.roles.size) return helpers.reply(message, 'You must @mention the event role');
					message.mentions.roles.map(function () {
						var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(eventRole) {
							return regeneratorRuntime.wrap(function _callee3$(_context3) {
								while (1) {
									switch (_context3.prev = _context3.next) {
										case 0:
											eventName = eventRole.name;
											eventRole.delete().then(function () {
												if (_config.cfg.announcementChannels) {
													var _loop2 = function _loop2(chanName) {
														var textChan = message.guild.channels.find(function (chan) {
															return chan.name == chanName;
														});
														textChan.send('**<@' + message.author.id + '> deleted an event:** ' + eventName);
													};

													var _iteratorNormalCompletion2 = true;
													var _didIteratorError2 = false;
													var _iteratorError2 = undefined;

													try {
														for (var _iterator2 = _config.cfg.announcementChannels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
															var chanName = _step2.value;

															_loop2(chanName);
														}
													} catch (err) {
														_didIteratorError2 = true;
														_iteratorError2 = err;
													} finally {
														try {
															if (!_iteratorNormalCompletion2 && _iterator2.return) {
																_iterator2.return();
															}
														} finally {
															if (_didIteratorError2) {
																throw _iteratorError2;
															}
														}
													}
												}
											});
											_context3.next = 4;
											return eventName.replace('Event: ', '');

										case 4:
											_context3.next = 6;
											return eventName.replace('#', '');

										case 6:
											_context3.next = 8;
											return eventName.replace(' ', '-');

										case 8:
											if (!channel) channel = message.guild.channels.find(function (c) {
												return c.name.includes(eventName);
											});
											if (channel.position && !channel.deleted) {
												channel.setParent(_config.cfg.archiveCategoryId).then(function () {
													var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(chan) {
														return regeneratorRuntime.wrap(function _callee2$(_context2) {
															while (1) {
																switch (_context2.prev = _context2.next) {
																	case 0:
																		_context2.next = 2;
																		return chan.overwritePermissions(message.guild.roles.find(function (r) {
																			return r.name == '@everyone';
																		}), {
																			VIEW_CHANNEL: false
																		}).catch(function (err) {
																			return console.log(err);
																		});

																	case 2:
																	case 'end':
																		return _context2.stop();
																}
															}
														}, _callee2, _this);
													}));

													return function (_x3) {
														return _ref3.apply(this, arguments);
													};
												}()).catch(function (err) {
													return console.log(err);
												});
											}

										case 10:
										case 'end':
											return _context3.stop();
									}
								}
							}, _callee3, _this);
						}));

						return function (_x2) {
							return _ref2.apply(this, arguments);
						};
					}());
					break;
				}
			case args[0] == 'edit':
				{
					return helpers.reply(message, 'this is under development. Only <@205622651107016705> has access atm');
				}
			default:
				{
					return helpers.reply(message, 'Please provide a command function and event name. Try `' + _config.cfg.prefix + 'help ' + this.name + '` for more info');
				}
		}
	}
};