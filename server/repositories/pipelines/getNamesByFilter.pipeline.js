function concat(field, delimiter) {
	return {
		$substr: [{
			"$reduce": {
				"input"       : field,
				"initialValue": "",
				"in"          : {"$concat": ["$$value", delimiter, "$$this"]}
			}
		}, 1, -1]
	};
}

module.exports = function(platform, month, year) {
	return [
		{
			"$match" : {
				// "pl" : true,
				// "month" : true,
				// "year" : true,
				"name": {$ne: null, $exists: 1},
				"brand_name": {$ne: null, $exists: 1}
			}
		},
		{
			"$group" : {
				"_id": { 
					name: "$name", 
					length: "$details.length", 
					ring: "$details.ring", 
					quantity: "$details.packaging_details.quantity", 
					msrp: "$prices.msrp", 
					jr_price: "$prices.jr_price",
					brand_name: "$brand_name"
				},
				"codes": { $push: "$code" },
				"shades": { $push: "$details.wrapper_shade" },
			}
		},
		{
			"$project": {
				"_id": 0,
				"name": { $ifNull: [ "$_id.name", "Unspecified" ] },
				"length": { $ifNull: [ "$_id.length", "Unspecified" ] },
				"ring": { $ifNull: [ "$_id.ring", "Unspecified" ] },
				"quantity": { $ifNull: [ "$_id.quantity", "Unspecified" ] },
				"msrp": { $ifNull: [ "$_id.msrp", "Unspecified" ] },
				"jr_price": { $ifNull: [ "$_id.jr_price", "Unspecified" ] },
				"code": concat("$codes", "/ "),
				"shade": concat("$shades", "/ "),
				"brand_name": { $ifNull: [ "$_id.brand_name", "Unspecified" ] }
				
			}
		},
		{ $sort : { "name": 1, "quantity": 1, "length": 1 } },
	];
};