import sql from 'sqlite'
import * as helpers from '../assets/helpers.js'
import { cfg } from '../../settings/config.js'
sql.open(`./src/assets/warbot.sqlite`)

export default {
	name: `stats`,
	aliases: [`rank`, `level`, `lvl`, `about`, `info`],
	guildOnly: true,
	description: `Display stats & info about yourself or others.`,
	usage: `<@user>`,
	async execute(message) {
		const userRank = `Member`,
			pugs = 0,
			fields = [
				{
					"name": `User`,
					"value": `<@${message.author.id}>\nㅤ`,
					"inline": true,
				},
				{
					"name": `ID`,
					"value": `${message.author.id}\nㅤ`,
					"inline": true,
				},
				{
					"name": `PUGs Played`,
					"value": `${pugs}\nㅤ`,
					"inline": true,
				},
				{
					"name": `Rank`,
					"value": `${userRank}\nㅤ`,
					"inline": true,
				},
			],
			embed = await helpers.initEmbed(message)
		let member = message.guild.members.get(message.author.id)
		// embed.image = {}
		embed.fields = fields
		if (!message.mentions.users.size) {
			embed.title = `**Stats & Info for ${message.author.tag}**`
			// embed.image.url = `${message.author.displayAvatarURL}`
			embed.thumbnail.url = `${message.author.displayAvatarURL}`
		}
		else if (message.mentions.users.size == 1) {
			message.mentions.users.map(async user => {
				embed.title = `**Stats & Info for ${user.tag}**`
				// embed.image.url = `${user.displayAvatarURL}`
				embed.thumbnail.url = `${user.displayAvatarURL}`
				embed.fields[0].value = `<@${user.id}>\nㅤ`
				embed.fields[1].value = `${user.id}\nㅤ`
				member = message.guild.members.get(user.id)
			})
		}
		else if (message.mentions.users.size > 1) return helpers.reply(message, `please mention 1 person, per command`, 5000)
		await sql.get(`SELECT * FROM stats WHERE userID = ${member.user.id}`).then(async row => {
			if (!row) await sql.run(`INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)`, [member.user.id, 0, userRank])
			else {
				if (row.pugs > cfg.proPlayerRolePugCount && row.rank !== cfg.proPlayerRole) {
					row.rank = cfg.proPlayerRole
					await sql.run(`UPDATE stats SET rank = '${row.rank}' WHERE userID = ${member.user.id}`).catch(err => console.log(err))
				}
				embed.fields[2].value = await row.pugs
				embed.fields[3].value = await row.rank
			}
		}).catch(() => {
			sql.run(`CREATE TABLE IF NOT EXISTS stats (userID TEXT, pugs INTEGER, rank TEXT)`).then(() => {
				sql.run(`INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)`, [member.user.id, 0, userRank])
			})
		})
		message.channel.send({ embed })
	},
}
