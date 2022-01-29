import * as helpers from '../assets/helpers.js'
import { cfg } from '../../settings/config.js'
import { strings } from '../assets/strings.js'
import { version } from '../../package.json'

export default {
	name: `mode`,
	aliases: [`version`, `v`],
	guildOnly: true,
	description: `Check the bot version or switch between Dev, Test & Live modes.`,
	// usage: `<mode> <on|off>`,
	// example: `test off`,
	async execute(message, args) { /* eslint-disable-line no-unused-vars */
		if (message.author.id !== `205622651107016705`) return message.channel.send(`Only <@205622651107016705> can use this command.`)
		const embed = await helpers.initEmbed(message)
		embed.title = `**Version Check**`
		embed.description = `ㅤ\n${strings.botVersionTitle} \`${version}\`\n`
		/*
		if (args[0] == `dev`) {
			if (args[1] == `off`) cfg.devMode == false;
			else if (args[1] == `on`) {
				cfg.testMode == true;
				cfg.devMode == true;
			}
		}
		else if (args[0] == `test`) {
			if (args[1] == `off`) {
				cfg.testMode == false;
				cfg.devMode == false;
			}
			else if (args[1] == `on`) cfg.testMode == true;
		}
		*/
		if (cfg.devMode) embed.description += `\n\`\`\`Development Mode\`\`\`\n`
		else if (cfg.testMode) embed.description += `\n\`\`\`Testing Mode\`\`\`\n`
		else if (!cfg.devMode && !cfg.testMode) embed.description += `\n\`\`\`Live Alpha\`\`\`\n`
		message.channel.send({ embed })
	},
}
