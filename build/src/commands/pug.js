'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _pug = require('../assets/pug.js');

var pug = _interopRequireWildcard(_pug);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
	name: 'pug',
	aliases: ['status', 'queue'],
	guildOnly: true,
	description: 'Check the PUG waiting list & status.',
	execute: function execute(message, args) {
		if (args[0]) pug.teams(message, parseInt(args[0]));else pug.teams(message);
	}
};