import * as helpers from './helpers.js'
import * as states from './states.json'
import * as votes from './votes.json'
import { cfg } from '../../settings/config.js'
import { strings } from './strings.js'

export const teamTwoField = {
		"name": `Team #2`,
		"value": ``,
		"inline": true,
	},
	playersField = {
		"name": `Players`,
		"value": ``,
		"inline": false,
	},
	trash = []

export let state,
	startCount = cfg.pugGameCfg.sandstorm.teamSize * 2,
	start = false,
	neededCount = startCount / 5 + 1,
	collector,
	statusCollector,
	voteDelay = cfg.voteDelay,
	voteReactions = [],
	voteResults = [],
	queue = [],
	players = [],
	captains = [],
	teamOne = [],
	teamTwo = [],
	ready = [],
	lockedTeams = [],
	lastPickerId = ``,
	waitingRoom,
	missedOutRoom,
	channelOne,
	channelTwo,
	teamPickResult,
	captainsPickResult,
	captainsOnlyVote = false,
	embed = {},
	server = {},
	startMsg = {},
	finalPlayersMsg = {},
	teamMsg = {},
	startQuestion = {},
	startQuestionEmbed = {},
	waitQuestion = {}

if (state == undefined || state == null) state = `waiting`

// For Testing
if (cfg.testMode && !cfg.devMode) {
	startCount = 4
	voteDelay = 6000
	neededCount = startCount / 2
}
if (cfg.devMode) {
	startCount = 4
	voteDelay = 5000
	neededCount = startCount / 2
}

// =============== PUG FLOW ===============
export async function run(message) {
	start = false
	await startCheck(message)
	if (queue.length < startCount || state == `waiting` || !start) return
	await playersFound(message)
	await readyUp()
	await setUp(message)
	await playing(message)
}

