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

module.exports = function(brandNames, codes, platform, month, year) {
	return [
		{
			"$match" : {
				// "pl" : true,
				// "month" : true,
				// "year" : true,
				"name": {$ne: null, $exists: 1},
				"brand_name": {$in: brandNames},
				"code": /^(.(?!_1$))+$/
			}
		},
	
		{
			$lookup: {
				from: "categories",
				localField: "category.data",
				foreignField: "_id",
				as: "categories_docs"
			}
		},
		{
			"$match": {
				"code": {$in: codes}
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

					"brand_name": "$brand_name"
				},
				"codes": { $push: "$code" },
				"shades": { $push: { $substr: [ "$details.wrapper_shade", 0, 1 ] } },
				"categories_docs": { $first: "$categories_docs"},
				"future_prices": { $first: "$platform_prices"},
				"sale_price": {$first: "$sales"}
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
				// "jr_price": { $ifNull: [ "$_id.jr_price", -1 ] },
				"code": "$codes",
				"shade": "$shades",
				"brand_name": "$_id.brand_name",
				// "sale_price": { $ifNull: [ "$sale_price", "Unspecified" ] },
				
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
				
				"categories_docs": { $arrayElemAt: [ "$categories_docs", 0 ] },
				// "future_prices": {
				// 	"$filter": {
				// 		input: "$future_prices",
				// 		as: "info",
				// 		cond: { $and: [
				// 			{ $eq: [ "$$info.platform", platform ]},
				// 			{ $eq: [ { $month: "$$info.date"}, month ] },
				// 			{ $eq: [ { $year: "$$info.date"} , year] }
				// 		] }
				// 	}
				// },
			}
		},
	
		{
			"$project": {
				"name": "$name",
				"length": "$length",
				"ring": "$ring",
				"quantity": "$quantity",
				"msrp": "$msrp",
				"price": { $cond: { if: { $eq: [ "$quantity", 5 ] }, then: -1, else: "$price" }},
				"code": "$code",
				"shade": "$shade",
				"brand_name": "$brand_name",
				// "sale_price": 1,
				"description": { $ifNull: [ "$categories_docs.description", "Unspecified" ] },
				"five_pack_price": { $cond: { if: { $eq: [ "$quantity", 5 ] }, then: "$price", else: -1 }},
				// "future_prices": { $arrayElemAt: [ "$future_prices", 0 ] },
			}
		},
		
		{
			"$project": {
				"name": "$name",
				"length": "$length",
				"ring": "$ring",
				"quantity": "$quantity",
				"msrp": "$msrp",
				"price": {$ifNull: ["$price", -1]},
				"code": "$code",
				"shade": "$shade",
				"brand_name": "$brand_name",
				"description": "$description",
				// "sale_price": 1,
				"five_pack_price": {$ifNull: ["$five_pack_price", -1]},
				// "future_prices": { 
				// 	$ifNull: [ 
				// 		"$future_prices.price", 
				// 		{ $cond: { 
				// 			if: { $eq: ["$price", -1] }, 
				// 			then: "$five_pack_price", 
				// 			else: "$price" } 
				// 		} 
				// 	]
				// }
			}
		},
	
		{ $sort : { "name": 1, "quantity": 1, "length": 1 } },
		{
			"$group": {
				"_id": "$brand_name",
				"items": { 
					$push: {
						"name": "$name",
						"length": "$length",
						"ring": "$ring",
						"quantity": "$quantity",
						"msrp": "$msrp",
						"price": "$price",
						"code": "$code",
						"shade": "$shade",
						"five_pack_price": "$five_pack_price",
						// "sale_price": "$sale_price",
						// "future_price": "$future_prices",
						// "wholesale_price": { $ifNull: [ "$prices.wholesale_price", 0 ] },
						// "seriouscigars_price": { $ifNull: [ "$prices.seriouscigars_price", 0 ] },
						// "cigars_price": { $ifNull: [ "$prices.cigars_price", 0 ] },
					} 
				},
				"description": { $max: "$description"}
			}
		},
		{
			"$project": {
				_id: 0,
				name: "$_id",
				description: 1,
				items:  1
			}
		},
		{$sort: {"name": 1}},
	];
};