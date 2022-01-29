'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.makeRole = exports.makeChannel = exports.initEmbed = exports.alphabet = undefined;

var initEmbed = exports.initEmbed = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message) {
		var hasField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var embed, fields;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						embed = {
							"title": '',
							"description": ' ',
							"color": 1878473,
							"timestamp": new Date(Date.now()).toISOString(),
							"author": {
								"name": '' + message.guild.name,
								"icon_url": '' + message.guild.iconURL
							},
							"thumbnail": {
								"url": '' + message.guild.iconURL
							},
							"footer": {
								"icon_url": '' + message.guild.iconURL,
								"text": '' + _strings.strings.author
							}
						}, fields = [{
							"name": 'Options',
							"value": '*No Options Provided...*',
							"inline": false
						}];

						if (hasField > 0) embed.fields = fields;
						return _context.abrupt('return', embed);

					case 3:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function initEmbed(_x2) {
		return _ref.apply(this, arguments);
	};
}();

var makeChannel = exports.makeChannel = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message, channelName, channelType, size) {
		var channel;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return message.guild.createChannel(channelName, channelType, [{
							id: message.guild.id,
							allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD']
						}]).catch(function (err) {
							return console.error('Make Channel Error:\n', err);
						});

					case 2:
						channel = _context2.sent;

						if (!(channelType == 'voice' && size > 1 && size < 99)) {
							_context2.next = 6;
							break;
						}

						_context2.next = 6;
						return channel.setUserLimit(parseInt(size));

					case 6:
						return _context2.abrupt('return', channel);

					case 7:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function makeChannel(_x6, _x7, _x8, _x9) {
		return _ref2.apply(this, arguments);
	};
}();

var makeRole = exports.makeRole = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message, roleName) {
		var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GOLD';
		var position = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var permissions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var mentionable = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
		var role;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return message.guild.createRole({
							name: roleName,
							color: color,
							position: position,
							permissions: permissions,
							mentionable: mentionable
						}).catch(function (err) {
							return console.log(err);
						});

					case 2:
						role = _context3.sent;
						return _context3.abrupt('return', role);

					case 4:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function makeRole(_x14, _x15) {
		return _ref3.apply(this, arguments);
	};
}();

exports.delay = delay;
exports.deleteMsg = deleteMsg;
exports.shuffle = shuffle;
exports.reply = reply;
exports.getNum = getNum;
exports.xpHandler = xpHandler;
exports.logger = logger;

var _config = require('../../settings/config.js');

var _strings = require('./strings.js');

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_sqlite2.default.open('./src/assets/warbot.sqlite');

var alphabet = exports.alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function delay(timeout) {
	return new Promise(function (resolve) {
		return setTimeout(resolve, timeout);
	});
}

function deleteMsg(message) {
	message.channel.fetchMessage(message.id).then(function (fetched) {
		return fetched.delete();
	}).catch(function (err) {
		return console.error(err);
	});
}

