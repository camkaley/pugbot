import { cfg } from '../../settings/config.js'
import { strings } from './strings.js'
import sql from 'sqlite'
sql.open(`./src/assets/warbot.sqlite`)

export const alphabet = [`a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`, `y`, `z`]

export function delay(timeout) {
	return new Promise(resolve => setTimeout(resolve, timeout))
}

export function deleteMsg(message) {
	message.channel.fetchMessage(message.id).then(fetched => fetched.delete()).catch(err => console.error(err))
}

export function shuffle(array) {
	let counter, index, temp
	counter = array.length
	while (counter > 0) {
		index = Math.floor(Math.random() * counter)
		counter--
		temp = array[counter]
		array[counter] = array[index]
		array[index] = temp
	}
	return array
}

export async function initEmbed(message, hasField = 0) {
	const embed = {
			"title": ``,
			"description": ` `,
			"color": 1878473,
			"timestamp": new Date(Date.now()).toISOString(),
			"author": {
				"name": `${message.guild.name}`,
				"icon_url": `${message.guild.iconURL}`,
			},
			"thumbnail": {
				"url": `${message.guild.iconURL}`,
			},
			"footer": {
				"icon_url": `${message.guild.iconURL}`,
				"text": `${strings.author}`,
			},
		},
		fields = [
			{
				"name": `Options`,
				"value": `*No Options Provided...*`,
				"inline": false,
			},
		]
	if (hasField > 0) embed.fields = fields
	return embed
}

export function reply(message, replyContent = ``, deleteDelay = 3500, say = false) {
	if (say) {
		message.channel.send(replyContent).then(sentMessage => {
			sentMessage.delete(deleteDelay).catch(cantDel => console.log(cantDel))
		}).catch(err => console.error(`Reply Error:\n`, err))
	}
	else {
		message.reply(replyContent).then(sentMessage => {
			sentMessage.delete(deleteDelay).catch(cantDel => console.log(cantDel))
		}).catch(err => console.error(`Reply Error:\n`, err))
	}
}

export async function makeChannel(message, channelName, channelType, size) {
	const channel = await message.guild.createChannel(channelName, channelType, [{
		id: message.guild.id,
		allow: [`VIEW_CHANNEL`, `CONNECT`, `SPEAK`, `USE_VAD`],
	}]).catch(err => console.error(`Make Channel Error:\n`, err))
	if (channelType == `voice` && (size > 1 && size < 99)) await channel.setUserLimit(parseInt(size))
	return channel
}

export async function makeRole(message, roleName, color = `GOLD`, position = 0, permissions = 0, mentionable = true) {
	const role = await message.guild.createRole({
		name: roleName,
		color: color,
		position: position,
		permissions: permissions,
		mentionable: mentionable,
	}).catch(err => console.log(err))
	return role
}

export function getNum(message, num) {
	const numbers = [`zero`, `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`, `ten`, `eleven`, `twelve`, `thirteen`, `fourteen`, `fifteen`, `sixteen`, `seventeen`, `eighteen`, `nineteen`]
	const str = `Number must be between 0 and 19.`
	if (num < 0 || num > 19) return str
	return numbers[num]
}

export function xpHandler(message, users) {
	for (const userId of users) {
		const member = message.guild.members.get(userId)
		const defaultRank = `Member`
		const vetRole = message.guild.roles.find(role => role.name == cfg.proPlayerRole)
		sql.get(`SELECT * FROM stats WHERE userID = ${userId}`).then(row => {
			if (!row) return sql.run(`INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)`, [userId, 1, defaultRank])
			if (row.pugs + 1 > cfg.proPlayerRolePugCount) {
				member.addRole(vetRole).catch(err => console.log(err))
				row.rank = `${cfg.proPlayerRole}`
			}
			if (row.pugs + 1 < cfg.proPlayerRolePugCount) {
				member.removeRole(vetRole).catch(err => console.log(err))
				row.rank = defaultRank
			}
			sql.run(`UPDATE stats SET pugs = ${row.pugs + 1}, rank = '${row.rank}' WHERE userID = ${userId}`)
		}).catch(() => {
			sql.run(`CREATE TABLE IF NOT EXISTS stats (userID TEXT, pugs INTEGER, rank TEXT)`).then(() => {
				sql.run(`INSERT INTO stats (userID, pugs, rank) VALUES (?, ?, ?)`, [userId, 1, defaultRank])
			})
		})
	}
}

export function logger(guild, action, message, xInt, xRole, xMember, xString) {
	/*
	TO DO:
	Member banned
	Member unbanned
	Channel created
	Channel deleted
	Role created
	Role deleted
	Role updated
	Nickname changes
	Username changes
	Voice channel joins
	Voice channel leaves
	Voice channel moves
	Log invites/info
	*/
	const logChan = guild.channels.find(channel => cfg.logChannels.includes(channel.name))
	let author = ``
	if (message) author = message.author.tag
	else author = guild.name
	const embed = {
		"description": ` `,
		"color": 1878473,
		"timestamp": new Date(Date.now()).toISOString(),
		"author": {
			"name": `${author}`,
			"icon_url": `${guild.iconURL}`,
		},
		"footer": {
			"icon_url": `${guild.iconURL}`,
		},
	}
	switch (action) {
	case `guildMemberAdd`:
		embed.description = `**<@${xMember.user.id}> joined the server!**`
		embed.color = 65280
		embed.thumbnail = {}
		embed.thumbnail.url = `${xMember.user.displayAvatarURL}`
		embed.footer.text = `ID:${xMember.user.id} `
		embed.author.name = `Member Joined`
		break
	case `guildMemberRemove`:
		embed.description = `**<@${xMember.user.id}> left the server!**`
		embed.color = 14246185
		embed.thumbnail = {}
		embed.thumbnail.url = `${xMember.user.displayAvatarURL}`
		embed.footer.text = `ID:${xMember.user.id} `
		embed.author.name = `Member Left`
		break
	case `guildMemberRoleAdd`:
		embed.description = `**<@${xMember.user.id}> was added to \`${xRole.name}\`**`
		embed.footer.text = `ID:${xMember.user.id} `
		embed.author.name = `${xMember.user.tag}`
		break
	case `guildMemberRoleRemove`:
		embed.description = `**<@${xMember.user.id}> was removed from \`${xRole.name}\`**`
		embed.footer.text = `ID:${xMember.user.id} `
		embed.author.name = `${xMember.user.tag}`
		break
	case `kick`:
		embed.description = `**${xMember.user.tag}**  (${xMember.user.id}) **was kicked by <@${message.author.id}>\nReason:** \`${xString}\``
		break
	case `ban`:
		embed.description = `**${xMember.user.tag}**  (${xMember.user.id}) **was banned by <@${message.author.id}>\nReason:** \`${xString}\``
		break
	case `prune`:
		embed.description = `**<@${message.author.id}> deleted ${xInt} messages in <#${message.channel.id}>**`
		break
	case `say`:
		embed.description = `**<@${message.author.id}> said** the following in <#${message.channel.id}>\n\`\`\`${xString}\`\`\``
		break
	}
	logChan.send({ embed })
}