async function startCheck(message) {
	state = `startCheck`
	voteReactions = []
	let count = neededCount
	if (!cfg.requireReadyUp && !cfg.devMode && !cfg.testMode) count = startCount
	embed = await helpers.initEmbed(message, 1)
	embed.title = `**Shall we start with these players?**`
	embed.description = ``
	for (let i = 0; i < startCount; i++) embed.description += `\n#${i + 1} <@${queue[i]}>`
	embed.fields[0].name = `Start?`
	embed.fields[0].value = strings.startCheck
	await message.channel.send({ embed }).then(async question => {
		let result = `none`
		trash.push(question)
		startQuestion = question
		startQuestionEmbed = embed
		let emoji = await message.guild.emojis.find(emojis => emojis.name == `yes`)
		await question.react(emoji)
		await voteReactions.push(emoji.name)
		emoji = await message.guild.emojis.find(emojis => emojis.name == `no`)
		await question.react(emoji)
		await voteReactions.push(emoji.name)
		emoji = await message.guild.emojis.find(emojis => emojis.name == `kill`)
		await question.react(emoji)
		await voteReactions.push(emoji.name)
		emoji = await message.guild.emojis.find(emojis => emojis.name == `play`)
		await question.react(emoji)
		await voteReactions.push(emoji.name)
		const reactionFilter = (reaction, user) => (voteReactions.includes(reaction.emoji.name) && queue.slice(0, startCount).includes(user.id) && user.id !== question.author.id)
		collector = await question.createReactionCollector(reactionFilter)
		await collector.on(`collect`, async reaction => {
			if (reaction.emoji.name == `yes`) {
				if (!cfg.requireReadyUp) {
					embed = startQuestionEmbed
					embed.description = ``
					for (let i = 0; i < startCount && i < queue.length; i++) {
						if (reaction.users.map(u => u.id).includes(queue[i])) embed.description += `\n#${i + 1} <@${queue[i]}>  *Ready*`
						else embed.description += `\n#${i + 1} <@${queue[i]}>`
					}
					await question.edit({ embed }).catch(err => console.log(err))
					startQuestion = question
					startQuestionEmbed = embed
				}
				if (reaction.users.map(u => u).length < (count + 1)) return
				collector.stop()
				if (question.channel && !question.deleted) await question.delete().catch(cantDel => console.log(`startQuestion: `, cantDel))
				if (queue.length >= startCount) await question.channel.send(`**PUG Setup Ready!**\n<@${queue.slice(0, startCount).join(`>, <@`)}>\nPlease \`${cfg.prefix}ready\` if needed!`)
				else await question.channel.send(`**No longer enough players to start PUG**`)
				if (queue.length < startCount) state = `waiting`
				else start = true
				if (cfg.requireReadyUp) await teams(message, 1)
			}
			else if (reaction.emoji.name == `no`) {
				collector.stop()
				if (question.channel && !question.deleted) await question.delete().catch(cantDel => console.log(`startQuestion: `, cantDel))
				waitQuestion = await question.channel.send(`**PUG Setup Delayed!**\n**Reason: **PUG list rejected by <@${reaction.users.map(u => u)[1].id}>\nYou may remove and add players as needed.\nWhen ${startCount / 2} players click :white_check_mark: or a PUG Helper types \`${cfg.prefix}start\`, it will to continue!`)
				emoji = await message.guild.emojis.find(emojis => emojis.name == `yes`)
				waitQuestion.react(emoji)
				const filter = (r, u) => (r.emoji.name == emoji.name && queue.slice(0, 10).includes(u.id) && u.id !== waitQuestion.author.id)
				statusCollector = await waitQuestion.createReactionCollector(filter)
				await statusCollector.on(`collect`, async r => {
					if (r.users.map(u => u).length < (startCount / 2 + 1)) return
					statusCollector.stop()
					waitQuestion.delete().catch(cantDel => console.log(`startQuestion: `, cantDel))
					if (!players[0] && queue.length >= startCount) run(message)
				})
				await teams(message, 1)
			}
			else if (reaction.emoji.name == `kill`) {
				const member = message.guild.members.get(reaction.users.map(u => u)[1].id)
				if (!member.roles.some(role => cfg.botModeratorRoles.includes(role.name))) return await reaction.remove(reaction.users.map(u => u)[1].id)
				collector.stop()
				if (question.channel && !question.deleted) await question.delete().catch(cantDel => console.log(`startQuestion: `, cantDel))
				queue = await []
				state = `waiting`
				await question.channel.send(`**PUG has ended!**\n**Reason: **PUG list rejected by <@${reaction.users.map(u => u)[1].id}>\nThe queue has been reset!`)
				await teams(message, 1)
			}
			else if (reaction.emoji.name == `play`) {
				const member = message.guild.members.get(reaction.users.map(u => u)[1].id)
				if (!member.roles.some(role => cfg.botModeratorRoles.includes(role.name))) return await reaction.remove(reaction.users.map(u => u)[1].id)
				collector.stop()
				if (question.channel && !question.deleted) await question.delete().catch(cantDel => console.log(`startQuestion: `, cantDel))
				if (queue.length >= startCount) await question.channel.send(`**PUG Setup Ready!** *- Started by <@${reaction.users.map(u => u)[1].id}>*\n<@${queue.slice(0, startCount).join(`>, <@`)}>\nPlease \`${cfg.prefix}ready\` if needed!`)
				else await question.channel.send(`**No longer enough players to start PUG**`)
				if (queue.length < startCount) state = `waiting`
				else start = true
				if (cfg.requireReadyUp) await teams(message, 1)
			}
			result = reaction.emoji.name
		})
		while (!voteReactions.includes(result)) await helpers.delay(5000)
		voteReactions = []
	})
	return queue
}

