module.exports = function(platform, month, year) {
	return [
		{
			"$project" : {
				"_id": 0,
				"check" : { $and: [
							{$ne: ["$brand_name", null]}, 
							{$ne: ["$brand_name", ""]}
				] },
				"pl": { $in: [ platform, "$platforms" ] },
				"month": { $eq: [ {$month: "$dates.modified"}, month ] },
				"year": { $eq: [ {$year: "$dates.modified"}, year ] },
				"brand_name": 1,
				"category.data": 1
			}
		},
		{
			"$match" : {
				"pl" : true,
				"month" : true,
				"year" : true,
				"check": true
			}
		},
		{
		   "$lookup":{
				from: "categories",
				localField: "category.data",
				foreignField: "_id",
				as: "categories_docs"
			}
		},
		{
			"$project" : {
				"_id": 0,
				"brand_name": 1,
				"categories_docs": { $arrayElemAt: [ "$categories_docs", 0 ] }
			}
		},
		{
			"$project": {
				"brand_name": 1,
				"categories_docs.description": { $ifNull: [ "$categories_docs.description", "Unspecified" ] }
			}
		},
		{
			"$group": {
				"_id": "$brand_name",
				"description": { $first: "$categories_docs.description" }
			}
		}
		
	]
}