import * as helpers from '../assets/helpers.js'
import * as pug from '../assets/pug.js'
import { cfg } from '../../settings/config.js'
import { strings } from '../assets/strings.js'

export default {
	name: `ready`,
	aliases: [`rdy`],
	guildOnly: true,
	pugCommand: true,
	description: `Ready up for the PUG, once teams are set.`,
	usage: `<@user>`,
	example: `all`,
	async execute(message, args) {
		const mentions = []
		if (pug.state !== `ready`) return helpers.reply(message, `you can't ready up at this time.`)
		if (!message.mentions.users.size) {
			if (args[0] == `all`) {
				if (!message.member.roles.some(role => cfg.botModeratorRoles.includes(role.name))) return helpers.reply(message, `${strings.commandRequiresAdmin}`)
				for (const player of pug.players) {
					if (pug.ready.includes(`X${player}`)) await pug.ready.splice(pug.ready.indexOf(`X${player}`), 1, player)
					else if (!pug.ready.includes(player)) await pug.ready.push(player)
				}
			}
			else if (!pug.players.includes(message.author.id)) return helpers.reply(message, `${strings.wasntInPugOnReady}`)
			else if (pug.ready.includes(message.author.id)) return helpers.reply(message, `you are already ready.`)
			else if (pug.ready.includes(`X${message.author.id}`)) pug.ready.splice(pug.ready.indexOf(message.author.id), 1, message.author.id)
			else pug.ready.push(message.author.id)
		}
		else {
			if (!message.member.roles.some(role => cfg.botModeratorRoles.includes(role.name))) return helpers.reply(message, `${strings.commandRequiresAdmin}`)
			message.mentions.users.map(async user => {
				if (pug.players.includes(user.id) && !pug.ready.includes(user.id)) await mentions.push(user.id)
			})
			if (!mentions.length) return helpers.reply(message, `you can't ready them at this time.`)
			for (const player of mentions) {
				if (pug.ready.includes(`X${player}`)) await pug.ready.splice(pug.ready.indexOf(`X${player}`), 1, player)
				else if (!pug.ready.includes(player)) await pug.ready.push(player)
			}
		}
		await pug.teams(message, 1)
	},
}
