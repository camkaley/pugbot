'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _pug = require('../assets/pug.js');

var pug = _interopRequireWildcard(_pug);

var _helpers = require('../assets/helpers.js');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
	name: 'start',
	botModRoleRequired: true,
	guildOnly: false,
	description: 'Manually start the PUG after editing players list.',
	execute: function execute(message) {
		if (!pug.players[0] && pug.queue.length >= pug.startCount) {
			if (pug.collector) pug.collector.stop();
			if (pug.waitQuestion) helpers.deleteMsg(pug.waitQuestion);
			pug.run(message);
		}
	}
};