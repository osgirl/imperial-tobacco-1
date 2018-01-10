module.exports = [
	{
		"$project" : {
			"_id": 0,
			"platforms" : 1
		}
	},
	{
		"$unwind" : "$platforms"
	},
	{
		"$group" : {
			"_id" : "$platforms"
		}
	}
]