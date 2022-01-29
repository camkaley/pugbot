import * as helpers from '../assets/helpers.js'
import { cfg } from '../../settings/config.js'
import { strings } from '../assets/strings.js'

export default {
	name: `team`,
	guildOnly: true,
	argsRequired: true,
	description: `Create/Edit/Join a team for events.`,
	usage: `<action> <arg>`,
	example: `create My Team Name`,
	execute(message, args) {
		if (args.length < 2) return helpers.reply(message, `Invalid command use. Try \`${cfg.prefix}help ${this.name}\` for more info`)
		const cmd = args[0]
		let teamName = args.slice(1, args.length).join(` `)
		switch (true) {
		case (cmd == `create`): {
			if (message.guild.roles.find(r => r.name == teamName)) return helpers.reply(message, `This team already exists`)
			helpers.makeRole(message, teamName).then(async teamRole => {
				const voteOptions = [],
					voteResults = [],
					voteReactions = [],
					joinedEvents = [],
					embed = await helpers.initEmbed(message, 1)
				console.log(`Team created by ${message.author.tag}: ${teamRole.name}`)
				if (cfg.announcementChannels) {
					for (const chanName of cfg.announcementChannels) {
						const textChan = message.guild.channels.find(chan => chan.name == chanName)
						textChan.send(`**<@${message.author.id}> created a team:** <@&${teamRole.id}>`)
					}
				}
				delete embed.thumbnail
				embed.title = `**Team Registration**`
				embed.description = `${teamRole.name}`
				embed.fields[0].name = `Events`
				embed.fields[0].value = ``
				message.member.addRole(teamRole).catch(err => console.log(err))
				message.guild.roles.map(role => {
					if (role.name.includes(`Event:`)) voteOptions.push(role)
				})
				for (let i = 0; i < voteOptions.length; i++) {
					embed.fields[0].value += `\n:regional_indicator_${helpers.alphabet[i]}: - ${voteOptions[i]}`
					voteReactions[i] = `alph_${helpers.alphabet[i]}`
					voteResults[i] = `0`
				}
				if (!voteOptions.length) embed.fields[0].value += `No Events Available`
				embed.fields[0].value += `\n\n:white_check_mark: - Done`
				const embedMsg = await message.channel.send({ embed })
				for (const item of voteReactions) {
					const emoji = message.guild.emojis.find(emojis => emojis.name == item)
					await embedMsg.react(emoji)
				}
				const emoji = message.guild.emojis.find(emojis => emojis.name == `yes`)
				await embedMsg.react(emoji)
				const reactionFilter = (reaction, user) => ((voteReactions.includes(reaction.emoji.name) || reaction.emoji.name == `yes`) && user.id !== embedMsg.author.id)
				const collector = await embedMsg.createReactionCollector(reactionFilter)
				let complete = false
				await collector.on(`collect`, async reaction => {
					if (reaction.emoji.name !== `yes`) return
					collector.stop()
				})
				await collector.on(`end`, async (collected) => {
					await collected.map(async reaction => {
						for (let i = 0; i < voteReactions.length; i++) {
							if (reaction.emoji.name == voteReactions[i]) await message.member.addRole(voteOptions[i]).catch(err => console.log(err))
						}
					})
					complete = true
				})
				while (!complete) await helpers.delay(3000)
				await embedMsg.delete().catch(cantDel => console.log(`embedMsg: `, cantDel))
				for (let i = 0; i < voteOptions.length; i++) {
					if (message.member.roles.find(role => role.id == voteOptions[i].id) && !joinedEvents.includes(voteOptions[i]).id) await joinedEvents.push(voteOptions[i].id)
				}
				if (cfg.announcementChannels) {
					for (const chanName of cfg.announcementChannels) {
						const textChan = message.guild.channels.find(chan => chan.name == chanName)
						if (joinedEvents.length == 1) textChan.send(`**<@${message.author.id}> registered team <@&${teamRole.id}> for <@&${joinedEvents.slice(0)}>**`)
						else if (joinedEvents.length > 1) textChan.send(`**<@${message.author.id}> registered team <@&${teamRole.id}> for <@&${joinedEvents.slice(0, -1).join(`>, <@&`)}> & <@&${joinedEvents.slice(-1)}>**`)
					}
				}
			}).catch(err => console.log(err))
			break
		}
		case (cmd == `delete` || cmd == `del` || cmd == `remove` || cmd == `rem` || cmd == `rm`): {
			if (!message.member.roles.some(role => cfg.botModeratorRoles.includes(role.name))) return helpers.reply(message, `${strings.commandRequiresAdmin}`)
			if (!message.mentions.roles.size) return helpers.reply(message, `You must @mention the team`)
			message.mentions.roles.map(async teamRole => {
				teamRole.delete().then(() => {
					console.log(`Team removed by ${message.author.tag}: ${teamRole.name}`)
					if (cfg.announcementChannels) {
						for (const chanName of cfg.announcementChannels) {
							const textChan = message.guild.channels.find(chan => chan.name == chanName)
							textChan.send(`**<@${message.author.id}> removed a team:** ${teamRole.name}`)
						}
					}
				})
			})
			break
		}
		case (cmd == `rename`): {
			if (!message.mentions.roles.size) return helpers.reply(message, `You must @mention the team`)
			if (args.length < 3) return helpers.reply(message, `Incorrect use. Try \`${cfg.prefix}${this.name} rename @team New Name\``, 9000)
			teamName = args.slice(2, args.length).join(` `)
			if (message.guild.roles.find(r => r.name == teamName)) return helpers.reply(message, `This team already exists`)
			message.mentions.roles.map(async teamRole => {
				if (!message.member.roles.some(role => role.name == teamRole.name)) return helpers.reply(message, `You must be a member of this team, to edit it`)
				const oldName = teamRole.name
				console.log(`Team ${oldName} renamed to ${teamName} by ${message.author.tag}`)
				message.guild.roles.get(teamRole.id).setName(teamName).catch(err => console.log(err))
				if (cfg.announcementChannels) {
					for (const chanName of cfg.announcementChannels) {
						const textChan = message.guild.channels.find(chan => chan.name == chanName)
						textChan.send(`**Team ${oldName} renamed to <@&${teamRole.id}> by <@${message.author.id}>**`)
					}
				}
			})
			break
		}
		default: {
			return helpers.reply(message, `Invalid command use. Try \`${cfg.prefix}help ${this.name}\` for more info`)
		}
		}
	},
}
