module.exports = function(platform, month, year) {
	return [
		{
			"$project" : {
				"_id": 1,
				"name" : 1,
				"brand_name": 1,
				"check_name" : { $and: [
							{$ne: ["$name", null]}, 
							{$ne: ["$name", ""]}
				] },
				"check_brand" : { $and: [
							{$ne: ["$brand_name", null]}, 
							{$ne: ["$brand_name", ""]}
				] },
				"pl": { $in: [ platform, "$platforms" ] },
				"month": { $eq: [ {$month: "$dates.modified"}, month ] },
				"year": { $eq: [ {$year: "$dates.modified"}, year ] },
				
				"code": { $ifNull: [ "$code", "Unspecified" ] },
				"details.wrapper_shade": { $ifNull: [ "$details.wrapper_shade", "Unspecified" ] },
				"details.length": { $ifNull: [ "$details.length", "Unspecified" ] },
				"details.ring": { $ifNull: [ "$details.ring", "Unspecified" ] },
				"details.packaging_details.quantity": { $ifNull: [ "$details.packaging_details.quantity", "Unspecified" ] },
				"prices.msrp": { $ifNull: [ "$prices.msrp", "Unspecified" ] },
				"prices.jr_price": { $ifNull: [ "$prices.jr_price", "Unspecified" ] }
			}
		},
		{
			"$match" : {
				"pl" : true,
				"month" : true,
				"year" : true,
				"check_name": true,
				"check_brand": true
			}
		},
		{
			"$project" : {
				"_id": 0,
				"name" : 1,
				"brand_name": 1,
				"code": 1,
				"details.wrapper_shade": 1,
				"details.length": 1,
				"details.ring": 1,
				"details.packaging_details.quantity": 1,
				"prices.msrp": 1,
				"prices.jr_price": 1
			}
		}
	]
}