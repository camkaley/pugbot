import * as helpers from '../assets/helpers.js'
import { strings } from '../assets/strings.js'

export default {
	name: `help`,
	aliases: [`commands`, `cmds`, `list`, `h`],
	description: `List all of my commands or info about a specific command.`,
	usage: `<command>`,
	execute(message, args, cmd, cfg) {
		const { commands } = message.client
		if (!args.length) {
			const embed = {
				"title": `**${strings.botName} Help**`,
				"color": 1878473,
				"timestamp": new Date(Date.now()).toISOString(),
				"author": {
					"name": `${cfg.hostName}`,
					"url": `http://discord.gg/EJ44zZb`,
					"icon_url": `https://pacificgl.com/images/500x500_PGL_Logo.png`,
				},
				"thumbnail": {
					"url": `https://pacificgl.com/images/500x500_PGL_Logo.png`,
				},
				"footer": {
					"icon_url": `https://pacificgl.com/images/500x500_PGL_Logo.png`,
					"text": `${strings.author}`,
				},
				"fields": [
					{
						"name": `Here are my commands`,
						"value": commands.map(command => command.name).join(`, `),
					},
					{
						"name": `Need info on a specific command?`,
						"value": `\nYou can send \`${cfg.prefix}help <command>\` to get info on any command you want!`,
					},
				],
			}
			return message.author.send({ embed }).then(() => {
				if (message.channel.type !== `text`) return
				message.reply(`I've sent you a DM with my commands!`)
			}).catch(err => {
				console.log(`Could not send help DM to ${message.author.tag}.\n`, err)
				helpers.reply(message, `it seems like I can't DM you!`)
			})
		}
		const name = args[0].toLowerCase()
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))
		if (!command) return helpers.reply(message, `that's not a valid command!`)
		const embed = {
			"title": `**${strings.botName} Help**`,
			"color": 1878473,
			"timestamp": new Date(Date.now()).toISOString(),
			"author": {
				"name": `${cfg.hostName}`,
				"url": `http://discord.gg/EJ44zZb`,
				"icon_url": `https://pacificgl.com/images/500x500_PGL_Logo.png`,
			},
			"thumbnail": {
				"url": `https://pacificgl.com/images/500x500_PGL_Logo.png`,
			},
			"footer": {
				"icon_url": `https://pacificgl.com/images/500x500_PGL_Logo.png`,
				"text": `${strings.author}`,
			},
			"fields": [
				{
					"name": `Command`,
					"value": `\`${command.name}\``,
					"inline": true,
				},
			],
		}
		if (command.aliases) {
			const cmdAliases = {
				"name": `Aliases`,
				"value": `${command.aliases.join(`, `)}`,
				"inline": true,
			}
			embed.fields.push(cmdAliases)
		}
		if (command.description) {
			const cmdDesc = {
				"name": `Description`,
				"value": `${command.description}`,
			}
			embed.fields.push(cmdDesc)
		}
		if (command.usage) {
			const cmdUsage = {
				"name": `Usage`,
				"value": `\`\`\`${cfg.prefix}${command.name} ${command.usage}\`\`\``,
			}
			embed.fields.push(cmdUsage)
		}
		if (command.example) {
			const cmdExample = {
				"name": `Example / Alt. Usage`,
				"value": `\`\`\`${cfg.prefix}${command.name} ${command.example}\`\`\``,
			}
			embed.fields.push(cmdExample)
		}
		message.channel.send({ embed })
	},
}
