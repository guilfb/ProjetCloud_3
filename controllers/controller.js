const express = require('express')
const router = express.Router()
const fs = require('fs');
const moment = require('moment')

const User = require('../userModel')

router.get('/', (req, res) => {
    res.send('Welcome')
});

// CRUD GLOBAL
router.route('/user')
    .get((req, res) => {

        let skipUrl = req.query.page * 100;
        let limitUrl = 100;

        User.find({}, null, {
            skip: skipUrl,
            limit: limitUrl,
        }, (err, users) => {
            if (err) {
                console.log(' GET/ 400 Find Error.')
                return res.status(400).send({
                    status: 400,
                    success: false,
                    message: 'Error.',
                    data: err.toString()
                })
            }

            return res.status(200).send(users)
        });

    })
    .put((req, res) => {
        User.remove({}).then(() => {
            User.insertMany(req.body, (err, docs) => {
                if (err) {
                    return res.status(409).send({
                        status: 409,
                        success: false,
                        message: 'LastName or FirstName already exist.',
                        data: err.toString()
                    })
                }
                
                return res.status(201).send(req.body)
            })
        })
        
    })
    .post((req, res) => {
        let newUser = new User(req.body)
        newUser.save((err)  => {
            if (err) {
                return res.status(409).send({
                    status: 409,
                    success: false,
                    message: 'lastName or firstName already exist.',
                    data: err.toString()
                })
            }

            return res.status(201).send(newUser)
        })
    })
    .delete((req, res) => {
        User.remove({}, (err) => {
            if (err) {
                console.log("delete error")
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

router.route('/user/nearest', function() {})
    .get((req, res) => {

        let latitude = req.query.lat;
        let longitude = req.query.lon;

        User.find({
            location: {
                $near : {
                    $geometry: { type: "Point",  coordinates: [ longitude, latitude ] }
                }
             }
        }, (err, users) => {
            if (err) {
                console.log(' GET/ 400 Find Error.')
                return res.status(400).send({
                    status: 400,
                    success: false,
                    message: 'Error.',
                    data: err.toString()
                })
            }

            return res.status(200).send(users)
        });

    })

// CRUD SPECIFIC
router.route('/user/:id', function() {})
    .get((req, res) => {
        User.findOne({_id: req.params.id}, function(err, user) {
            if (err) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    message: 'Il y a une erreur : ',
                    data: err.toString(),
                })
            }

            User.find({ 'birthDay' : {$gt: moment("01/02/2001").format('L')} }, (err,users) => {
                    console.log("okok1")
                    console.log(users)
                    console.log("okok2")
                })

            return res.status(200).send(user);
        });
    })
    .put((req, res) => {
        User.findOneAndUpdate({_id: req.params.id}, req.body, (err)  => {
            if (err) {
                return res.status(409).send({
                    status: 409,
                    success: false,
                    message: 'lastName or firstName already exist.',
                    data: err.toString()
                })
            }

            return res.status(200).send(req.body)
        })
    })
    .delete((req, res) => {
        var idFromUrl = req.params.id;
        User.findOneAndRemove({_id: idFromUrl}, function(err, user) {
            if (err) {
                console.log(err.toString())
                return res.status(500).send({
                    status:500,
                    succes: false,
                    message: 'Il y a une erreur : ',
                    data: err.toString()
                })
            }

            return res.status(204).send(user);
        });
    })

module.exports = router