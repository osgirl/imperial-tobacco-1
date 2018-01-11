const pipeline = [
	{
		"$project" : {
			"_id": 1
		}
	}
];

module.exports.name = "add_random_data_to_items_v2";

module.exports.up = async function (db) {
	try {
		let IDs = await db.collection('items').aggregate(pipeline).toArray();
		
		for(let i = 0; i < IDs.length; i++) {
			let data = getRandomData();
			await db.collection('items').updateOne({"_id": IDs[i]._id}, { $set: {platform_prices: data}});
		}
	} catch(err) {
		throw err;
	}
};

function getRandomData() {
	let platforms = ["jrcigars.com", "retail", "moto"];
	let randomData = [];	

	for(let i = 0; i < 10; i++) {
		let platform = platforms[getRandomInts()];
		let date = getRandomDates(new Date(2017, 0, 1), new Date(2018, 0, 1), randomData, platform);
		let price = getRandomPrices();

		randomData.push({platform: platform, date: date, price: +price});
	}

	return randomData;
}

function getRandomInts() {
	return Math.floor(Math.random() * (3 - 0)) + 0;
}

function getRandomDates(start, end, randomData, currentPlatform) {
	let rand = () => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	
	let randomValue = rand();

	let found = true;
	while(found) {
		let f = randomData.find((x) => x.platform == currentPlatform && x.date.getMonth() == randomValue.getMonth());

		if(f) {
			randomValue = rand();
		} else {
			found = false;
		}
	}

	return randomValue;
}

function getRandomPrices() {
	return (Math.random() * 100).toFixed(1);
}