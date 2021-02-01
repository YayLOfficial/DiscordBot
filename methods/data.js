function setBalance(plr, amount, client){
	client.con.query(`SELECT * FROM userbalances WHERE id = '${plr.id}'`, (e, rows) => {
		if(e) throw e;
		if(amount>2147483647){amount=2147483647}
		if(amount<0){amount=0}

		let sql;

		if(rows.length < 1){
			sql = `INSERT INTO userbalances (id, bal) VALUES ('${plr.id}', ${amount})`
		}else{
			sql = `UPDATE userbalances SET bal = ${amount} WHERE id = ${plr.id}`
		}

		client.con.query(sql);
	})
}
const m = require('./messaging')

module.exports = {
	updateUserBalance(msg, client, discord, plr, amount, type) {

		if(plr == undefined){
			m.errorReply(msg, "User was not specified", client, discord);
			return
		}
		amount = Number(amount);
		if(isNaN(amount)){return}

		if(type == "add"){
			this.getBalance(client, plr)
			.then(a => {
				setBalance(plr, a+amount, client);
			});
		}else{
			setBalance(plr, amount, client);
		}
			
	},

	getBalance: (client, player) => {
		try{
			return new Promise(resolve => {
				client.con.query(`SELECT * FROM userbalances WHERE id = '${player.id}'`, (e, rows) => {
					if(e) throw e;
					if(rows[0] == undefined){
						setBalance(player, 0, client);
						resolve("0")
					}else{
						resolve(rows[0].bal);
					}
				});
			});
		}catch(e){
			console.log(e);
		}
	},

	getRule: (client, ID) => {
		try{
			return new Promise(resolve => {
				client.con.query(`SELECT * FROM rules WHERE rule_index = '${ID}'`, (e, rows) => {
					if(e) throw e;
					if(rows[0] == undefined){
						resolve(null);
					}else{
						resolve(rows[0]);
					}
				});
			});
		}catch(e){
			console.log(e);
		}
	},

	getMaxRuleId: (client) => {
		try{
			return new Promise(resolve => {
				client.con.query(`SELECT MAX(id) AS value FROM rules`, (e, rows) => {
					if(e) throw e;
					resolve(rows[0].value);
				});
			});
		}catch(e){
			console.log(e);
		}
	},

	getAllRules: (client) => {
		try{
			return new Promise(resolve => {
				client.con.query(`SELECT * FROM rules`, (e, rows) => {
					if(e) throw e;
					resolve(rows)
				});
			});
		}catch(e){
			console.log(e);
		}
	},

	updateRules(client, name, desc, type, index){
		let sql;
		if(type == "add"){
			sql = `INSERT INTO rules (ID, rule_name, rule_desc) VALUES (${index}, '${name}', "${desc}")`;
		}else if(type == "set"){
			sql = `UPDATE rules SET rule_name = '${name}' WHERE ID = ${index}`;
			client.con.query(sql);
			sql = `UPDATE rules SET rule_desc = "${desc}" WHERE ID = ${index}`;
		}

		client.con.query(sql);
	}
}