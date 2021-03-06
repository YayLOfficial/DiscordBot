const vote = {
	run: function(client, index){
		client.data.rules.updateRules(client, "", "", "del", index)
	}
}

module.exports = {
	name : "DeleteLaw",
	alias : ["dlaw"],
	use: "-DeleteLaw (Number) (Reason)",
	description : "Create a vote to remove a new law/rule from the server",
	options: {ShowInHelp: true, Category: "Voting"},
	run : async function(msg, client, disc, args){
		try{
			let index = Number(args[0])
			if(isNaN(index)){
				return client.msg.errorReply(msg, "Make sure to input an actual law id");
			}
			let law = await client.data.rules.getRule(client, index).then(law => {return law});	
			if(law.corelaw == 1) return client.msg.reply(msg,"*It is not allowed to delete the corelaw:* __" + law.rule_name +"__",
			"If you still have questions about this decision take it up with an Engineer!", disc);
			
			const title = "Propositon Remove Law: ***Law #" + index + " - " + law.rule_name +"***";
			const desc = `Do you agree with ${msg.member.user.username} that we need to remove this law?`;
			const fieldTitle = "Why should we remove this law?";
			const fieldText = args.slice(1).join(" ");
			
			client.msg.createVote(title, desc, fieldTitle, fieldText, msg, disc)
			.then(em => {
				client.votes.set(em, [vote, index]);
			});
        }catch(e){
            client.eventEm.emit('CommandError', msg, this.name, args, e)
        }
		
	}
}

