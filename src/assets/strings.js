import { cfg } from '../../settings/config.js'
import { version } from '../../package.json'

export const strings = {

	botName: `WarBot`,
	author: `WarBot Modified by and idiot named Scarecrow`,

	commandError: `there was an error trying to execute the command`,
	unknownCommand: `I don't recognise that command, but you used my prefix (${cfg.prefix}).`,
	commandRequiresAdmin: `you must be a Bot Moderator for that command.`,
	serverCommandUsedOutsideServer: `I can't execute that command inside DM's.`,
	noArgsDefault: `you didn't provide any arguments!`,
	commandUsageHeader: `The proper usage would be:`,

	botVersionTitle: `Running Alpha version`,
	noTaggedUser: `you need to **@mention** a user!`,
	cantDel: `Delete error. Ignore if perms are correct`,
	cantCleanUp: `Cleanup error. Ignore if perms are correct`,

	//pugCommandInNonPugChannel: `you must be in a PUG channel to use that command.`,
	pugCommandInNonPugChannel: `you must be in #warbot to use that command.`,
	joinedPugQueue: `joined the PUG queue.`,
	leftPugQueue: `left the PUG queue.`,
	leftPugQueueOffline: `left the PUG queue, by going OFFLINE`,
	alreadyInPugQueue: `already queued for the PUG.`,
	wasntQueuedForPugOnRemove: `wasn't queued for the PUG.`,
	wasntInPugOnReady: `isn't playing in this PUG.`,
	lockedPlayerOnRemove: `is currently locked in as playing. Please use \`${cfg.prefix}swap @user\` with someone in the waiting list.`,
	notlockedPlayerOnSwap: `not currently locked in as playing. Please use \`${cfg.prefix}rm\` or \`${cfg.prefix}leave\`, instead.`,
	noPlayersQueudForPug: `No players queued`,
	playerIsReady: `readied up!`,

	startCheck: `\nClick :white_check_mark: to start the PUG!\nOnce started, \`${cfg.prefix}swap @in @out\` as you can no longer \`${cfg.prefix}remove\`\n\nClick :no_entry_sign: if someone is AFK or no longer playing, to edit the queue.\nOnce you're happy, you click start on the next message\n\nClick :skull: to reset the PUG queue. (PUG Helpers Only)\n\nClick :arrow_forward: to force start the PUG. (PUG Helpers Only)\nㅤ`,

	get botStatus() {
		let status = `${cfg.prefix}help | ${this.botName} ${version}`
		if (cfg.testMode && !cfg.devMode) status = `${cfg.prefix}help | Testing ${version}`
		if (cfg.devMode) status = `${cfg.prefix}help | Dev ${version}`
		return status
	},
}
