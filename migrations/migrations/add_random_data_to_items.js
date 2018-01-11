const pipeline = [
	{
		"$project" : {
			"_id": 1
		}
	}
];

module.exports.name = "add_random_data_to_items";

module.exports.up = async function (db) {
	try {
		let IDs = await db.collection('items').aggregate(pipeline).toArray();
		let data = getRandomData();
		
		for(let i = 0; i < IDs.length; i++) {
			await db.collection('items').updateOne({"_id": IDs[i]._id}, { $set: {platform_prices: data}});
		}
	} catch(err) {
		throw err;
	}
};

function getRandomData() {
	let platforms = ["jrcigars.com", "retail", "moto"];
	let randomData = [];
	let indexes = getRandomInts();
	let dates = getRandomDates(new Date(2017, 0, 1), new Date(2018, 0, 1));
	let prices = getRandomPrices();	
	

	for(let i = 0; i < 2; i++) {
		randomData.push({platform: platforms[indexes[i]], date: dates[i], price: prices[i]});
	}

	return randomData;
}

function getRandomInts() {
	let rand = () => Math.floor(Math.random() * (3 - 0)) + 0;

	let firstNumber = rand();
	let secondNumber;

	do {
		secondNumber = rand();
	} while(firstNumber == secondNumber);

	return [firstNumber, secondNumber];
}

function getRandomDates(start, end) {
	let rand = () => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

	let firstDate = rand();
	let secondDate;

	do {
		secondDate = rand();
	} while(firstDate == secondDate);

	return [firstDate, secondDate];
}

function getRandomPrices() {
	let firstPrice = (Math.random() * 100).toFixed(1);
	let secondPrice = (Math.random() * 100).toFixed(1);
	return [+firstPrice, +secondPrice];
}