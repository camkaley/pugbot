import * as pug from '../assets/pug.js'

export default {
	name: `pug`,
	aliases: [`status`, `queue`],
	guildOnly: true,
	description: `Check the PUG waiting list & status.`,
	execute(message, args) {
		if (args[0]) pug.teams(message, parseInt(args[0]))
		else pug.teams(message)
	},
}