async function playersFound(message) {
	state = `playersFound`
	captains = []
	teamOne = []
	teamTwo = []
	ready = []
	lockedTeams = []
	server = {}
	players = await []
	players = await queue.slice(0, startCount)
	waitingRoom = message.guild.channels.find(channel => channel.name == cfg.pugVoiceChannels[0])
	if (cfg.useMissedPUGChannel) missedOutRoom = message.guild.channels.find(channel => channel.name == cfg.pugVoiceChannels[1])
	if (!cfg.requireReadyUp) ready = players.slice(0)
	embed.title = `${states.pug[state].name}  ( ${players.length} of ${startCount} )`
	embed.description = `The PUG is ready for setup!\nㅤ`
	for (const svr of cfg.gameServers.sandstorm) {
		if (svr.isPugServer && !cfg.gameServers.sandstorm.includes(server)) {
			server = svr
			if (server.pass) embed.description += `\n**PUG Server Info**\nPassword:   \`${server.pass}\`\n\`${server.ip}\`\nㅤ`
			else embed.description += `\nIf a server has not been chosen already, use \`${server.ip}\`\nㅤ`
		}
	}
	if (cfg.unmuteToReady) embed.description += `\n**Note:**\nAll ${startCount} players must be in **${waitingRoom.name}**\nUNMUTED for voting to begin!\nㅤ`
	else embed.description += `\n**Note:**\nAny player not in **${waitingRoom.name}** and unmuted,\nmust \`${cfg.prefix}ready\` for voting to begin!\nㅤ`
	waitingRoom.members.map(async member => {
		if (players.includes(member.user.id) && (!ready.includes(member.user.id) || !ready.includes(`X${member.user.id}`)) && !member.mute) await ready.push(member.user.id)
		else if (players.includes(member.user.id) && ready.includes(`X${member.user.id}`) && !member.mute) await ready.splice(ready.indexOf(`X${member.user.id}`), 1, member.user.id)
	})
	startMsg = await message.channel.send({ embed })
	const emoji = await message.guild.emojis.find(emojis => emojis.name == `stop`)
	startMsg.react(emoji)
	const filter = (r, u) => (r.emoji.name == emoji.name && players.includes(u.id) && u.id !== startMsg.author.id)
	statusCollector = await startMsg.createReactionCollector(filter)
	await statusCollector.on(`collect`, async r => {
		if (r.users.map(u => u).length < (neededCount + 1)) return
		statusCollector.stop()
		startMsg.clearReactions()
		await end(message, `PUG ended by players`)
	})
	await teams(message, 1)
	await helpers.delay(3000)
}

async function readyUp() {
	if (state == `waiting`) return
	if (!cfg.requireReadyUp) return
	state = `ready`
	while (!players.some(player => !ready.includes(player)) == false) await helpers.delay(5000)
}

async function setUp(message) {
	if (state == `waiting`) return
	state = `settingUp`
	randomTeams(players)
	/*await askQuestion(message, votes.askPickTeams, `askPickTeams`)
	if (teamPickResult == votes.askPickTeams.options[1]) {
		await askQuestion(message, votes.askPickCaptains, `askPickCaptains`)
		if (captainsPickResult == votes.askPickCaptains.options[1]) {
			await askQuestion(message, votes.pickCaptains, `pickCaptains`)
			await askQuestion(message, votes.pickTeams, `pickTeams`)
		}
		else {
			await randomCaptains()
			await askQuestion(message, votes.pickTeams, `pickTeams`)
		}
	}
	else randomTeams(players)
		
	*/
}

