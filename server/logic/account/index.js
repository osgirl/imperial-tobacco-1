const config = require('../../../config/index');


module.exports = class Account {
	constructor(rep, email) {
		this.accountRep = rep;
		this.email = email;
	}

	async updateUserByAdmin(req) {
		// let user = await this.accountRep.userById(req.id);
		// if (user) {
		// 	let info = await this.checkIfNewDataIsCorrect(this.accountRep, req, user);
		// 	if (!info.success) {
		// 		return info;
		// 	}

		// 	await this.accountRep.updateUserByAdmin(req);
		// 	info.msg += 'changes has been saved';
		// 	return info;
		// }
	}

};