db.item.aggregate([
    { $match: {"category":{$ne:null}}},
    { $project: { category: 1, _id: 1}},
    { $unwind: "$category"},
    { $group: {
         _id: { name: "$category"},
         uniqueCategories: {$addToSet: "$num"},
         count: {$sum: 1}
    }},
    { $project: {
        _id: 1,
        num: 1,
        uniqueCategories: {$size: "$uniqueCategories"}
    }}
]);

// returns
// { "_id" : { "name" : "Electronics" }, "uniqueCategories" : 0 }
// { "_id" : { "name" : "Books" }, "uniqueCategories" : 0 }
// { "_id" : { "name" : "Apparel" }, "uniqueCategories" : 0 }
// { "_id" : { "name" : "Stickers" }, "uniqueCategories" : 0 }
// { "_id" : { "name" : "Swag" }, "uniqueCategories" : 0 }
// { "_id" : { "name" : "Office" }, "uniqueCategories" : 0 }
// { "_id" : { "name" : "Umbrellas" }, "uniqueCategories" : 0 }
// { "_id" : { "name" : "Kitchen" }, "uniqueCategories" : 0 }