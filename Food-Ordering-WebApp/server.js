//using express
var express = require('express');
var app = express();
//using mongojs
var mongojs = require('mongojs');
var db = mongojs('hotspice', ['category', 'dish', 'orders']);
//using bodyparser
var bodyParser = require('body-parser');


//server should search static resource
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//GET
app.get('/hotspice/', function (req, res) {
  //Get the parameters from URL
	var collection = req.query.collection;
	var collectionName = req.query.collectionName;
	var sortParamOne = req.query.sortParamOne;
  var number = req.query.number;
  var orderStatus = req.query.status;
	
  //Based on the collection parameter, decide from which collection of mongodb, data has to be fetched
	switch(collection){
    //Get categories of the food
  	case 'category' :
  		db.category.find(function (err, docs) {
    		res.json(docs);
  		});
		break;

    //Get the actual dishes name
	  case 'dish' :
		  db.dish.find(function (err, docs) {
    		res.json(docs);
  	  });
  		break;

    //Sort the dishes as per the category selected in drop-down list
  	case 'findCat' :
  		if(sortParamOne !== null && sortParamOne !== undefined){
  			db.dish.find({categoryName : sortParamOne}).toArray(function (err, docs){
  				res.json(docs);
  			});
  		} else{
         db.dish.find(function (err, docs) {
          res.json(docs);
        });
  		}
  		break;

      //Get the dieshes name as per the input selected by the user, i.e alphabetically sorted etc.
      case 'sortCat' :
      if(sortParamOne !== null && sortParamOne !== undefined){
        if(sortParamOne == 'A-Z'){
          db.dish.find().sort({name : 1}).toArray(function (err, docs){
            res.json(docs);
          });
        } else if(sortParamOne == 'Z-A'){
          db.dish.find().sort({name : -1}).toArray(function (err, docs){
            res.json(docs);
          });
        }else if(sortParamOne == 'Price Low-High'){
          db.dish.find().sort({price : 1}).toArray(function (err, docs){
            res.json(docs);
          });
        }else{
          db.dish.find().sort({price : -1}).toArray(function (err, docs){
            res.json(docs);
          });
        }
      } else{
         db.dish.find(function (err, docs) {
          res.json(docs);
        });
      }
      break;

      //Get recent orders  of a particular customer
      case 'fetch' :
        db.orders.find({contact : number}).limit(5).toArray(function (err, docs){
            res.json(docs);
        });
      break;

     //Get all the orders placed till now
     case 'getOrders' :
        db.orders.find(function (err, docs){
            res.json(docs);
        });
      break;

      //Sort the orders based on the status
      case 'sortOrders' :
        if(orderStatus == 'All' || orderStatus == undefined){
          db.orders.find().toArray(function (err, docs){
            res.json(docs);
          });
        } else{
          db.orders.find({orderStatus : orderStatus}).toArray(function (err, docs){
            res.json(docs);
          });
        }
        
      break;
  	}
});

//Post
app.post('/hotspice/:collection', function (req, res) {
  //Get the parameters from URL
  var collection = req.params.collection;

    //Based on the collection parameter, decide from which collection of mongodb, data has to be fetched
    switch(collection){

      //Insert the categories of the food
      case 'category' :
      	db.category.insert(req.body, function(err, doc) {
    		   res.json(doc);
    	  });
    	break;

      //Inserte dishes name in respective categories
    	case 'dish' :
    		db.dish.insert(req.body, function(err, doc) {
        		res.json(doc);
      	});
      break;

      //Insert in orders collection if order is placed
      case 'orders' :
      	db.orders.insert(req.body, function(err, doc) {
        	res.json(doc);
      	});
      break;
    }
});


//PUT
app.put('/hotspice/', function (req, res){
  //Get the parameters from URL
  var collection =req.query.collection;
  var id = req.query.id;
  var status = req.query.status;
  console.log(status);

  //Based on the collection parameter, decide from which collection of mongodb, data has to be fetched
  switch(collection){
    //Update the status of the orders.
    case 'changeStatus' :
    console.log('aya na bawa')
      db.orders.findAndModify({query : {_id : mongojs.ObjectId(id)},
        update : {$set : {orderStatus : status}},
        new : true}, function(err, doc) {
          res.json(doc);
          console.log(res.toJson)
      });
    break;
  }
});

app.listen(3000);
console.log("server running on port 3000")