function shuffle(array) {
	var counter = void 0,
	    index = void 0,
	    temp = void 0;
	counter = array.length;
	while (counter > 0) {
		index = Math.floor(Math.random() * counter);
		counter--;
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

function reply(message) {
	var replyContent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	var deleteDelay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3500;
	var say = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	if (say) {
		message.channel.send(replyContent).then(function (sentMessage) {
			sentMessage.delete(deleteDelay).catch(function (cantDel) {
				return console.log(cantDel);
			});
		}).catch(function (err) {
			return console.error('Reply Error:\n', err);
		});
	} else {
		message.reply(replyContent).then(function (sentMessage) {
			sentMessage.delete(deleteDelay).catch(function (cantDel) {
				return console.log(cantDel);
			});
		}).catch(function (err) {
			return console.error('Reply Error:\n', err);
		});
	}
}

function getNum(message, num) {
	var numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
	var str = 'Number must be between 0 and 19.';
	if (num < 0 || num > 19) return str;
	return numbers[num];
}

function xpHandler(message, users) {
	var _loop = function _loop(userId) {
		var member = message.guild.members.get(userId);
		var defaultRank = 'Member';
		var vetRole = message.guild.roles.find(function (role) {
			return role.name == _config.cfg.proPlayerRole;
		});
		_sqlite2.default.get('SELECT * FROM stats WHERE userID = ' + userId).then(function (row) {
			if (!row) return _sqlite2.default.run('INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)', [userId, 1, defaultRank]);
			if (row.pugs + 1 > _config.cfg.proPlayerRolePugCount) {
				member.addRole(vetRole).catch(function (err) {
					return console.log(err);
				});
				row.rank = '' + _config.cfg.proPlayerRole;
			}
			if (row.pugs + 1 < _config.cfg.proPlayerRolePugCount) {
				member.removeRole(vetRole).catch(function (err) {
					return console.log(err);
				});
				row.rank = defaultRank;
			}
			_sqlite2.default.run('UPDATE stats SET pugs = ' + (row.pugs + 1) + ', rank = \'' + row.rank + '\' WHERE userID = ' + userId);
		}).catch(function () {
			_sqlite2.default.run('CREATE TABLE IF NOT EXISTS stats (userID TEXT, pugs INTEGER, rank TEXT)').then(function () {
				_sqlite2.default.run('INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)', [userId, 1, defaultRank]);
			});
		});
	};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = users[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var userId = _step.value;

			_loop(userId);
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

function logger(guild, action, message, xInt, xRole, xMember, xString) {
	/*
 TO DO:
 Member banned
 Member unbanned
 Channel created
 Channel deleted
 Role created
 Role deleted
 Role updated
 Nickname changes
 Username changes
 Voice channel joins
 Voice channel leaves
 Voice channel moves
 Log invites/info
 */
	var logChan = guild.channels.find(function (channel) {
		return _config.cfg.logChannels.includes(channel.name);
	});
	var author = '';
	if (message) author = message.author.tag;else author = guild.name;
	var embed = {
		"description": ' ',
		"color": 1878473,
		"timestamp": new Date(Date.now()).toISOString(),
		"author": {
			"name": '' + author,
			"icon_url": '' + guild.iconURL
		},
		"footer": {
			"icon_url": '' + guild.iconURL
		}
	};
	switch (action) {
		case 'guildMemberAdd':
			embed.description = '**<@' + xMember.user.id + '> joined the server!**';
			embed.color = 65280;
			embed.thumbnail = {};
			embed.thumbnail.url = '' + xMember.user.displayAvatarURL;
			embed.footer.text = 'ID:' + xMember.user.id + ' ';
			embed.author.name = 'Member Joined';
			break;
		case 'guildMemberRemove':
			embed.description = '**<@' + xMember.user.id + '> left the server!**';
			embed.color = 14246185;
			embed.thumbnail = {};
			embed.thumbnail.url = '' + xMember.user.displayAvatarURL;
			embed.footer.text = 'ID:' + xMember.user.id + ' ';
			embed.author.name = 'Member Left';
			break;
		case 'guildMemberRoleAdd':
			embed.description = '**<@' + xMember.user.id + '> was added to `' + xRole.name + '`**';
			embed.footer.text = 'ID:' + xMember.user.id + ' ';
			embed.author.name = '' + xMember.user.tag;
			break;
		case 'guildMemberRoleRemove':
			embed.description = '**<@' + xMember.user.id + '> was removed from `' + xRole.name + '`**';
			embed.footer.text = 'ID:' + xMember.user.id + ' ';
			embed.author.name = '' + xMember.user.tag;
			break;
		case 'kick':
			embed.description = '**' + xMember.user.tag + '**  (' + xMember.user.id + ') **was kicked by <@' + message.author.id + '>\nReason:** `' + xString + '`';
			break;
		case 'ban':
			embed.description = '**' + xMember.user.tag + '**  (' + xMember.user.id + ') **was banned by <@' + message.author.id + '>\nReason:** `' + xString + '`';
			break;
		case 'prune':
			embed.description = '**<@' + message.author.id + '> deleted ' + xInt + ' messages in <#' + message.channel.id + '>**';
			break;
		case 'say':
			embed.description = '**<@' + message.author.id + '> said** the following in <#' + message.channel.id + '>\n```' + xString + '```';
			break;
	}
	logChan.send({ embed: embed });
}