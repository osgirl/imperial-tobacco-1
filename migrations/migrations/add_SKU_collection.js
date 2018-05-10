const xlsx = require('node-xlsx').default;
module.exports.name = "add_SKU_collection";

module.exports.up = async function (db) {
	// try {
	// 	let IDs = await db.collection('items').aggregate(pipeline).toArray();

	// 	for (let i = 0; i < IDs.length; i++) {
	// 		let data = getRandomData();
	// 		await db.collection('items').updateOne({"_id": IDs[i]._id}, {$set: {platform_prices: data}});
	// 	}
	// } catch (err) {
	// }

	try {
		const itemsFromFile = xlsx.parse(`${__dirname}/SKU.xlsx`);

		for(let i = 1; i < itemsFromFile[0].data.length; i++) {
			let item = itemsFromFile[0].data[i];

			let newItem = {
				"code": item[0] || null,
				"frontmark": item[1] || null,
				"quantity": item[2] || null,
				"msrp": item[3] || null,
				"price": item[4] || null,
				"five_pack_price": item[5] || null,
				"platform": "jrcigars"
			};

			await db.collection('sku_list').insertOne(newItem);
		}
	} catch (err) {
		throw err;
	}
};