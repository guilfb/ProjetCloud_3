const express = require('express');
let mongoose = require('mongoose');
var bodyParser = require('body-parser');

var urldev = 'mongodb://ukkig3mswvf53dj5fgpu:LmD0HD9agInQX19mdMDo@b4k6cnacznjiujv-mongodb.services.clever-cloud.com:27017/b4k6cnacznjiujv'
var urlprod = 'mongodb://upzbyeqmkvcoeyg3yqnf:iJnxlOjDRjA8m7vOZOX5@bhirs6eketqjm8b-mongodb.services.clever-cloud.com:27017/bhirs6eketqjm8b'
const PORT = 8080;

let app = express();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb', extended: true }))

// Connection to MongoDB
mongoose.connect(urldev)

// Call controller
const controller = require('./controllers/controller')
app.use('/', controller)

app.listen(PORT, function() {
	console.log(`Listening on ${PORT}`);
});



