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
					name: "$name", 
					length: "$details.length", 
					ring: "$details.ring", 
					quantity: "$details.packaging_details.quantity", 
					msrp: "$prices.msrp", 
					jr_price: "$prices.jr_price",
					cigars_price: "$prices.cigars_price",
					seriouscigars_price: "$prices.seriouscigars_price",
					wholesale_price: "$prices.wholesale_price",
					
					brand_name: "$brand_name"
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
	//                     default: "No scores found."
					}
				}
					
	//             "sale_price": { $ifNull: [ "$sale_price", "Unspecified" ] },
	//             "future_prices": {
	//                 "$filter": {
	//                     input: "$future_prices",
	//                     as: "info",
	//                     cond: { $and: [
	//                         { $eq: [ "$$info.platform", platform ]},
	//                         { $eq: [ { $month: "$$info.date"}, month ] },
	//                         { $eq: [ { $year: "$$info.date"} , year] }
	//                     ] }
	//                 }
	//             },
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
	//             "sale_price": 1,
				"five_pack_price": { $cond: { if: { $eq: [ "$quantity", 5 ] }, then: "$price", else: -1 }},
	//             "future_prices": { $arrayElemAt: [ "$future_prices", 0 ] }
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
	//             "sale_price": 1,
				"five_pack_price": {$ifNull: ["$five_pack_price", -1]},
	//             "future_price": { 
	//                 $ifNull: [ 
	//                     "$future_prices.price", 
	//                     { $cond: { 
	//                         if: { $eq: ["$jr_price", -1] }, 
	//                         then: "$five_pack_price", 
	//                         else: "$jr_price" } 
	//                     } 
	//                 ]
	//             },
			}
		},
		{ $sort : { "name": 1, "quantity": 1, "length": 1 } },
	];
};