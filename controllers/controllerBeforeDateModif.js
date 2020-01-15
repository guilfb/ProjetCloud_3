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

router.route('/test', function() {})
    .get((req, res) => {
        let dateMoment = moment().subtract(req.query.gt,'years')

        User.aggregate([{
                $project:{
                    _id: 0,
                    id: '$_id',
                    firstName: 1,
                    lastName: 1,
                    position: 1,
                    birthDay: 1,
                    birthDayFormatted: {
                        $dateFromString: {
                            dateString: '$birthDay',
                            format: '%m/%d/%Y'
                        },
                    },
                }
            },{
                $match:{
                    birthDayFormatted: {
                        $lte: new Date(dateMoment)
                    }
                }
            },{
                $project: { birthDayFormatted: 0 }
            }
          ], function(err,user) {
            if (err) {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    message: 'Il y a une erreur : ',
                    data: err.toString(),
                })
            }

            return res.status(200).send(user);
        });
    });
/*
        User.find({
            $where: function() {
                let dateStringTab = this.birthDay.split("/")
                let dateString = dateStringTab[2] + "/" + (dateStringTab[1]-1) + "/" + dateStringTab[0]

                var today = new Date();
                var birthDate = new Date(dateString);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                return parseInt(age,10) == 17 //parseInt(ageFromUrl,10);
                //return parseInt(age,10) == 17;
            }}, null, function(err,user) {
                if (err) {
                    return res.status(404).send({
                        status: 404,
                        success: false,
                        message: 'Il y a une erreur : ',
                        data: err.toString(),
                    })
                }

                return res.status(200).send(user);
            });
        });
*/

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