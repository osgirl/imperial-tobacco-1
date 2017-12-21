module.exports = function(platform, month) {
    return [
        {
            "$project" : {
                "_id": 0,
                "name" : 1,
                "pl": { $in: [ platform, "$platforms" ] },
                "month": { $eq: [ {$month: "$dates.modified"}, +month ] }
            }
        },
        {
            "$match" : {
                "pl" : true,
                "month" : true,
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