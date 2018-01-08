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

module.exports = function(brandNames) {
	return [
		{
			"$match" : {
				// "pl" : true,
				// "month" : true,
				// "year" : true,
				"name": {$ne: null, $exists: 1},
				"brand_name": {$in: brandNames}
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
				"categories_docs": { $first: "$categories_docs"}
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
				"code": concat("$codes", "/"),
				"shade": concat("$shades", "/"),
				"brand_name": "$_id.brand_name",
				
				
				"categories_docs": { $arrayElemAt: [ "$categories_docs", 0 ] }
			}
		},
		
		{
			"$project": {
				"name": "$name",
				"length": "$length",
				"ring": "$ring",
				"quantity": "$quantity",
				"msrp": "$quantity",
				"jr_price": "$jr_price",
				"code": "$code",
				"shade": "$shade",
				"brand_name": "$brand_name",
				"description": { $ifNull: [ "$categories_docs.description", "Unspecified" ] },
			}
		},
		
		{
			"$group": {
				"_id": "$brand_name",
				"items": { 
					$push: {
						"name": "$name",
						"length": "$length",
						"ring": "$ring",
						"quantity": "$quantity",
						"msrp": "$quantity",
						"jr_price": "$jr_price",
						"code": "$code",
						"shade": "$shade"
					} 
				},
				"description": { $first: "$description"}
			}
		},
		{
			"$project": {
				_id: 0,
				name: "$_id",
				description: 1,
				items:  1
			}
		}
	];
};