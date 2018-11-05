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

const DB = require('../server/db');

(async function () {
	const db = await DB.connect();
	try {
		let items = await db.collection('items').aggregate(pipeline).toArray();

		for(let item of items) {
			let res = await db.collection('items').findOne({ code: `${item.code}5` });
			if(!res) continue;

			await db.collection('items').updateOne({"_id": item._id}, { $set: {
				"prices.five_pack_jr_price": res.prices.jr_price,
				"prices.five_pack_cigars_price": res.prices.cigars_price,
				"prices.five_pack_seriouscigars_price": res.prices.seriouscigars_price,
				"prices.five_pack_wholesale_price": res.prices.wholesale_price,
			}});

			console.log(`${res.code} prices saved to five pack prices of ${item.code}`);
			await db.collection('items').deleteOne({"_id": res._id});
		}
	}
	catch (err) {
		process.exit(1);
	}

	process.exit(0);
})();
