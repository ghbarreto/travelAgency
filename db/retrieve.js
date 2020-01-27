var mongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://myuser:pass123@cluster0-eqb6n.mongodb.net/test?retryWrites=true&w=majority";

function getContacts(request, response) {

  mongoClient.connect(url, { useNewUrlParser: true },  function(err, db) {
      if (err) throw err;     
      var dbo = db.db("test");
      var query = {} ;
  
      var collection = dbo.collection("contacts");  
      collection.find(query, {projection: {_id:1, name:1,email:1,subject:1}}).limit(10).toArray((err, result) => {
        if (err) throw err;
        response.send(JSON.stringify(result));
        console.log(result);
        
        db.close();
      });
  });
}

function getOrders(request, response) {

  mongoClient.connect(url, { useNewUrlParser: true },  function(err, db) {
      if (err) throw err;     
      var dbo = db.db("test");
      var query = {} ;
  
      var collection = dbo.collection("purchases");  
      collection.find(query, {projection: {_id:1, location:1,email:1,price:1}}).limit(10).toArray((err, result) => {
        if (err) throw err;
        response.send(JSON.stringify(result));
        console.log(result);
        
        db.close();
      });
  });
  
}

function getAccounts(request, response) {

  mongoClient.connect(url, { useNewUrlParser: true },  function(err, db) {
      if (err) throw err;     
      var dbo = db.db("test");
      var query = {} ;
  
      var collection = dbo.collection("users");  
      collection.find(query, {projection: {_id:1, isAdmin:1,name:1,email:1,date:1}}).limit(10).toArray((err, result) => {
        if (err) throw err;
        response.send(JSON.stringify(result));
        console.log(result);
        
        db.close();
      });
  });
  
}
exports.getContacts = getContacts;
exports.getOrders = getOrders;
exports.getAccounts = getAccounts;