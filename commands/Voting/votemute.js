const vote = {
	run: function(client, player){
		player.guild.roles.fetch(client.roleId.muted)
		.then(role => {
			player.roles.add(role);
		})
	}
}

module.exports = {
	name : "VoteMute",
	alias : ["mute", "vm", "votem"],
	use: "-VoteMute (@Member) (reason)",
	description : "Vote to mute a user in Text Channels",
	options: {ShowInHelp: true, Category: "Voting"},
	run : async function(msg, client, disc, args){
		try{
			const player = await client.utils.getMember(args[0], msg);
			if(!player) return client.utils.clearChat(msg, 1, client.channelId.voting);

			var reason = args.slice(1).join(" ");

			if(reason.length == 0) reason = 'Because I said so'

			const title = "Vote Mute"
			const desc = `Do you wish to chat-mute ${player}?`
			const fieldTitle = "Reason for chat-mute: "

			client.msg.createVote(title, desc, fieldTitle, reason, msg, disc).then(em => {
				client.votes.set(em, [vote, player]);
			});
    }catch(e){
        client.eventEm.emit('CommandError', msg, this.name, args, e)
    }
	}
}
