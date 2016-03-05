db.item.aggregate([
    { $project: { category: 1, _id: 1}},
    { $unwind: "$category"},
    { $group: {
         _id: "$category",
         num: {$addToSet: "$_id"}
    }},
    { $project: {
        _id: 1,
        num: {$size: "$num"}
    }},
    { $sort:
        {_id: 1}
    }
]);

// // returns
// { "_id" : "Apparel", "num" : 6 }
// { "_id" : "Books", "num" : 3 }
// { "_id" : "Electronics", "num" : 3 }
// { "_id" : "Kitchen", "num" : 3 }
// { "_id" : "Office", "num" : 2 }
// { "_id" : "Stickers", "num" : 2 }
// { "_id" : "Swag", "num" : 2 }
// { "_id" : "Umbrellas", "num" : 2 }