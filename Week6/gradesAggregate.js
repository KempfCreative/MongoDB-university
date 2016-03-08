db.grades.aggregate([
	{ $match: { "scores.type": {$ne: "quiz"}}},
	{ $project: { student_id: 1, _id: 0, class_id: 1, scores: 1}},
	{ $unwind:  "$student_id" },
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