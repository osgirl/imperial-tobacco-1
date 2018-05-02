const pipeline = [
	{
		"$match" : {
			"name": {$ne: null, $exists: 1},
			"brand_name": {$ne: null, $exists: 1},
			"code": /^(.(?!_1$))+$/
		}
	},
	{
		"$project" : {
			"_id": 1,
			"code": 1
		}
	}
];

module.exports.name = "add_five_pack_price";

module.exports.up = async function (db) {
	try {		
		let items = await db.collection('items').aggregate(pipeline).toArray();
		
		for(let item of items) {
			let reg = new RegExp(`${item.code}5.*`);
			let res = await db.collection('items').findOne({ code: { $regex: reg } });
			if(!res) continue;

			await db.collection('items').updateOne({"_id": item._id}, { $set: {
				"prices.five_pack_jr_price": res.prices.jr_price,
				"prices.five_pack_cigars_price": res.prices.cigars_price,
				"prices.five_pack_seriouscigars_price": res.prices.seriouscigars_price,
				"prices.five_pack_wholesale_price": res.prices.wholesale_price,
			}});
		}
	} catch(err) {
		throw err;
	}
};