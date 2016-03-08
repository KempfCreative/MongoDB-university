/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";
        var allItems = {_id:"All", num:0};
        this.db.collection('item').aggregate([
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
        ], function (err, result){
            assert.equal(null, err);
            if (!result) {
                console.log("No Document found!");
            }
            // create the All category with num
            for (var i=0; result.length > i; i++){
                allItems.num=allItems.num+result[i].num;
            }
            result.unshift(allItems);
            console.log("result unshifted", result);
            callback(result);
        });
    };


    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab1B
         *
         * LAB #1B:
         * Create a query to select only the items that should be displayed for a particular
         * page. For example, on the first page, only the first itemsPerPage should be displayed.
         * Use limit() and skip() and the method parameters: page and itemsPerPage to identify
         * the appropriate products. Pass these items to the callback function.
         *
         * Do NOT sort items.
         *
         */
        var self = this;

        console.log("CATEGORY: ", category);
        console.log("PAGE: ", page);
        console.log("ITEMS PER PAGE: ", itemsPerPage);

        this.getPageItems = function(){
            console.log("Inside getPageItems");
            var pageItems = [];
            if(category === "All"){
                var query = {};
            }else {
                var query = {"category":category};
            }
            var skip = page * itemsPerPage;

            var limit = itemsPerPage;

            var cursor = self.db.collection('item').find(query).skip(skip).limit(limit);
            cursor.forEach(
                function(doc){
                    pageItems.push(doc);
                },
                function(err){
                    assert.equal(err,null);
                    callback(pageItems);
                    // return self.db.close();
                }

            );
        };
        this.getPageItems();
        // TODO-lab1B Replace all code above (in this method).
    };


    this.getNumItems = function(category, callback) {
        "use strict";
        console.log(category);
        var numItems = 0;
        if(category === "All"){
            var query = {};
        }else {
            var query = {"category":category};
        }
        var cursor = this.db.collection('item').find(query);
        cursor.count(function(err, count){
            assert.equal(err, null);
            if(count){
                var numItems = count;
                console.log("NUMITEMS INSIDE: ", numItems);
                callback(numItems);
            }
        });
        /*
         * TODO-lab1C
         *
         * LAB #1C: Write a query that determines the number of items in a category and pass the
         * count to the callback function. The count is used in the mongomart application for
         * pagination. The category is passed as a parameter to this method.
         *
         * See the route handler for the root path (i.e. "/") for an example of a call to the
         * getNumItems() method.
         *
         */
    };


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";
        var self = this;
        var query = query;
        this.getSearchPageItems = function(){
            console.log("Inside getSearchPageItems");
            var searchPageItems = [];

            var skip = page * itemsPerPage;

            var limit = itemsPerPage;
            console.log("QUERY: ", query);
            var cursor = self.db.collection('item').find({$text:{$search:query}}).skip(skip).limit(limit);
            cursor.forEach(
                function(doc){
                    searchPageItems.push(doc);
                },
                function(err){
                    assert.equal(err,null);
                    callback(searchPageItems);
                }

            );
        };
        this.getSearchPageItems();

        /*
         * TODO-lab2A
         *
         * LAB #2A: Using the value of the query parameter passed to this method, perform
         * a text search against the item collection. Do not sort the results. Select only
         * the items that should be displayed for a particular page. For example, on the
         * first page, only the first itemsPerPage matching the query should be displayed.
         * Use limit() and skip() and the method parameters: page and itemsPerPage to
         * select the appropriate matching products. Pass these items to the callback
         * function.
         *
         * You will need to create a single text index on title, slogan, and description.
         *
         */

        // TODO-lab2A Replace all code above (in this method).
    }


    this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;

        var cursor = this.db.collection('item').find({$text:{$search:query}});
        cursor.count(function(err, count){
            assert.equal(err, null);
            if(count){
                var numItems = count;
                console.log("NUMITEMS INSIDE: ", numItems);
                callback(numItems);
            }
        });
        /*
        * TODO-lab2B
        *
        * LAB #2B: Using the value of the query parameter passed to this method, count the
        * number of items in the "item" collection matching a text search. Pass the count
        * to the callback function.
        *
        */
    }


    this.getItem = function(itemId, callback) {
        "use strict";

        var cursor = this.db.collection('item').find({_id: itemId}).limit(1);
        cursor.next(function(err, doc){
            assert.equal(null, err);
            callback(doc);
        });
        /*
         * TODO-lab3
         *
         * LAB #3: Query the "item" collection by _id and pass the matching item
         * to the callback function.
         *
         */

    }


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        var collection = this.db.collection('item');

        collection.updateOne(
            { _id: itemId },
            { "$push": {"reviews":reviewDoc}},
            function(err, doc){
                assert.equal(null, err);
                callback(doc);
            }
        )
        /*
         * TODO-lab4
         *
         * LAB #4: Add a review to an item document. Reviews are stored as an
         * array value for the key "reviews". Each review has the fields: "name", "comment",
         * "stars", and "date".
         *
         */
    };


    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;
