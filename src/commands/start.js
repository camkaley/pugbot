import * as pug from '../assets/pug.js'
import * as helpers from '../assets/helpers.js'

export default {
	name: `start`,
	botModRoleRequired: true,
	guildOnly: false,
	description: `Manually start the PUG after editing players list.`,
	execute(message) {
		if (!pug.players[0] && pug.queue.length >= pug.startCount) {
			if (pug.collector) pug.collector.stop()
			if (pug.waitQuestion) helpers.deleteMsg(pug.waitQuestion)
			pug.run(message)
		}
	},
}
