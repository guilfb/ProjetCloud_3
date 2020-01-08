const express = require('express');
const app = express();
var bodyParser = require('body-parser');

const PORT = 8080;

const users = [
	{"username": "Gui","lastname": "Lefebvre","firstname": "Guillaume","age": 21},
	{"username": "Raph","lastname": "Marie-Nelly","firstname": "Raphael","age": 27}
]

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
	res.send(users)
	console.log(users)
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


