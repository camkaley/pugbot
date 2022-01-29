import * as helpers from '../assets/helpers.js'
import * as pug from '../assets/pug.js'
import { cfg } from '../../settings/config.js'
import { strings } from '../assets/strings.js'

export default {
	name: `join`,
	aliases: [`add`],
	guildOnly: true,
	pugCommand: true,
	description: `Join the PUG waiting list.`,
	usage: `<@user>`,
	example: `@user1 @user2 @etc`,
	async execute(message) {
		const mentions = []
		let	startHit = false
		if (message.mentions.users.size > pug.startCount) return helpers.reply(message, `You may only add a max of ${pug.startCount} players, at a time.`)
		let newStartCount = pug.startCount
		if (pug.queue.length >= pug.startCount) newStartCount = pug.startCount * Math.floor(pug.queue.length / pug.startCount)
		if (!message.mentions.users.size) {
			if (pug.queue.includes(message.author.id)) return helpers.reply(message, `${strings.alreadyInPugQueue}`)
			await pug.queue.push(message.author.id)
			await helpers.reply(message, `<@${message.author.id}> ${strings.joinedPugQueue}`, pug.voteDelay * 2, true)
			if (pug.queue.length == newStartCount) {
				newStartCount = await pug.startCount * Math.floor(pug.queue.length / pug.startCount)
				startHit = true
			}
			if (!startHit || pug.state == `startCheck`) await pug.teams(message, 1)
		}
		else {
			if ((message.mentions.users.size > 1 || message.mentions.users.first().id !== message.author.id) && !message.member.roles.some(role => cfg.botModeratorRoles.includes(role.name))) return helpers.reply(message, `Just type \`${cfg.prefix}join\`, as only Bot Moderators may @mention others.`)
			message.mentions.users.map(async user => {
				if (!pug.queue.includes(user.id)) await mentions.push(user.id)
			})
			if (!mentions.length) return helpers.reply(message, `they are already queued for the PUG.`)
			for (const player of mentions) {
				await pug.queue.push(player)
				if (pug.queue.length == newStartCount) {
					newStartCount = await pug.startCount * Math.floor(pug.queue.length / pug.startCount)
					startHit = true
				}
			}
			if (mentions[0] == message.author.id) await helpers.reply(message, `<@${message.author.id}> ${strings.joinedPugQueue}`, pug.voteDelay * 2, true)
			else if (mentions.length == 1) await helpers.reply(message, `<@${mentions[0]}> was queued by <@${message.author.id}>`, pug.voteDelay * 2, true)
			else await helpers.reply(message, `<@${mentions.slice(0, -1).join(`>, <@`)}> & <@${mentions.slice(-1)}> were queued by <@${message.author.id}>`, pug.voteDelay * 2, true)
			if (!startHit || pug.state == `startCheck`) await pug.teams(message, 1)
		}
		if (startHit && pug.state !== `startCheck`) {
			await helpers.delay(1000)
			pug.run(message)
		}
	},
}
