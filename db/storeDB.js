var mongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://ghbarreto:mongodb123@cluster0-ewxwt.mongodb.net/test?retryWrites=true&w=majority";

function getData(request, response) {

  mongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    
    var dbo = db.db("test");
    var query = {} ;
    
    var collection = dbo.collection("stores");
    
    collection.find(query, {projection: {_id:0,location:1}}).limit(50).toArray((err, result) => {
      if (err) throw err;
     
      var mydata = [];
      for (let i = 0 ; i < result.length; i++) {
          mydata = mydata.concat(result[i].location);
      }
      mydata = Array.from(new Set(mydata));
      console.log(mydata);
      response.send(JSON.stringify(mydata));
      db.close();
    });
  });
}

function getMovies(request, response) {

  mongoClient.connect(url, { useNewUrlParser: true },  function(err, db) {
    if (err) throw err;
    
    var dbo = db.db("test");
    var query = {location: {$in: JSON.parse(request.body.dbox)}} ;
    console.log("data: " + request.body.dbox);
    var collection = dbo.collection("stores");
    
    collection.find(query, {projection: {_id:1, location:1,img:1,price:1}}).limit(50).toArray((err, result) => {
      if (err) throw err;
      //console.log(result);
      response.send(JSON.stringify(result));
      console.log(result);
      
      db.close();
    });
  });
}

exports.getData = getData ;
exports.getMovies= getMovies ;