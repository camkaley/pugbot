import * as helpers from '../assets/helpers.js'
import * as pug from '../assets/pug.js'
import { cfg } from '../../settings/config.js'
import { strings } from '../assets/strings.js'

export default {
	name: `leave`,
	aliases: [`remove`, `rem`, `rm`],
	guildOnly: true,
	pugCommand: true,
	description: `Leave the PUG waiting list.`,
	usage: `<@user>`,
	async execute(message) {
		if (!message.mentions.users.size) {
			if (!pug.queue.includes(message.author.id)) return helpers.reply(message, `${strings.wasntQueuedForPugOnRemove}`)
			if (pug.players.includes(message.author.id)) return helpers.reply(message, `${strings.lockedPlayerOnRemove}`)
			await pug.queue.splice(pug.queue.indexOf(message.author.id), 1)
			await helpers.reply(message, `<@${message.author.id}> ${strings.leftPugQueue}`, pug.voteDelay * 2, true)
			await pug.teams(message, 1)
		}
		else if (message.mentions.users.size == 1) {
			message.mentions.users.map(async user => {
				if (user.id !== message.author.id && !message.member.roles.some(role => cfg.botModeratorRoles.includes(role.name))) return helpers.reply(message, `${strings.commandRequiresAdmin}`)
				if (!pug.queue.includes(user.id)) return helpers.reply(message, `<@${user.id}> wasn't queued for the PUG.`)
				if (pug.players.includes(user.id)) return helpers.reply(message, `${strings.lockedPlayerOnRemove}`)
				await pug.queue.splice(pug.queue.indexOf(user.id), 1)
				if (user.id == message.author.id) await helpers.reply(message, `<@${message.author.id}> ${strings.leftPugQueue}`, pug.voteDelay * 2, true)
				else await helpers.reply(message, `<@${user.id}> ${strings.leftPugQueue.slice(0, strings.leftPugQueue.length - 1)} - *Removed by <@${message.author.id}>*`, pug.voteDelay * 2, true)
				await pug.teams(message, 1)
			})
		}
		else return helpers.reply(message, `please remove 1 person, per command`, 5000)
	},
}
