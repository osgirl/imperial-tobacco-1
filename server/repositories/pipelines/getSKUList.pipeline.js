module.exports = function(platform) {
	return [
		{
			"$match" : {
				"platform": platform
			}
		},
		{
			"$project": {
				"_id": 0
			}
		}
	];
};