var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function(err, db){
    if(err){
        throw err;
    }
    console.log('Connected to MongoDB');

    var query = {};
    var projection = {};

    var cursor = db.collection('grades').find(query);
    cursor.skip(6);
    cursor.limit(2);
    cursor.sort({grade: 1});

    cursor.forEach(
        function(doc){
            console.log(doc);
        }
    );
});