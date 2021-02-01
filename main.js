/* Changes for next Commit:
	1) Small fix for rules (added footer to the last embed)
*/

// --- Setup stuff ---

const Discord = require('discord.js'); // Getting discord module
const client = new Discord.Client();
const fs = require('fs'); // Getting file system module

client.mysql = require('mysql');

const { promisify } = require('util')
client.sleep = promisify(setTimeout)

	// --- Collection Lists ---

client.pVars = require('./passwords.js');

client.commands = new Discord.Collection(); // All commands in commands folder
client.adminCommands = new Discord.Collection(); // All commands in adminCommands folder

client.votes = new Discord.Collection(); // All current votes in #voting 
client.rules = new Discord.Collection(); // All voted rules and then there are core laws set by me for some order

	// --- Global variables ---

client.adminList = ['183617597365813248']; // List of admin IDs
client.botCount = 2

client.categoryList = [
	"Voting",
	"User",
	"Economy"

]

client.roleId = {
	admin: '802154205145464882',
	member: '802321291129651242',
	muted: '803682613377761305'
};

client.channelId = {
	commandChannels: ['801914747599061022', '804277866790518804'], // [1] Bot-Commands [2] Admin-Commands
	voting: '801914827760205885',
	rules: '801916814501347329	'
};

client.settings = {
	adminCommands: true, // If AdminCommands should even be loaded
	maxRanks: 2, // Does not include member or everyone. If user is in adminlist this number does not affect them.
	majorityRate: 1/3,
};


// --- Load in commands and events --

['commandLoader', 'eventLoader'].forEach(h => {
	require(`./loaders/${h}`)(client, Discord);
})

// --- MySQL ---

process.on('exit', function(code) {
	console.log(code);
})

client.con = client.mysql.createConnection({
			host: "localhost",
			user: "root",
			password: client.pVars.dbPass,
			database: client.pVars.database
		});

client.con.connect(err => {
	if(err) throw err;
	console.log("Connected to DB!");
});

// --- Login bot ---

client.login(client.pVars.token) // Activate/Login the bot-commands