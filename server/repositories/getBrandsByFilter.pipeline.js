module.exports = function(platform, month, year) {
    return [
        {
            "$project" : {
                "_id": 0,
                "name" : 1,
                "pl": { $in: [ platform, "$platforms" ] },
                "month": { $eq: [ {$month: "$dates.modified"}, month ] },
                "year": { $eq: [ {$year: "$dates.modified"}, year ] }
            }
        },
        {
            "$match" : {
                "pl" : true,
                "month" : true,
                "year" : true,
                "name": {$exists: true}
            }
        },
        {
            "$project" : {
                "_id": 0,
                "name" : 1
            }
        }
    ]
}