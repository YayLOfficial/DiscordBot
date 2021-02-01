const m = require('./../methodsLoader.js');

module.exports = {
	name: "AddBalance",
	alias: ["abal", "addbal"],
	use: "-AddBalance @[user] [amount]",
	description: "Add to users bal",
	options: {ShowInHelp: false},
	run: function(msg, client, disc, args){
		m.utils.getMember(args[0], client, msg)
		.then(plr => {
			if(args[0] == "me"){
				plr = msg.author;
			}
			m.data.updateUserBalance(msg, client, disc, plr, args[1], "add");
		})
	}
}