import * as helpers from '../assets/helpers.js'
import { cfg } from '../../settings/config.js'

export default {
	name: `roll`,
	aliases: [`dice`],
	description: `Roll the dice!`,
	usage: `<numberOfDice>`,
	guildOnly: true,
	execute(message, args) {
		const results = []
		let numOfDice = 1
		if (args.length && !isNaN(parseInt(args[0]))) numOfDice = parseInt(args[0])
		if (isNaN(numOfDice) || (numOfDice < 1 || numOfDice > 12)) return helpers.reply(message, `Number of dice must be 1-12. eg. \`${cfg.prefix}${this.name}\` or \`${cfg.prefix}${this.name} 2\``, 6000)
		for (let i = 0; i < numOfDice; i++) results.push(Math.floor(Math.random() * 6) + 1)
		if (numOfDice == 1) message.channel.send(`<@${message.author.id}> rolled the dice and got **${results}** 🎲`)
		else message.channel.send(`<@${message.author.id}> rolled **${numOfDice}** dice and got **${results.reduce((a, b) => a + b)}** with **${results.slice(0, -1).join(`, `)} & ${results.slice(-1)}** 🎲`)
	},
}
