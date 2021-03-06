module.exports = async (client, discord, channel, user, xp_amount, previous_xp) => {

    const lvl = await client.data.jobs.xpToLevel(xp_amount)

    if(lvl <= await client.data.jobs.xpToLevel(previous_xp)){
        return;
    }

	const embed = new discord.MessageEmbed()
        .setTitle('Level UP!')
        .addField(`${user.displayName} leveled up!`, `Congratulations on reaching level ${lvl}`)
        .setColor('#dde026')
        .setFooter('Keep going! You are doing great!');

    channel.send(embed);

	client.eventEm.emit('achivementEarned', channel, user, client.achivementList.find(element => element.id == `L${lvl}`));
}