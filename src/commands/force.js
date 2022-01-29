import sql from 'sqlite'
import * as helpers from '../assets/helpers.js'
import * as pug from '../assets/pug.js'
import { cfg } from '../../settings/config.js'
import { strings } from '../assets/strings.js'
sql.open(`./src/assets/warbot.sqlite`)
export default {
	name: `force`,
	botModRoleRequired: true,
	guildOnly: true,
	pugCommand: true,
	description: `Prefix command, to be used with other commands.\nCan be used to do things like edit user stats.`,
	argsRequired: true,
	usage: `<command> <args>`,
	example: `xp @user +1`,
	async execute(message, args) {
		const cmd = args[0],
			defaultRank = `Member`
		let userRank = defaultRank,
			changed = false
		switch (true) {
		case ([`pugs`, `xp`, `stats`].includes(cmd)): {
			if (!message.mentions.members.size) return helpers.reply(message, `${strings.noTaggedUser}`)
			if (!args[2]) return helpers.reply(message, `Incorrect use. Try \`${cfg.prefix}${this.name} ${cmd} @user +1\` or \`${cfg.prefix}help ${this.name}\` for more info.`, 9000)
			await message.mentions.users.map(async user => {
				const member = message.guild.members.get(user.id)
				const vetRole = message.guild.roles.find(role => role.name == cfg.proPlayerRole)
				let newPugsPlayed = parseInt(args[2]),
					editMethod = `total`
				if (args[2].includes(`+`)) {
					newPugsPlayed = parseInt(args[2].slice(1))
					editMethod = `increase`
				}
				if (args[2].includes(`-`)) editMethod = `decrease`
				if (isNaN(newPugsPlayed)) return helpers.reply(message, `${strings.notNumber}`)
				await sql.get(`SELECT * FROM stats WHERE userID = ${user.id}`).then(async row => {
					if (newPugsPlayed > cfg.proPlayerRolePugCount) {
						member.addRole(vetRole).catch(err => console.log(err))
						userRank = cfg.proPlayerRole
					}
					if (newPugsPlayed < cfg.proPlayerRolePugCount) {
						member.removeRole(vetRole).catch(err => console.log(err))
						userRank = defaultRank
					}
					if (!row) {
						if (editMethod == `decrease`) newPugsPlayed = 0
						sql.run(`INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)`, [user.id, newPugsPlayed, userRank]).catch(err => console.log(`B1`, err))
						changed = true
					}
					else {
						if (editMethod !== `total`) newPugsPlayed = row.pugs + newPugsPlayed
						if (newPugsPlayed < 0) newPugsPlayed = 0
						await sql.run(`UPDATE stats SET pugs = ${newPugsPlayed}, rank = '${userRank}' WHERE userID = ${user.id}`).catch(err => console.log(err))
						changed = true
					}
				}).catch(() => {
					sql.run(`CREATE TABLE IF NOT EXISTS stats (userID TEXT, pugs INTEGER, rank TEXT)`).then(() => {
						if (newPugsPlayed > cfg.proPlayerRolePugCount) {
							member.addRole(vetRole).catch(err => console.log(err))
							userRank = cfg.proPlayerRole
						}
						if (newPugsPlayed < cfg.proPlayerRolePugCount) {
							member.removeRole(vetRole).catch(err => console.log(err))
							userRank = defaultRank
						}
						if (editMethod == `decrease`) newPugsPlayed = 0
						sql.run(`INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)`, [user.id, newPugsPlayed, userRank]).catch(err => console.log(err))
						changed = true
					}).catch(err => console.log(err))
				})
				if (changed) {
					if (message.author.id == member.user.id) message.channel.send(`**<@${message.author.id}> edited their stats**`)
					else message.channel.send(`**<@${message.author.id}> edited stats for <@${user.id}>**`)
				}
			})
			break
		}
		case ([`stop`, `reset`, `end`].includes(cmd)): {
			if (!pug.queue[0]) return helpers.reply(message, `No players queued for the PUG.`)
			await pug.end(message, `\`${message.content}\` command used by <@${message.author.id}>`)
			break
		}
		default: {
			return helpers.reply(message, `Please provide a valid command function. Try \`${cfg.prefix}help ${this.name}\` for more info`)
		}
		}
	},
}