async function playing(message) {
	if (state == `waiting`) return
	state = `playing`
	await statusCollector.stop()
	await startMsg.clearReactions()
	await cleanUp(trash, 5000, 3000)
	finalPlayersMsg = await teams(message, 2)
	const emoji = await message.guild.emojis.find(emojis => emojis.name == `stop`)
	finalPlayersMsg.react(emoji)
	const filter = (r, u) => (r.emoji.name == emoji.name && players.includes(u.id) && u.id !== finalPlayersMsg.author.id)
	statusCollector = await finalPlayersMsg.createReactionCollector(filter)
	await statusCollector.on(`collect`, async r => {
		if (r.users.map(u => u).length < (neededCount + 1)) return
		statusCollector.stop()
		finalPlayersMsg.clearReactions()
		await end(message, `PUG ended by players`)
	})
	helpers.reply(message, `**PUG is starting!** Prepare to fight!`, (voteDelay * 2), true)
	await helpers.delay(3000)
	let channelNames = [cfg.pugVoiceChannels[1], cfg.pugVoiceChannels[2]]
	if (cfg.useMissedPUGChannel) channelNames = [cfg.pugVoiceChannels[2], cfg.pugVoiceChannels[3]]
	channelOne = await helpers.makeChannel(message, channelNames[0], `voice`, 10)
	channelTwo = await helpers.makeChannel(message, channelNames[1], `voice`, 10)
	await channelOne.setParent(cfg.pugCategoryId).then(channel => channel.lockPermissions().catch(err => console.log(err))).catch(err => console.log(err))
	await channelTwo.setParent(cfg.pugCategoryId).then(channel => channel.lockPermissions().catch(err => console.log(err))).catch(err => console.log(err))
	if (teamPickResult == votes.askPickTeams.options[0] || (teamPickResult == votes.askPickTeams.options[1] && captainsPickResult == votes.askPickCaptains.options[0])) {
		channelOne.setName(`🏆 Security`).catch(err => console.log(err))
		channelTwo.setName(`🏆 Insurgents`).catch(err => console.log(err))
	}
	for (const player of teamOne) {
		const member = message.guild.members.get(player)
		await member.setVoiceChannel(channelOne).catch(err => console.log(err))
	}
	for (const player of teamTwo) {
		const member = message.guild.members.get(player)
		await member.setVoiceChannel(channelTwo).catch(err => console.log(err))
	}
	for (const player of queue) {
		const member = message.guild.members.get(player)
		if (cfg.useMissedPUGChannel && missedOutRoom.position && !players.includes(player)) await member.setVoiceChannel(missedOutRoom).catch(err => console.log(err))
	}
	helpers.xpHandler(message, players)
}

