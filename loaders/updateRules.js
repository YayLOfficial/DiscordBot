const m = require('./../methodsLoader.js')

const lawsPerEmbed = 8

function sendRules(client, disc, msg){
	m.data.getAllRules(client)
	.then(rules => {
		let embed = new disc.MessageEmbed()
		.setTitle("***LAWS:***")
		for(let r of rules){
			if(r.id%lawsPerEmbed == 1 && r.id != 1){
				m.utils.getChannel(msg, client.channelId.rules).send(embed);
				embed = new disc.MessageEmbed()
				.setColor('#9aedea') // Give it a color in hexidecimal format
			}else{
				embed.addFields({
					name: "---------------------",
					value: "\u200b"},
				{
					name: "***" + r.id +". " + r.rule_name + "***",
					value: "*" + r.rule_desc + "*",
					inline: true},
				{
					name: "**Added:**",
					value: "*" + r.rule_date + "*",
					inline: true})
			}
		}
		embed.setFooter("Abide by the law!");
		m.utils.getChannel(msg, client.channelId.rules).send(embed);
	})
}

module.exports = {
	update: function(client, disc, msg){
		m.utils.clearChat(msg, 5, client.channelId.rules)
		client.sleep(1000).then(() => {
			sendRules(client, disc, msg)
		})
	}
}