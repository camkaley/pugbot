
export default {
	name: `flip`,
	aliases: [`coin`, `toss`],
	description: `Flip a coin!`,
	guildOnly: true,
	execute(message) {
		const sides = [`Heads`, `Tails`]
		const result = sides[Math.floor(Math.random() * sides.length)]
		const coin = message.guild.emojis.find(emoji => emoji.name == `coin`)
		if (coin) message.channel.send(`<@${message.author.id}> flipped a coin and got ${coin} **${result}**`)
		else message.channel.send(`<@${message.author.id}> flipped a coin and got **${result}**`)
	},
}