// =============== ASK QUESTIONS ===============
async function askQuestion(message, vote, type) {
	if (state == `waiting`) return
	let winningOption = ``,
		winningCount = 0
	embed = await helpers.initEmbed(message, 1)
	voteReactions = []
	voteResults = []
	embed.title = `${vote.question}`
	embed.description = `ㅤ`
	embed.fields[0].value = ``
	if (type == `pickCaptains`) {
		vote.options = []
		for (const player of players) await vote.options.push(player)
	}
	else if (type == `pickTeams`) {
		embed.description = `One at a time, starting with Team #1`
		embed.fields[0].name = `Team #1`
		embed.fields[0].value = `<@${captains[0]}>`
		embed.fields[0].inline = true
		embed.fields[1] = teamTwoField
		embed.fields[1].value = `<@${captains[1]}>`
		embed.fields[2] = playersField
		embed.fields[2].value = ``
		vote.options = await []
		for (const player of players) if (!captains.includes(player)) await vote.options.push(player)
	}
	for (let i = 0; i < vote.options.length; i++) {
		if (type == `askPickTeams` || type == `askPickCaptains`) embed.fields[0].value += `\n:regional_indicator_${helpers.alphabet[i]}: - ${vote.options[i]}`
		if (type == `pickCaptains`) embed.fields[0].value += `\n:regional_indicator_${helpers.alphabet[i]}: - <@${vote.options[i]}>`
		if (embed.fields[2]) embed.fields[2].value += `\n:regional_indicator_${helpers.alphabet[i]}: - <@${vote.options[i]}>`
		voteReactions[i] = `alph_${helpers.alphabet[i]}`
		//voteReactions[i] = `regional_indicator_${helpers.alphabet[i]}`
		voteResults[i] = `0`
	}
	await message.channel.send({ embed }).then(async question => {
		trash.push(question)
		for (const item of voteReactions) {
			const emoji = message.guild.emojis.find(emojis => emojis.name == item)
			await question.react(emoji)
		}
		switch (true) {
		case (type == `askPickTeams` || type == `askPickCaptains`): {
			const reactionFilter = (reaction, user) => (voteReactions.includes(reaction.emoji.name) && !user.bot && players.includes(user.id) && user.id !== question.author.id)
			collector = await question.createReactionCollector(reactionFilter, { time: voteDelay })
			await collector.on(`end`, async (collected, reason) => {
				if (reason == `Admin Stop`) return
				await collected.map(async reaction => {
					voteResults[voteReactions.indexOf(reaction.emoji.name)] = reaction.users.map(async user => user).length - 1
				})
				let results = parseInt(voteResults.reduce((a, b) => a + b))
				let collectedCount = 0
				while (results) {
					collectedCount += results % 10
					results = Math.floor(results / 10)
				}
				if (!collectedCount > 0) {
					winningOption = vote.options[0]
					await question.channel.send(`No players voted in time... The winning option will be **${winningOption}**`).then(resultMsg => trash.push(resultMsg))
				}
				else {
					// await question.channel.send(`**${collectedCount} votes collected**`).then(countMsg => trash.push(countMsg));
					winningCount = Math.max(...voteResults)
					const i = voteResults.indexOf(winningCount)
					winningOption = vote.options[i]
					if (!winningOption) winningOption = vote.options[Math.floor(Math.random() * vote.options.length)]
					let total = 0
					for (const item of voteResults) if (item == winningCount) total++
					if (total == 1 && winningOption) await question.channel.send(`The winner is **${winningOption}** with ${winningCount} votes.`).then(resultMsg => trash.push(resultMsg))
					else await question.channel.send(`${helpers.getNum(question, total).toUpperCase()} options were tied with ${winningCount} votes, so the winner will be **${winningOption}**.`).then(resultMsg => trash.push(resultMsg))
				}
			})
			while (!vote.options.includes(winningOption)) await helpers.delay(3000)
			if (type == `askPickTeams`) teamPickResult = winningOption
			if (type == `askPickCaptains`) captainsPickResult = winningOption
			break
		}
		case (type == `pickCaptains`): {
			const reactionFilter = (reaction, user) => (voteReactions.includes(reaction.emoji.name) && !user.bot && players.includes(user.id) && user.id !== question.author.id)
			collector = await question.createReactionCollector(reactionFilter, { time: voteDelay })
			await collector.on(`end`, async (collected, reason) => {
				if (reason == `Admin Stop`) return
				await collected.map(async reaction => {
					voteResults[voteReactions.indexOf(reaction.emoji.name)] = reaction.users.map(async user => user).length - 1
				})
				let results = parseInt(voteResults.reduce((a, b) => a + b))
				let collectedCount = 0
				while (results) {
					collectedCount += results % 10
					results = Math.floor(results / 10)
				}
				if (!collectedCount > 0) {
					await randomCaptains()
					await message.channel.send(`No players voted in time... The captains will be **<@${captains[0]}>** & **<@${captains[1]}>**`).then(resultMsg => trash.push(resultMsg))
				}
				else {
					// await question.channel.send(`**${collectedCount} votes collected**`).then(countMsg => trash.push(countMsg));
					winningCount = Math.max(...voteResults)
					let i = voteResults.indexOf(winningCount)
					captains[0] = vote.options[i]
					await voteResults.splice(i, 1, -1)
					i = await voteResults.indexOf(Math.max(...voteResults))
					captains[1] = vote.options[i]
					await voteResults.splice(voteResults.indexOf(-1), 1, winningCount)
					if (!captains[1]) {
						const temp = players
						temp.splice(temp.indexOf(captains[0]), 1)
						captains[1] = temp[Math.floor(Math.random() * temp.length)]
					}
					teamOne[0] = captains[0]
					teamTwo[0] = captains[1]
					await question.channel.send(`The captains are **<@${captains[0]}>** and **<@${captains[1]}>**`).then(resultMsg => trash.push(resultMsg))
				}
			})
			while (!captains[0] || !captains[1]) await helpers.delay(3000)
			await helpers.delay(3000)
			break
		}
		case (type == `pickTeams`): {
			const reactionFilter = (reaction, user) => (voteReactions.includes(reaction.emoji.name) && !user.bot && captains.includes(user.id) && user.id !== question.author.id)
			collector = await question.createReactionCollector(reactionFilter)
			let lastPickMsg
			captainsOnlyVote = true
			await collector.on(`collect`, async reaction => {
				const picker = await reaction.users.map(user => user)[1]
				await reaction.remove(picker.id)
				let pickerTeam = teamOne,
					otherTeam = teamTwo
				if (!captains.includes(picker.id)) return
				if (teamTwo.includes(picker.id)) [pickerTeam, otherTeam] = [otherTeam, pickerTeam]
				if (lastPickerId !== picker.id && !((pickerTeam.length - otherTeam.length + 1) > 1)) {
					await reaction.remove(question.author.id)
					if (pickerTeam == teamOne && !teamOne.includes(vote.options[voteReactions.indexOf(reaction.emoji.name)]) && !teamTwo.includes(vote.options[voteReactions.indexOf(reaction.emoji.name)])) await teamOne.push(vote.options[voteReactions.indexOf(reaction.emoji.name)])
					else if (pickerTeam == teamTwo && !teamOne.includes(vote.options[voteReactions.indexOf(reaction.emoji.name)]) && !teamTwo.includes(vote.options[voteReactions.indexOf(reaction.emoji.name)])) await teamTwo.push(vote.options[voteReactions.indexOf(reaction.emoji.name)])
					else return
					lastPickerId = picker.id
					embed.description = `One at a time, starting with Team #1`
					embed.fields[2].value = ``
					for (let i = 0; i < vote.options.length; i++) {
						if (teamOne.includes(vote.options[i])) embed.fields[2].value += `\n:one: - <@${vote.options[i]}>`
						else if (teamTwo.includes(vote.options[i])) embed.fields[2].value += `\n:two: - <@${vote.options[i]}>`
						else embed.fields[2].value += `\n:regional_indicator_${helpers.alphabet[i]}: - <@${vote.options[i]}>`
					}
					await question.edit({ embed }).catch(err => console.log(err))
					startQuestion = question
					startQuestionEmbed = embed
					if (lastPickMsg) await lastPickMsg.edit(`${picker.username} just picked!`).catch(err => console.log(err))
					else lastPickMsg = await question.channel.send(`${picker.username} just picked!`)
					delete reaction.users.map(user => user)[1]
				}
			})
			while ((teamOne.length + teamTwo.length) < startCount) await helpers.delay(3000)
			if (lastPickMsg) await lastPickMsg.delete().catch(() => console.log(`${strings.cantDel}`))
			await message.channel.send(`Teams picked! Setting up...`).then(resultMsg => trash.push(resultMsg))
			collector.stop()
			captainsOnlyVote = false
			break
		}
		}
	})
}

