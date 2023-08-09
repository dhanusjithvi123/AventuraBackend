const { Router} = require('express')

const express = require('express');

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const User = require('../models/user')

const router = Router()

const uploadImage =require("../config/cloudinary");

const organisaerscontroller = require('../controllers/organisaers')

const eventcontroller = require('../controllers/eventcontroller')

const bookingcontroller = require('../controllers/bookingcontroller')

router.get('/organisaerList',organisaerscontroller.organisaerList)

router.get('/eventlist/:organisaerId',eventcontroller.eventlist)

router.post('/organisaerregister',organisaerscontroller.register)

router.post('/organisaerlogin',organisaerscontroller.organisaerlogin)

router.post('/payrent',organisaerscontroller.rent)

router.post('/eventadding/:organisaerId',uploadImage,eventcontroller.eventadding)

router.put('/blocking/:organiserId', organisaerscontroller.blocking);

router.get('/editevent/:id',eventcontroller.editevent)

router.put('/updateEvent/:id',eventcontroller.updateevent)

router.put('/eventblocking/:id', eventcontroller.eventblocking);

router.get('/bookedlist/:organisaerId',bookingcontroller.bookedlist );

router.get('/dashbord/:organiserId',organisaerscontroller.dashBoardDataGet)


module.exports = router


