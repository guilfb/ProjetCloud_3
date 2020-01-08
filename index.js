const express = require('express');
const app = express();

const PORT = 8080;


app.get("/", (req, res) => {
	res.send("Bienvenue sur le groupe 3\n")
}); 

app.listen(PORT, function() {
	console.log(`Listening on ${PORT}`);
});

/*
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://upzbyeqmkvcoeyg3yqnf:iJnxlOjDRjA8m7vOZOX5@bhirs6eketqjm8b-mongodb.services.clever-cloud.com:27017/bhirs6eketqjm8b'

app.get("/", (req, res) => {
 MongoClient.connect(url, function(err, db) {
 	if(err) {
 		res.send("Failed Connection \n");
 		console.log(err)
 	} else {
 		res.send("Connected \n");
 		db.close()	
 	}
    
}); 
});
*/


