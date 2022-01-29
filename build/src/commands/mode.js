'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _config = require('../../settings/config.js');

var _strings = require('../assets/strings.js');

var _package = require('../../package.json');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
	name: 'mode',
	aliases: ['version', 'v'],
	guildOnly: true,
	description: 'Check the bot version or switch between Dev, Test & Live modes.',
	// usage: `<mode> <on|off>`,
	// example: `test off`,
	execute: function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message, args) {
			var embed;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							if (!(message.author.id !== '205622651107016705')) {
								_context.next = 2;
								break;
							}

							return _context.abrupt('return', message.channel.send('Only <@205622651107016705> can use this command.'));

						case 2:
							_context.next = 4;
							return helpers.initEmbed(message);

						case 4:
							embed = _context.sent;

							embed.title = '**Version Check**';
							embed.description = '\u3164\n' + _strings.strings.botVersionTitle + ' `' + _package.version + '`\n';
							/*
       if (args[0] == `dev`) {
       	if (args[1] == `off`) cfg.devMode == false;
       	else if (args[1] == `on`) {
       		cfg.testMode == true;
       		cfg.devMode == true;
       	}
       }
       else if (args[0] == `test`) {
       	if (args[1] == `off`) {
       		cfg.testMode == false;
       		cfg.devMode == false;
       	}
       	else if (args[1] == `on`) cfg.testMode == true;
       }
       */
							if (_config.cfg.devMode) embed.description += '\n```Development Mode```\n';else if (_config.cfg.testMode) embed.description += '\n```Testing Mode```\n';else if (!_config.cfg.devMode && !_config.cfg.testMode) embed.description += '\n```Live Alpha```\n';
							message.channel.send({ embed: embed });

						case 9:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, this);
		}));

		function execute(_x, _x2) {
			return _ref.apply(this, arguments);
		}

		return execute;
	}()
};