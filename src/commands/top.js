import sql from 'sqlite'
import * as helpers from '../assets/helpers.js'
import { strings } from '../assets/strings.js'
sql.open(`./src/assets/warbot.sqlite`)

export default {
	name: `top`,
	aliases: [`leaders`, `leaderboards`],
	guildOnly: true,
	description: `Display the leaderboard.`,
	usage: `<@user>`,
	async execute(message) {
		const fields = [
				{
					"name": `#1-10`,
					"value": ``,
					"inline": true,
				},
				{
					"name": `ㅤ`,
					"value": ``,
					"inline": true,
				},
				{
					"name": `#11-20`,
					"value": ``,
					"inline": true,
				},
				{
					"name": `ㅤ`,
					"value": ``,
					"inline": true,
				},
			],
			embed = await helpers.initEmbed(message, 1)
		delete embed.image
		embed.title = `**Top Players**`
		embed.description = `${strings.botName} Leaderboards (PUGs Played)`
		await sql.all(`SELECT * FROM stats ORDER BY pugs DESC LIMIT 20`).then(async rows => {
			if (rows.length > 0) {
				embed.fields[0] = fields[0]
				for (let i = 0; i < 5 && i < rows.length; i++) embed.fields[0].value += `\n${rows[i].pugs}    <@${rows[i].userID}>`
			}
			if (rows.length > 5) {
				embed.fields[1] = fields[1]
				for (let i = 5; i < 10 && i < rows.length; i++) embed.fields[1].value += `\n${rows[i].pugs}    <@${rows[i].userID}>`
			}
			if (rows.length > 10) {
				embed.fields[2] = fields[2]
				for (let i = 10; i < 15 && i < rows.length; i++) embed.fields[2].value += `\n${rows[i].pugs}    <@${rows[i].userID}>`
			}
			if (rows.length > 15) {
				embed.fields[3] = fields[3]
				for (let i = 15; i < 20 && i < rows.length; i++) embed.fields[3].value += `\n${rows[i].pugs}    <@${rows[i].userID}>`
			}
		}).catch(() => {
			embed.description = `ㅤ\nLeaderboard unavailable\nㅤ`
		})
		message.channel.send({ embed })
	},
}
