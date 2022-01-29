import { strings } from '../assets/strings.js'

export default {
	name: `embed`,
	aliases: [`em`],
	guildOnly: true,
	botModRoleRequired: true,
	async execute(message) {
		const embed = {
			"title": `Embed Test`,
			"description": `This is to test the editing of embeds.`,
			"color": 1878473,
			"author": {
				"name": `${message.guild.name}`,
				"icon_url": `${message.guild.iconURL}`,
			},
			"footer": {
				"icon_url": `${message.guild.iconURL}`,
				"text": `${strings.author}`,
			},
		}
		await message.channel.send({ embed }).then(async msg => {
			const emoji = message.guild.emojis.find(emojis => emojis.name == `alph_a`)
			await msg.react(emoji)
			const reactionFilter = (reaction, user) => (!user.bot && user.id !== msg.author.id)
			const collector = await msg.createReactionCollector(reactionFilter)
			await collector.on(`collect`, async reaction => {
				if (reaction.emoji.name == emoji.name) {
					embed.description += `\nEdited`
					await msg.edit({ embed }).catch(err => console.log(err))
				}
			})
		}).catch(err => console.log(err))
	},
}
