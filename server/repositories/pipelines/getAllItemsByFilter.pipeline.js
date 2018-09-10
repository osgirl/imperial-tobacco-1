module.exports = function (platform) {
	return [
		{
			"$match": {
				// "pl" : true,
				// "month" : true,
				// "year" : true,
				"name": { $ne: null, $exists: 1 },
				"brand_name": { $ne: null, $exists: 1 },
				"code": /^(.(?!_1$))+$/
			}
		},

		{
			"$group": {
				"_id": {
					"name": "$name",
					"length": "$details.length",
					"ring": "$details.ring",
					"quantity": "$details.packaging_details.quantity",
					"msrp": "$prices.msrp",

					"five_pack_jr_price": "$prices.five_pack_jr_price",
					"five_pack_cigars_price": "$prices.five_pack_cigars_price",
					"five_pack_seriouscigars_price": "$prices.five_pack_seriouscigars_price",
					"five_pack_wholesale_price": "$prices.five_pack_wholesale_price",

					"brand_name": "$brand_name",
					"packaging_type": "$details.packaging_details.type",
					"category_name": "$category.name",
					"platforms": "$platforms",
					"active": "$display.active",
					"test": "$display.test",
					"live": "$display.live",
					"on_hand": "$quantity_on_hand",
					"cls": "$cls",
					"div": "$div"

				},
				"jr_price": { $first: "$prices.jr_price" },
				"cigars_price": { $first: "$prices.cigars_price" },
				"seriouscigars_price": { $first: "$prices.seriouscigars_price" },
				"wholesale_price": { $first: "$prices.wholesale_price" },

				"codes": { $push: "$code" },
				"shades": { $push: { $substr: ["$details.wrapper_shade", 0, 1] } },
				// "future_prices": {$first: "$platform_prices"},
				// "sale_price": {$first: "$sales"}
			}
		},
		{
			"$project": {
				"_id": 0,
				"name": { $cond: { if: { $eq: ["$_id.name", ""] }, then: null, else: "$_id.name" } },
				"length": { $ifNull: ["$_id.length", "Unspecified"] },
				"ring": { $ifNull: ["$_id.ring", "Unspecified"] },
				"quantity": { $cond: { if: { $eq: ["$_id.quantity", ""] }, then: null, else: "$_id.quantity" } },
				"msrp": { $ifNull: ["$_id.msrp", -1] },
				"code": "$codes",
				"shade": "$shades",
				"brand_name": { $ifNull: ["$_id.brand_name", "Unspecified"] },
				"packaging_type": { $cond: { if: { $eq: ["$_id.packaging_type", ""] }, then: null, else: "$_id.packaging_type" } },
				"category_name": { $cond: { if: { $eq: ["$_id.category_name", ""] }, then: null, else: "$_id.category_name" } },
				"platforms": "$_id.platforms",
				"active": "$_id.active",
				"test": "$_id.test",
				"live": "$_id.live",
				"on_hand": "$_id.on_hand",

				//"jr_price": "$jr_price",
				//"cigars_price": "$cigars_price",
				//"seriouscigars_price": "$seriouscigars_price",
				//"wholesale_price": "$wholesale_price",

				"price": {
					$switch: {
						branches: [
							{
								case: { $eq: [platform, "jrcigars"] },
								then: "$jr_price"
							},
							{
								case: { $eq: [platform, "cigars.com"] },
								then: "$cigars_price"
							},
							{
								case: { $eq: [platform, "serious cigars"] },
								then: "$seriouscigars_price"
							},
							{
								case: { $eq: [platform, "Santaclaracigars.com"] },
								then: "$wholesale_price"
							},
						],
					}
				},

				"five_pack_price": {
					$switch: {
						branches: [
							{
								case: { $eq: [platform, "jrcigars"] },
								then: "$_id.five_pack_jr_price"
							},
							{
								case: { $eq: [platform, "cigars.com"] },
								then: "$_id.five_pack_cigars_price"
							},
							{
								case: { $eq: [platform, "serious cigars"] },
								then: "$_id.five_pack_seriouscigars_price"
							},
							{
								case: { $eq: [platform, "Santaclaracigars.com"] },
								then: "$_id.five_pack_wholesale_price"
							},
						],
					}
				},
				"cls": "$_id.cls",
				"div": "$_id.div"
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
				"price": { $cond: { if: { $eq: ["$quantity", 5] }, then: -1, else: "$price" } },
				"code": 1,
				"shade": 1,
				"brand_name": 1,
				"five_pack_price": { $cond: { if: { $eq: ["$quantity", 5] }, then: "$price", else: "$five_pack_price" } },
				"packaging_type": 1,
				"category_name": 1,
				"platforms": 1,
				"active": 1,
				"test": 1,
				"live": 1,
				"on_hand": 1,
				"cls": 1,
				"div": 1
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
				"price": { $ifNull: ["$price", -1] },
				"code": 1,
				"shade": 1,
				"brand_name": 1,
				"five_pack_price": { $ifNull: ["$five_pack_price", -1] },
				"selected": { $literal: true },
				"packaging_type": 1,
				"category_name": 1,
				"platforms": 1,
				"active": 1,
				"test": 1,
				"live": 1,
				"on_hand": 1,
				"cls": 1,
				"div": 1
			}
		},
		{ $sort: { "name": 1, "quantity": 1, "length": 1 } },
	];
};