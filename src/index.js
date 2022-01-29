// WarBot
import 'babel-register'
import 'babel-polyfill'

import fs from 'fs'
import * as Discord from 'discord.js'
import * as helpers from './assets/helpers.js'
import * as pug from './assets/pug.js'
import * as states from './assets/states.json'
import { cfg } from '../settings/config.js'
import { strings } from './assets/strings.js'
import { token } from '../settings/token.js'
import { version } from '../package.json'


const talkedRecently = new Set()
export const client = new Discord.Client()
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync(`./src/commands`).filter(file => file.endsWith(`.js`))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`).default
	client.commands.set(command.name, command)
}

// Handle incoming messages
client.on(`message`, message => {

	// Exit if message was sent by a bot
	if (message.author.bot) return

	// Exit if prefix missing
	if (!message.content.startsWith(cfg.prefix) && cfg.warbotOnlyChannels.includes(message.channel.name)) {
		message.delete().catch(cantDel => console.log(cantDel))
		return helpers.reply(message, `Only ${strings.botName} commands are allowed in this channel`)
	}
	if (!message.content.startsWith(cfg.prefix)) return

	const msg = message.content
	const args = message.content.slice(cfg.prefix.length).split(/\s+/g)
	const commandName = args.shift().toLowerCase()
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

	// Delete message if possible
	if (message.channel.type == `text`) message.delete().catch(cantDel => console.log(cantDel))

	// Prefix used, but wrong or disabled command
	// if (!command) return;
	if (!command) return helpers.reply(message, `${strings.unknownCommand}`, 4000)

	// Server only command use inside DM
	if (command.guildOnly && message.channel.type !== `text`) return message.reply(`${strings.serverCommandUsedOutsideServer}`)

	// TESTING PURPOSES ONLY!!!
	if ((cfg.devMode || cfg.testMode) && message.author.id !== `140437382704005130` && message.channel.type !== `text`) return message.channel.send(`${strings.botName} is under testing. Only **PGL_Ace#4831** has DM command permissions, at this time.`)
	if (cfg.devMode && message.channel.type == `text` && !message.member.roles.some(role => cfg.botTestModeRoles.includes(role.name)) && message.author.id !== `140437382704005130`) {
		return helpers.reply(message, `${strings.botName} is in development mode. Only PUG Helpers & EZ members have permissions at this time.`, 3000)
	}

	// Cooldown / Timeout
	if (talkedRecently.has(message.author.id)) return helpers.reply(message, `you're on cooldown... Wait a few seconds.`)
	else {
		if (message.author.id !== `140437382704005130`) talkedRecently.add(message.author.id)
		setTimeout(() => talkedRecently.delete(message.author.id), 4000)
	}

	// Non-admin using an admin command
	if (command.botModRoleRequired && !message.member.roles.some(role => cfg.botModeratorRoles.includes(role.name))) return helpers.reply(message, `${strings.commandRequiresAdmin}`)
	if (command.staffRoleRequired && !message.member.roles.some(role => cfg.adminRoles.includes(role.name))) return helpers.reply(message, `${strings.commandRequiresAdmin}`)

	// PUG command in non-pug channel
	if (command.pugCommand && !cfg.pugTextChannels.includes(message.channel.name)) return helpers.reply(message, `${strings.pugCommandInNonPugChannel}`, 5000)

	// No arguments provided when required (Check for missingArgsMessage)
	if (command.argsRequired && !args.length) {
		let reply = `${strings.noArgsDefault}`
		if (command.missingArgsMessage) reply = `${command.missingArgsMessage}`
		if (command.usage) reply += `\n\n${strings.commandUsageHeader} \`${cfg.prefix}${command.name} ${command.usage}\``
		if (command.example) reply += `\n***Example: ***\`${cfg.prefix}${command.name} ${command.example}\``
		if (command.afterExample) reply += `\n\n${command.afterExample}`
		if (command.replyDelay) return helpers.reply(message, reply, (command.replyDelay * 1000))
		return helpers.reply(message, reply, 6000)
	}

	// Log all valid commands, even if rejected/incorrect
	const date = new Date()
	let action = `COMMAND`
	if (command.botModRoleRequired) action = `ADMIN  `
	if (cfg.enableLogging) console.log(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}  ${action}  ${message.author.tag}  ${msg}`)

	// Try to execute valid commands
	try {
		command.execute(message, args, command, cfg)
	}
	catch (err) {
		console.error(`User: ${message.author.tag}\nCommand: ${message.content}\nError:\n`, err)
		let reply = `${strings.commandError} \`${message.content}\``
		reply += `\nFor <@140437382704005130> to debug: *${err}*`
		message.reply(reply)
	}

	// Reset Status if changed
	if (client.user.presence.game.name !== strings.botStatus) {
		client.user.setActivity(`${strings.botStatus}`, { type: `PLAYING` })
		console.log(`Activity Reset: Playing ${cfg.prefix}help`)
	}
})