// =============== PUG FUNCTIONS ===============

async function randomCaptains() {
	let randomIndex = Math.floor(Math.random() * players.length)
	captains[0] = players[randomIndex]
	randomIndex = Math.floor(Math.random() * players.length)
	while (captains.length < 2) {
		if (!captains.includes(players[randomIndex])) captains[1] = players[randomIndex]
	}
	teamOne[0] = captains[0]
	teamTwo[0] = captains[1]
}

async function randomTeams(list) {
	let bool = true
	await helpers.shuffle(list)
	for (const player of list) {
		if (!teamOne.includes(player) && !teamTwo.includes(player)) {
			if (bool) await teamOne.push(player)
			if (!bool) await teamTwo.push(player)
			bool = !bool
		}
	}
}

export async function cleanUp(messages, delayBefore, delayAfter) {
	if (delayBefore) await helpers.delay(delayBefore)
	if (messages.length) {
		for (const msg of messages) {
			trash.splice(trash.indexOf(msg), 1)
			msg.delete().catch(() => console.log(`${strings.cantCleanUp}`))
		}
	}
	if (delayAfter) await helpers.delay(delayAfter)
}

export async function end(message, reason = `Game finished`) {
	if (statusCollector) statusCollector.stop()
	if (startMsg.reactions) startMsg.clearReactions()
	if (finalPlayersMsg.reactions) await finalPlayersMsg.clearReactions()
	let reply = `**PUG has ended!**\n**Reason: **${reason}`
	if (cfg.useMissedPUGChannel && missedOutRoom) {
		missedOutRoom.members.map(async member => {
			await member.setVoiceChannel(waitingRoom).catch(err => console.log(err))
		})
	}
	for (const player of players) {
		const member = message.guild.members.get(player)
		await member.setVoiceChannel(waitingRoom).catch(err => console.log(err))
	}
	state = `waiting`
	start = false
	captainsOnlyVote = false
	if (finalPlayersMsg.reactions) await finalPlayersMsg.clearReactions()
	server = {}
	lockedTeams = []
	ready = []
	teamTwo = []
	teamOne = []
	captains = []
	players = await []
	if (queue.length > startCount) {
		queue = await queue.slice(startCount, queue.length)
		reply += await `\nWaiting players have been added!`
	}
	else {
		queue = await []
		reply += await `\nThe queue has been reset!`
	}
	votes.pickCaptains.options = await []
	votes.pickTeams.options = await []
	await message.channel.send(reply)
	if (channelOne) channelOne.delete().catch(cantDel => console.log(`Channel: `, cantDel))
	if (channelTwo) channelTwo.delete().catch(cantDel => console.log(`Channel: `, cantDel))
	await cleanUp(trash, 0, 3000)
	if (queue.length == startCount) run(message)
	else if (queue[0]) await teams(message, 1)
}

