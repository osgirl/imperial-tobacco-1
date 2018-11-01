module.exports = function (platform, month, year) {
	return [
		{
			"$match": {
				"brand_name": {$ne: null, $ne: "", $exists: 1},
				// "pl" : true,
				// "month" : true,
				// "year" : true,
			}
		},
		{
			$project: {
				name: 1,
				brand_name: 1,
				category: 1
			}
		},
		{

			"$group": {
				"_id": "$brand_name",
				"category": {$first: '$category.data'}
			}
		},
		{
			$lookup: {
				from: "categories",
				localField: "category",
				foreignField: "_id",
				as: "categories_docs"
			}
		},

		{
			"$project": {
				"name": "$_id",
				"categories_docs": {$arrayElemAt: ["$categories_docs", 0]}
			}
		},
		{
			"$project": {
				_id: 0,
				"name": 1,
				"description": {$ifNull: ["$categories_docs.description", "Unspecified"]},
				"selected": {$literal: false},
			}
		},
		{ "$sort": { name: 1 } },
	];
};