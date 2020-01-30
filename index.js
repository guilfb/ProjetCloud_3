const express = require('express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
const controller = require('./controllers/controller')

// require('dotenv').config({ path: require('find-config')('.env') })

// var urldev = 'mongodb://ukkig3mswvf53dj5fgpu:LmD0HD9agInQX19mdMDo@b4k6cnacznjiujv-mongodb.services.clever-cloud.com:27017/b4k6cnacznjiujv'
// var urlprod = 'mongodb://upzbyeqmkvcoeyg3yqnf:iJnxlOjDRjA8m7vOZOX5@bhirs6eketqjm8b-mongodb.services.clever-cloud.com:27017/bhirs6eketqjm8b'

let url
const env = process.env.environnement || 'dev'

if (env === 'dev') {
  url = 'mongodb://ukkig3mswvf53dj5fgpu:LmD0HD9agInQX19mdMDo@b4k6cnacznjiujv-mongodb.services.clever-cloud.com:27017/b4k6cnacznjiujv'
} else {
  url = 'mongodb://upzbyeqmkvcoeyg3yqnf:iJnxlOjDRjA8m7vOZOX5@bhirs6eketqjm8b-mongodb.services.clever-cloud.com:27017/bhirs6eketqjm8b'
}

console.log(env)

// const PORT = 8080
const PORT = `${process.env.PORT || 8080}`

const app = express()
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb', extended: true }))

// Connection to MongoDB
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

// Call controller
app.use('/', controller)

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`)
})
