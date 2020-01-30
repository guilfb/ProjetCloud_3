const express = require('express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
const controller = require('./controllers/controller')
const fs = require('fs')
const User = require('./userModel')
require('dotenv').config()

console.log('Using mongo base', process.env.MONGO)

// const PORT = 8080
const PORT = `${process.env.PORT || 8080}`

const app = express()
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb', extended: true }))

// Connection to MongoDB
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

// Call controller
app.use('/', controller)

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`)
})

// Delete al and fill the database
var jsondata = JSON.parse(fs.readFileSync('./test/data/2000users.json', 'utf8'))
User.deleteMany({}).then(() => {
  User.insertMany(jsondata, (err, docs) => {
    if (err) {
      console.log('Error when filling the database')
    }
    console.log('Database filled')
  })
})
