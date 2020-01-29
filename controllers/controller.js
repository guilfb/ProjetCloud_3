const express = require('express')
const router = express.Router()
const moment = require('moment')
const User = require('../userModel')
const utils = require('./utils.js')
const utileBis = require('./utilsBis.js')

router.get('/', (req, res) => {
  res.send('Welcome')
})

router.route('/user/age', function () {})
  .get((req, res) => {
    if (req.query.gt) {
      if (req.query.gt < 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          message: 'Age négatif, veuillez entrer un age positif'
        })
      }

      const dateMoment = moment().subtract(req.query.gt, 'years').format('L')
      const skipUrl = req.query.page * 100
      const limitUrl = 100

      User.find({
        birthDay: {
          $lte: dateMoment
        }
      }, null, {
        skip: skipUrl,
        limit: limitUrl
      }, function (err, user) {
        if (err) {
          return res.status(404).send({
            status: 404,
            success: false,
            message: 'Il y a une erreur : ',
            data: err.toString()
          })
        }
        const finalusers = utileBis(user)
        return res.status(200).send(finalusers)
      })
    }

    if (req.query.eq) {
      if (req.query.eq < 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          message: 'Age négatif, veuillez entrer un age positif'
        })
      }

      const dateMoment = moment().subtract(req.query.eq, 'years').format('L')
      const dateFinMoment = moment().subtract((parseInt(req.query.eq, 10) + 1), 'years').format('L')
      const skipUrl = req.query.page * 100
      const limitUrl = 100

      User.find({
        birthDay: { $gt: dateFinMoment, $lt: dateMoment }
      }, null, {
        skip: skipUrl,
        limit: limitUrl
      }, function (err, user) {
        if (err) {
          return res.status(404).send({
            status: 404,
            success: false,
            message: 'Il y a une erreur : ',
            data: err.toString()
          })
        }
        console.log(user)
        const finalusers = utileBis(user)
        return res.status(200).send(finalusers)
      })
    }
  })

router.route('/user/search')
  .get((req, res) => {
    const termToSearch = req.query.term
    const skipUrl = req.query.page * 100
    const limitUrl = 100

    if (termToSearch) {
      User.find({
        $or: [
          { firstName: termToSearch },
          { lastName: termToSearch }
        ]
      }, null, {
        skip: skipUrl,
        limit: limitUrl
      }, function (err, user) {
        if (err) {
          return res.status(404).send({
            status: 404,
            success: false,
            message: 'Il y a une erreur : ',
            data: err.toString()
          })
        }
        const finalusers = utileBis(user)
        return res.status(200).send(finalusers)
      })
    } else {
      return res.status(404).send({
        status: 404,
        success: false,
        message: 'Error.',
        data: 'Pensez à saisir un terme à chercher.'
      })
    }
  })

router.route('/user/nearest')
  .get((req, res) => {
    const latToSearch = req.query.lat
    const lonToSearch = req.query.lon

    if (latToSearch && lonToSearch) {
      return res.status(200).send([])
    } else {
      return res.status(404).send({
        status: 404,
        success: false,
        message: 'Error.',
        data: 'Pensez à saisir un terme à chercher.'
      })
    }
  })

// CRUD GLOBAL
router.route('/user')
  .get((req, res) => {
    const termToSearch = req.query.term
    const skipUrl = req.query.page * 100
    const limitUrl = 100

    if (termToSearch) {
      User.find({
        $or: [
          { firstName: termToSearch },
          { lastName: termToSearch }
        ]
      }, null, {
        skip: skipUrl,
        limit: limitUrl
      }, function (err, user) {
        if (err) {
          return res.status(404).send({
            status: 404,
            success: false,
            message: 'Il y a une erreur : ',
            data: err.toString()
          })
        }
        const finalusers = utileBis(user)
        return res.status(200).send(finalusers)
      })
    } else {
      User.find({}, null, {
        skip: skipUrl,
        limit: limitUrl
      }, (err, users) => {
        if (err) {
          return res.status(400).send({
            status: 400,
            success: false,
            message: 'Error.',
            data: err.toString()
          })
        }

        const finalusers = utileBis(users)
        return res.status(200).send(finalusers)
      })
    }
  })
  .put((req, res) => {
    const users = utils(req.body)
    User.deleteMany({}).then(() => {
      User.insertMany(users, (err, docs) => {
        if (err) {
          return res.status(409).send({
            status: 409,
            success: false,
            message: 'LastName or FirstName already exist.',
            data: err.toString()
          })
        }

        return res.status(201).send(users)
      })
    })
  })
  .post((req, res) => {
    const user = utils([req.body])[0]
    const newUser = new User(user)
    newUser.save((err) => {
      if (err) {
        return res.status(409).send({
          status: 409,
          success: false,
          message: 'lastName or firstName already exist.',
          data: err.toString()
        })
      }
      const finalusers = utileBis([newUser])
      return res.status(201).send(finalusers[0])
    })
  })
  .delete((req, res) => {
    User.deleteMany({}, (err) => {
      if (err) {
        return res.status(400).send({
          status: 400,
          success: false,
          message: ' Delete error',
          data: err.toString()
        })
      }

      return res.status(200).send({})
    })
  })

// CRUD SPECIFIC
router.route('/user/:id', function () {})
  .get((req, res) => {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        return res.status(404).send({
          status: 404,
          success: false,
          message: 'Il y a une erreur : ',
          data: err.toString()
        })
      }
      const finaluser = utileBis([user])
      return res.status(200).send(finaluser[0])
    })
  })
  .put((req, res) => {
    let userGet = null
    if (req.body.birthDay) {
      userGet = utils(req.body)[0]
    } else {
      userGet = req.body
    }
    User.findOneAndUpdate({ _id: req.params.id }, userGet, (err) => {
      if (err) {
        return res.status(409).send({
          status: 409,
          success: false,
          message: 'lastName or firstName already exist.',
          data: err.toString()
        })
      }

      return res.status(200).send(userGet)
    })
  })
  .delete((req, res) => {
    var idFromUrl = req.params.id
    User.findOneAndRemove({ _id: idFromUrl }, function (err, user) {
      if (err) {
        return res.status(500).send({
          status: 500,
          succes: false,
          message: 'Il y a une erreur : ',
          data: err.toString()
        })
      }

      const finaluser = utileBis([user])[0]
      return res.status(200).send(finaluser[0])
    })
  })

module.exports = router
