import * as helpers from '../assets/helpers.js'
import { cfg } from '../../settings/config.js'

export default {
	name: `event`,
	guildOnly: true,
	staffRoleRequired: true,
	argsRequired: true,
	description: `Create/Edit/Delete an event.`,
	usage: `<action> <arg>`,
	example: `create Event Name`,
	execute(message, args) {
		if (args.length < 2) return helpers.reply(message, `Please provide a command function and event name. Try \`${cfg.prefix}help ${this.name}\` for more info`)
		let eventName = args.slice(1, args.length).join(` `),
			channel
		switch (true) {
		case (args[0] == `create`): {
			if (message.guild.roles.find(r => r.name == `Event: ${eventName}`)) return helpers.reply(message, `This event already exists`)
			helpers.makeRole(message, `Event: ${eventName}`).then(eventRole => {
				helpers.makeChannel(message, eventName, `text`, 10).then(async eventChan => {
					if (cfg.devMode || cfg.testMode) {
						await eventChan.overwritePermissions(message.guild.roles.find(r => r.name == `@everyone`), {
							VIEW_CHANNEL: false,
						}).catch(err => console.log(err))
						await eventChan.overwritePermissions(message.guild.roles.find(r => r.name == `${cfg.botsRoleName}`), {
							VIEW_CHANNEL: true,
						}).catch(err => console.log(err))
					}
					else if (!cfg.devMode && !cfg.testMode) {
						await eventChan.overwritePermissions(message.guild.roles.find(r => r.name == `@everyone`), {
							VIEW_CHANNEL: null,
						}).catch(err => console.log(err))
					}
					eventChan.setParent(cfg.pugCategoryId).catch(err => console.log(err))
					eventChan.send(`**<@${message.author.id}> created an event:** <@&${eventRole.id}>`)
					channel = eventChan
				}).catch(err => console.log(err))
				console.log(`Event created by ${message.author.tag}: ${eventName}`)
				if (cfg.announcementChannels) {
					for (const chanName of cfg.announcementChannels) {
						const textChan = message.guild.channels.find(chan => chan.name == chanName)
						textChan.send(`**<@${message.author.id}> created an event:** <@&${eventRole.id}>`)
					}
				}
			}).catch(err => console.log(err))
			break
		}
		case (args[0] == `delete` || args[0] == `del`): {
			// While being completed
			if (message.author.id !== `140437382704005130`) return helpers.reply(message, `this is under development. Only <@140437382704005130> has access atm`)
			if (!message.mentions.roles.size) return helpers.reply(message, `You must @mention the event role`)
			message.mentions.roles.map(async eventRole => {
				eventName = eventRole.name
				eventRole.delete().then(() => {
					if (cfg.announcementChannels) {
						for (const chanName of cfg.announcementChannels) {
							const textChan = message.guild.channels.find(chan => chan.name == chanName)
							textChan.send(`**<@${message.author.id}> deleted an event:** ${eventName}`)
						}
					}
				})
				await eventName.replace(`Event: `, ``)
				await eventName.replace(`#`, ``)
				await eventName.replace(` `, `-`)
				if (!channel) channel = message.guild.channels.find(c => c.name.includes(eventName))
				if (channel.position && !channel.deleted) {
					channel.setParent(cfg.archiveCategoryId).then(async chan => {
						await chan.overwritePermissions(message.guild.roles.find(r => r.name == `@everyone`), {
							VIEW_CHANNEL: false,
						}).catch(err => console.log(err))
					}).catch(err => console.log(err))
				}
			})
			break
		}
		case (args[0] == `edit`): {
				return helpers.reply(message, `this is under development. Only <@205622651107016705> has access atm`)
		}
		default: {
			return helpers.reply(message, `Please provide a command function and event name. Try \`${cfg.prefix}help ${this.name}\` for more info`)
		}
		}
	},
}
