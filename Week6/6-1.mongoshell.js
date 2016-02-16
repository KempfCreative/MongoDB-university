db.crunchbase.aggregate([
	{ $match: { "relationships.person": {$ne: null}}},
	{ $project: { relationships: 1, _id: 0, name: 1}},
	{ $unwind:  "$relationships" },
	{ $group: 
		{
			_id: { 
				_id: "$relationships.person"
			},
			uniqueCompanies: {$addToSet: "$name"},
			count: {$sum: 1}
		} 
	},
	{ $match: {"_id._id.permalink": "eric-di-benedetto"}},
	{ $project: {
		_id:1,
		name: 1,
		uniqueCompanies: {$size: "$uniqueCompanies"}
	}},
	{ $sort: { count: 1 } }
])