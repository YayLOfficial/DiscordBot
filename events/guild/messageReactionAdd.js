const updaterules = require('./../../loaders/updateRules.js')

function checkVotes(reaction, client, disc){
	const command = client.votes.get(reaction.message)
	command[0].run(command[1]);
	reaction.message.delete();
	updaterules.update(client, disc, reaction.message);
}

module.exports = (client, disc, reaction, user) => {
	if(reaction.message.channel.id == client.channelId.voting 
		&& reaction.count >= (Math.ceil((reaction.message.guild.memberCount-client.botCount)*client.settings.majorityRate))){
		checkVotes(reaction, client, disc);
	}
}