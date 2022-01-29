'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

var _config = require('../../settings/config.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
	name: 'roll',
	aliases: ['dice'],
	description: 'Roll the dice!',
	usage: '<numberOfDice>',
	guildOnly: true,
	execute: function execute(message, args) {
		var results = [];
		var numOfDice = 1;
		if (args.length && !isNaN(parseInt(args[0]))) numOfDice = parseInt(args[0]);
		if (isNaN(numOfDice) || numOfDice < 1 || numOfDice > 12) return helpers.reply(message, 'Number of dice must be 1-12. eg. `' + _config.cfg.prefix + this.name + '` or `' + _config.cfg.prefix + this.name + ' 2`', 6000);
		for (var i = 0; i < numOfDice; i++) {
			results.push(Math.floor(Math.random() * 6) + 1);
		}if (numOfDice == 1) message.channel.send('<@' + message.author.id + '> rolled the dice and got **' + results + '** \uD83C\uDFB2');else message.channel.send('<@' + message.author.id + '> rolled **' + numOfDice + '** dice and got **' + results.reduce(function (a, b) {
			return a + b;
		}) + '** with **' + results.slice(0, -1).join(', ') + ' & ' + results.slice(-1) + '** \uD83C\uDFB2');
	}
};