process.on(`unhandledRejection`, err => console.error(`Uncaught Promise Rejection`, err))

client.on(`messageReactionRemove`, async (reaction, user) => {
	if (user.id == client.user.id || reaction.message.author.id !== client.user.id || cfg.requireReadyUp) return
	if (reaction.message.id !== pug.startQuestion.id) return
	if (reaction.emoji.name !== pug.voteReactions[0]) return
	const embed = pug.startQuestionEmbed
	embed.description = ``
	for (let i = 0; i < pug.startCount && i < pug.queue.length; i++) {
		if (reaction.users.map(u => u.id).includes(pug.queue[i])) embed.description += `\n#${i + 1} <@${pug.queue[i]}>  *Ready*`
		else embed.description += `\n#${i + 1} <@${pug.queue[i]}>`
	}
	await pug.startQuestion.edit({ embed }).catch(err => console.log(err))
	pug.startQuestionEmbed = embed
})

client.on(`messageReactionAdd`, (reaction, user) => {
	if (user.id == client.user.id || reaction.message.author.id !== client.user.id || !Object.keys(states.pug).slice(2).includes(pug.state)) return
	if ([pug.startMsg.id, pug.finalPlayersMsg.id].includes(reaction.message.id) && reaction.emoji.name == `stop` && pug.players.includes(user.id)) return
	if ((!pug.voteReactions.includes(reaction.emoji.name) || !pug.players.includes(user.id))) reaction.remove(user.id)
	else if ((!pug.voteReactions.includes(reaction.emoji.name) || !pug.captains.includes(user.id)) && pug.captainsOnlyVote) reaction.remove(user.id)
})

client.on(`voiceStateUpdate`, async (oldMember, newMember) => {
	if (!cfg.unmuteToReady) return
	if (oldMember.id !== newMember.id) return
	if (!pug.players.includes(newMember.id)) return
	if (pug.state !== `ready`) return
	const readyChannel = pug.waitingRoom
	const newUserChannel = newMember.voiceChannel
	if (newUserChannel == readyChannel && !newMember.mute) {
		if (pug.ready.includes(`X${newMember.id}`)) await pug.ready.splice(pug.ready.indexOf(`X${newMember.id}`), 1, newMember.id)
		else if (!pug.ready.includes(newMember.id) && !pug.ready.includes(`X${newMember.id}`)) await pug.ready.push(newMember.id)
	}
	else if (newMember.mute || newUserChannel !== readyChannel) {
		if (pug.ready.includes(newMember.id)) await pug.ready.splice(pug.ready.indexOf(newMember.id), 1, `X${newMember.id}`)
	}
	await pug.teams(pug.startMsg, 1)
})

client.on(`presenceUpdate`, async (oldMember, newMember) => {
	// Reset Status if changed
	if (client.user.presence.game.name !== strings.botStatus) {
		client.user.setActivity(`${strings.botStatus}`, { type: `PLAYING` })
		console.log(`Activity Reset: Playing ${cfg.prefix}help`)
	}
	// PUG players going offline
	if (oldMember.id !== newMember.id) return
	if (!pug.queue.includes(oldMember.id)) return
	if (pug.state !== `waiting`) return
	if (oldMember.presence.status !== `offline` && newMember.presence.status == `offline`) {
		pug.queue.splice(pug.queue.indexOf(oldMember.id), 1)
		pug.teamMsg.channel.send(`<@${oldMember.id}> ${strings.leftPugQueueOffline}  **${pug.queue.length} Players**`)
		await pug.teams(pug.teamMsg, 1)
	}
})

client.on(`ready`, () => {
	if (cfg.prefix == ``) return console.log(`\n Error: Please correctly set 'prefix' in config.js and restart the bot!`)
	if (cfg.hostName == ``) cfg.hostName = strings.botName
	console.log(`Connected!\nLogged in as: ${client.user.tag} (${client.user.username} ${version}) #${client.user.id}`)
	client.user.setActivity(`${strings.botStatus}`, { type: `PLAYING` })
})

client.login(token)
