"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	name: "flip",
	aliases: ["coin", "toss"],
	description: "Flip a coin!",
	guildOnly: true,
	execute: function execute(message) {
		var sides = ["Heads", "Tails"];
		var result = sides[Math.floor(Math.random() * sides.length)];
		var coin = message.guild.emojis.find(function (emoji) {
			return emoji.name == "coin";
		});
		if (coin) message.channel.send("<@" + message.author.id + "> flipped a coin and got " + coin + " **" + result + "**");else message.channel.send("<@" + message.author.id + "> flipped a coin and got **" + result + "**");
	}
};