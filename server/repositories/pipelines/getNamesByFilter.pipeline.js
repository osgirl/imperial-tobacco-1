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
				"brand_name": {$ne: null, $exists: 1},
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
				"platform_prices": {$first: "$platform_prices"}
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
				"brand_name": { $ifNull: [ "$_id.brand_name", "Unspecified" ] },
				"platform_prices": {
					"$filter": {
						input: "$platform_prices",
						as: "info",
						cond: { $and: [
							{ $eq: [ "$$info.platform", platform ]},
							{ $eq: [ { $month: "$$info.date"}, month ] },
							{ $eq: [ { $year: "$$info.date"} , year] }
						] }
					}
				},
			}
		},
		
		{
			"$project": {
				"_id": 0,
				"name": 1,
				"length": 1,
				"ring": 1,
				"quantity": 1,
				"msrp": 1,
				"jr_price": 1,
				"code": 1,
				"shade": 1,
				"brand_name": 1,
				"platform_prices": { $arrayElemAt: [ "$platform_prices", 0 ] }
			}
		},
		
		{
			"$project": {
				"_id": 0,
				"name": 1,
				"length": 1,
				"ring": 1,
				"quantity": 1,
				"msrp": 1,
				"jr_price": 1,
				"code": 1,
				"shade": 1,
				"brand_name": 1,
				"platform_price": { $ifNull: [ "$platform_prices.price", "$jr_price" ] }
			}
		},
		{ $sort : { "name": 1, "quantity": 1, "length": 1 } },
	];
};