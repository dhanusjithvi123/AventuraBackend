const { Router} = require('express')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const User = require('../models/user')

const Admin = require('../models/admin')

const router = Router()

const controller = require('../controllers/usercontrollers')

const eventcontroller = require('../controllers/eventcontroller')

const paymentcontroller = require('../controllers/bookingcontroller')

const organisaerscontroller = require('../controllers/organisaers')

const bookingcontroller = require('../controllers/bookingcontroller')


// import { isAuthenticated } from "../../Middleware/middleware.js";


router.get('/user',controller.user)

router.get('/users',controller.usersList)

router.get('/edituser/:id',controller.edituser)

router.get('/usereventlist',eventcontroller.usereventlist)

router.get('/booking/:id',controller.booking)

router.get('/userbookedevent/:userId',bookingcontroller.userbookedlist)

router.get('/userorganisaerList',organisaerscontroller.userorganisaerList)

router.get('/checkBookingStatus/:eventId',bookingcontroller.checkBookingStatus) 

router.get('/editprofile/:id', controller.edituser);

router.put('/blocking/:userId', controller.blocking);

router.put('/updateprofile/:id', controller.updateUser);

router.put('/cancelBooking/:bookingId',bookingcontroller.cancelBookingStatus);

router.delete('/deleteUser/:id',controller.deleteUser)

router.post('/otpverify',controller.verifyUser)

router.post('/paymetcomformsend',paymentcontroller.paymetcomformsend)

router.post('/submit_booking',paymentcontroller.submit_booking)

router.post('/register',controller.register)

router.post('/logout',controller.logout)

router.post('/login',controller.login)

router.post('/emailentering',controller.emailentering)

router.put('/newpassword/:id', controller.newpassword);

router.post('/forgotPasswordForm',controller.login)




module.exports = router