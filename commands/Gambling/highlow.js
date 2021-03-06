module.exports = {
	name: "Highlow",
	alias: ["hl"],
	use: "-Highlow [bet]",
	description: "Bet that you will choose correctly",
	options: {ShowInHelp: true, Category: "Gambling"},
	run: async function(msg, client, disc, args){
        try{
            let bet = client.utils.suffixCheck(args[0])
            if(bet == "all") bet = await client.data.user.getBalance(client, msg.member);
						if(!bet || bet < 1) return client.eventEm.emit('InvalidInputAmount', msg);

            if(!await client.data.user.enoughMoney(client, msg.member, bet)) return

            client.data.user.addBalance(client, msg.member, -1*bet, "add");

            highlow(client, msg, disc, bet)
        }catch(e){
            client.eventEm.emit('CommandError', msg, this.name, args, e)
        }

	}
}

async function highlow(client, msg, disc, bet){
    const number = await Math.floor(Math.random()*(100))+1
    const hint = await Math.floor(Math.random()*(100))+1
    const embed = new disc.MessageEmbed()
        .setTitle(`${msg.member.displayName}'s high-low game`)
        .setDescription(`A number has been chosen at random. The hint is ${hint}\n`
            + `:regional_indicator_h: Higher\n`
            + `:regional_indicator_l: Lower\n`
            + `:regional_indicator_j: Jackpot`)
        .setFooter('Choose if you think it is higher, lower or that number')

    const filter = (reaction, user) => {
        if(user.id != msg.member.id) return false;
        let correct = false;
        if(reaction.emoji.name == client.s.emoji[7]){
            checkIfRight(client, msg, disc, bet, number, hint, "h")
            correct = true
        }else if(reaction.emoji.name == client.s.emoji[11] ){
            checkIfRight(client, msg, disc, bet, number, hint, "l")
            correct = true
        }else if(reaction.emoji.name == client.s.emoji[9] ){
            checkIfRight(client, msg, disc, bet, number, hint, "j")
            correct = true
        }
        if(correct) reaction.message.delete();
    }

    msg.channel.send(embed)
        .then(message => {
            message.awaitReactions(filter)
            message.react(client.s.emoji[7]); //H
            message.react(client.s.emoji[11]); //L
            message.react(client.s.emoji[9]); //J
        })
}

function checkIfRight(client, msg, disc, bet, number, hint, choice){
    if(choice == "h" && number>hint){
        reply(client, msg, disc, bet, number, true);
    }else if(choice == "l" && number<hint){
        reply(client, msg, disc, bet, number, true);
    }else if(choice == "j" && number==hint){
        reply(client, msg, disc, bet, number, true, true);
    }else{
        reply(client, msg, disc, bet, number, false)
    }
}

function reply(client, msg, disc, bet, number, correct, jackpot=false){

    const winnings = Math.floor(bet*(Math.random()*(0.8-0.05)+0.05))
    const lose_message = `\nYou lost the money you bet!`
    const correct_message = `\nYou won $${client.utils.numberWithCommas(winnings, true)}!`
    const jackpot_message = `\nWell, this is rare! You won the jackpot of $${client.utils.numberWithCommas(winnings*100, true)}`

    let extra;
    if(correct && jackpot) {
        extra = jackpot_message;
        client.data.user.addBalance(client, msg.member, bet + winnings*100, "add");
    }
    else if(correct) {
        extra = correct_message;
        client.data.user.addBalance(client, msg.member, bet + winnings, "add");
    }else {
        extra = lose_message
    }

    const embed = new disc.MessageEmbed()
        .setTitle(`You guessed ${correct ? "correctly" : "incorrectly"}!`)
        .setDescription(`The number was ${number} `+extra)
        .setColor("#2ce026")
        .setFooter('Go again!')

    msg.channel.send(embed);
}
