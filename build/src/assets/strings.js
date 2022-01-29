'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.strings = undefined;

var _config = require('../../settings/config.js');

var _package = require('../../package.json');

var strings = exports.strings = {

	botName: 'WarBot',
	author: 'WarBot Modified by and idiot named Scarecrow',

	commandError: 'there was an error trying to execute the command',
	unknownCommand: 'I don\'t recognise that command, but you used my prefix (' + _config.cfg.prefix + ').',
	commandRequiresAdmin: 'you must be a Bot Moderator for that command.',
	serverCommandUsedOutsideServer: 'I can\'t execute that command inside DM\'s.',
	noArgsDefault: 'you didn\'t provide any arguments!',
	commandUsageHeader: 'The proper usage would be:',

	botVersionTitle: 'Running Alpha version',
	noTaggedUser: 'you need to **@mention** a user!',
	cantDel: 'Delete error. Ignore if perms are correct',
	cantCleanUp: 'Cleanup error. Ignore if perms are correct',

	//pugCommandInNonPugChannel: `you must be in a PUG channel to use that command.`,
	pugCommandInNonPugChannel: 'you must be in #warbot to use that command.',
	joinedPugQueue: 'joined the PUG queue.',
	leftPugQueue: 'left the PUG queue.',
	leftPugQueueOffline: 'left the PUG queue, by going OFFLINE',
	alreadyInPugQueue: 'already queued for the PUG.',
	wasntQueuedForPugOnRemove: 'wasn\'t queued for the PUG.',
	wasntInPugOnReady: 'isn\'t playing in this PUG.',
	lockedPlayerOnRemove: 'is currently locked in as playing. Please use `' + _config.cfg.prefix + 'swap @user` with someone in the waiting list.',
	notlockedPlayerOnSwap: 'not currently locked in as playing. Please use `' + _config.cfg.prefix + 'rm` or `' + _config.cfg.prefix + 'leave`, instead.',
	noPlayersQueudForPug: 'No players queued',
	playerIsReady: 'readied up!',

	startCheck: '\nClick :white_check_mark: to start the PUG!\nOnce started, `' + _config.cfg.prefix + 'swap @in @out` as you can no longer `' + _config.cfg.prefix + 'remove`\n\nClick :no_entry_sign: if someone is AFK or no longer playing, to edit the queue.\nOnce you\'re happy, you click start on the next message\n\nClick :skull: to reset the PUG queue. (PUG Helpers Only)\n\nClick :arrow_forward: to force start the PUG. (PUG Helpers Only)\n\u3164',

	get botStatus() {
		var status = _config.cfg.prefix + 'help | ' + this.botName + ' ' + _package.version;
		if (_config.cfg.testMode && !_config.cfg.devMode) status = _config.cfg.prefix + 'help | Testing ' + _package.version;
		if (_config.cfg.devMode) status = _config.cfg.prefix + 'help | Dev ' + _package.version;
		return status;
	}
};