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
				"code": /^(.(?!_1$))+$/
			}
		},
	
		{
			"$group" : {
				"_id": { 
					"name": "$name", 
					"length": "$details.length", 
					"ring": "$details.ring", 
					"quantity": "$details.packaging_details.quantity", 
					"msrp": "$prices.msrp", 
					"jr_price": "$prices.jr_price",
					"cigars_price": "$prices.cigars_price",
					"seriouscigars_price": "$prices.seriouscigars_price",
					"wholesale_price": "$prices.wholesale_price",

					"five_pack_jr_price": "$prices.five_pack_jr_price",
					"five_pack_cigars_price": "$prices.five_pack_cigars_price",
					"five_pack_seriouscigars_price": "$prices.five_pack_seriouscigars_price",
					"five_pack_wholesale_price": "$prices.five_pack_wholesale_price",
					
					"brand_name": "$brand_name"
				},
				"codes": { $push: "$code" },
				"shades": { $push: { $substr: [ "$details.wrapper_shade", 0, 1 ] } },
				// "future_prices": {$first: "$platform_prices"},
				// "sale_price": {$first: "$sales"}
			}
		},
		{
			"$project": {
				"_id": 0,
				"name": { $ifNull: [ "$_id.name", "Unspecified" ] },
				"length": { $ifNull: [ "$_id.length", "Unspecified" ] },
				"ring": { $ifNull: [ "$_id.ring", "Unspecified" ] },
				"quantity": { $ifNull: [ "$_id.quantity", "Unspecified" ] },
				"msrp": { $ifNull: [ "$_id.msrp", -1 ] },
				"code": "$codes",
				"shade": "$shades",
				"brand_name": { $ifNull: [ "$_id.brand_name", "Unspecified" ] },
				
				//"jr_price": "$_id.jr_price",
				//"cigars_price": "$_id.cigars_price",
				//"seriouscigars_price": "$_id.seriouscigars_price",
				//"wholesale_price": "$_id.wholesale_price",
				
				"price" : {
					$switch: {
						branches: [
							{
								case: { $eq : [ platform, "jrcigars" ] },
								then: "$_id.jr_price"
							},
							{
								case: { $eq : [ platform, "cigars.com" ] },
								then: "$_id.cigars_price"
							},
							{
								case: { $eq : [ platform, "serious cigars" ] },
								then: "$_id.seriouscigars_price"
							},
							{
								case: { $eq : [ platform, "Santaclaracigars.com" ] },
								then: "$_id.wholesale_price"
							},
						],
					}
				},

				"five_pack_price" : {
					$switch: {
						branches: [
							{
								case: { $eq : [ platform, "jrcigars" ] },
								then: "$_id.five_pack_jr_price"
							},
							{
								case: { $eq : [ platform, "cigars.com" ] },
								then: "$_id.five_pack_cigars_price"
							},
							{
								case: { $eq : [ platform, "serious cigars" ] },
								then: "$_id.five_pack_seriouscigars_price"
							},
							{
								case: { $eq : [ platform, "Santaclaracigars.com" ] },
								then: "$_id.five_pack_wholesale_price"
							},
						],
					}
				}
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
				"price": { $cond: { if: { $eq: [ "$quantity", 5 ] }, then: -1, else: "$price" }},
				"code": 1,
				"shade": 1,
				"brand_name": 1,
				"five_pack_price": { $cond: { if: { $eq: [ "$quantity", 5 ] }, then: "$price", else: "$five_pack_price" }},
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
				"price": {$ifNull: ["$price", -1]},
				"code": 1,
				"shade": 1,
				"brand_name": 1,
				"five_pack_price": {$ifNull: ["$five_pack_price", -1]},
				"selected": { $literal: true },
			}
		},
		{ $sort : { "name": 1, "quantity": 1, "length": 1 } },
	];
};