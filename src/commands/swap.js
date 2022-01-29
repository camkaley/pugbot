import * as helpers from '../assets/helpers.js'
import * as pug from '../assets/pug.js'
import { cfg } from '../../settings/config.js'
import { strings } from '../assets/strings.js'

export default {
	name: `swap`,
	aliases: [`sw`],
	guildOnly: true,
	pugCommand: true,
	description: `Swap in another member, replacing yourself or another PUG player`,
	usage: `<@user-to-join> <@user-to-leave>`,
	example: `@user-to-join`,
	async execute(message, args) {
		if (!message.mentions.users.size) {
			let reply = `${strings.noTaggedUser}`
			if (this.usage) reply += `\n${strings.commandUsageHeader} \`${cfg.prefix}${this.name} ${this.usage}\``
			return helpers.reply(message, reply, 6000)
		}
		let oldPlayer = message.author
		let newPlayer = message.mentions.users.first()
		if (message.mentions.users.size == 2) {
			newPlayer = await message.mentions.users.find(u => `<@${u.id}>` == args[0]) || message.mentions.users.find(u => `<@!${u.id}>` == args[0])
			oldPlayer = await message.mentions.users.find(u => `<@${u.id}>` == args[1]) || message.mentions.users.find(u => `<@!${u.id}>` == args[1])
			if (oldPlayer.id !== message.author.id && !message.member.roles.some(role => cfg.botModeratorRoles.includes(role.name))) return helpers.reply(message, `${strings.commandRequiresAdmin}`)
		}
		if (oldPlayer == null || newPlayer == null) return helpers.reply(message, `please mention 1 person to swap out yourself, or 2 for swapping around others.`, 8000)
		if (!pug.queue.includes(oldPlayer.id)) return helpers.reply(message, `${strings.wasntQueuedForPugOnRemove}`)
		if (!pug.players.includes(oldPlayer.id)) return helpers.reply(message, `${strings.notlockedPlayerOnSwap}`)
		if (pug.players.includes(newPlayer.id)) return helpers.reply(message, `<@${newPlayer.id}> is already part of the PUG.`)
		else if (message.mentions.users.size > 2) return helpers.reply(message, `please mention 1 person to swap out yourself, or 2 for swapping out others.`, 8000)
		pug.players.splice(pug.players.indexOf(oldPlayer.id), 1, newPlayer.id)
		if (pug.ready.includes(oldPlayer.id)) pug.ready.splice(pug.ready.indexOf(oldPlayer.id), 1, newPlayer.id)
		if (pug.ready.includes(`X${oldPlayer.id}`)) pug.ready.splice(pug.ready.indexOf(`X${oldPlayer.id}`), 1, `X${newPlayer.id}`)
		if (pug.captains.includes(oldPlayer.id)) pug.captains.splice(pug.captains.indexOf(oldPlayer.id), 1, newPlayer.id)
		if (pug.teamOne.includes(oldPlayer.id)) pug.teamOne.splice(pug.teamOne.indexOf(oldPlayer.id), 1, newPlayer.id)
		if (pug.teamTwo.includes(oldPlayer.id)) pug.teamTwo.splice(pug.teamTwo.indexOf(oldPlayer.id), 1, newPlayer.id)
		if (pug.queue.includes(newPlayer.id)) {
			const oldIndex = pug.queue.indexOf(oldPlayer.id)
			const newIndex = pug.queue.indexOf(newPlayer.id);
			[pug.queue[oldIndex], pug.queue[newIndex]] = [pug.queue[newIndex], pug.queue[oldIndex]]
		}
		else pug.queue.splice(pug.queue.indexOf(oldPlayer.id), 1, newPlayer.id)
		message.channel.send(`<@${newPlayer.id}> subbed in for <@${oldPlayer.id}>`)
		await pug.teams(message, 1)
	},
}