export async function teams(message, sticky = 0) {
	if (teamMsg.channel && !teamMsg.deleted) {
		trash.splice(trash.indexOf(teamMsg), 1)
		await teamMsg.delete().catch(err => console.log(`teamMsg\n`, err))
	}
	embed = await helpers.initEmbed(message, 1)
	if (!players[0] && state !== `startCheck`) state = `waiting`
	embed.title = `**PUG Status**   ( ${queue.length} Players )`
	if ((state == `playersFound` && cfg.requireReadyUp) || state == `ready`) embed.title = `**PUG Status**   ( ${ready.length} of ${startCount} Ready )`
	else embed.title = `**PUG Status**   ( ${queue.length} Players )`
	embed.description = `${states.pug[state].name}`
	embed.fields[0].name = `Queue`
	embed.fields[0].value = `${strings.noPlayersQueudForPug}`
	// No players queued
	if (!queue[0]) return helpers.reply(message, { embed }, 6000, true)
	// Players have captains / teams
	if (teamOne.length == startCount / 2) {
		embed.fields[0].name = `Team #1`
		embed.fields[0].value = ``
		for (const player of teamOne) {
			if (state == `ready` && ready.includes(player) && cfg.requireReadyUp) embed.fields[0].value += `\n<@${player}> *- Ready*`
			else embed.fields[0].value += `\n<@${player}>`
		}
		if (teamTwo.length == startCount / 2) {
			embed.fields[0].inline = true
			embed.fields[1] = teamTwoField
			embed.fields[1].value = ``
			for (const player of teamTwo) {
				if (state == `ready` && ready.includes(player) && cfg.requireReadyUp) embed.fields[1].value += `\n<@${player}> *- Ready*`
				else embed.fields[1].value += `\n<@${player}>`
			}
		}
		lockedTeams = players.slice(0)
	}
	// Players have no captains / teams
	else if (players[0]) {
		embed.fields[0].value = ``
		for (let i = 0; i < players.length; i++) {
			if (ready.includes(players[i]) && cfg.requireReadyUp) embed.fields[0].value += `\n#${i + 1} <@${players[i]}> *- Ready*`
			else embed.fields[0].value += `\n#${i + 1} <@${players[i]}>`
		}
	}
	// Queue but no players
	else if (queue[0]) {
		let limit = queue.length
		if (state == `startCheck` && queue.length > startCount) limit = startCount
		embed.fields[0].value = ``
		for (let i = 0; i < limit; i++) {
			embed.fields[0].value += `\n#${i + 1} <@${queue[i]}>`
		}
	}
	// Waiting players
	if (queue.length > startCount) {
		await embed.fields.push(playersField)
		embed.fields[embed.fields.length - 2].value += `\nㅤ`
		embed.fields[embed.fields.length - 1].name = `Missed Out`
		embed.fields[embed.fields.length - 1].value = ``
		for (let i = 0; i < queue.length; i++) {
			if (!players.includes(queue[i]) && i >= startCount) embed.fields[embed.fields.length - 1].value += `\n#${(i - startCount) + 1} <@${queue[i]}>`
		}
	}
	let msg = {}
	switch (sticky) {
	case 0: // Temp
		msg = helpers.reply(message, { embed }, 10000, true)
		return msg
	case 1: // Semi-Perm
		msg = message.channel.send({ embed }).then(teamsMsg => {
			teamMsg = teamsMsg
		})
		return msg
	case 2: // Perm
		msg = message.channel.send({ embed })
		return msg
	}
}
