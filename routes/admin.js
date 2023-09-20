const { Router} = require('express')

const express = require('express');

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const User = require('../models/user')

const router = Router()

const admincontroller = require('../controllers/admincontroller')

const categorycontroller =  require('../controllers/categorycontroller')

const chatContoller = require('../controllers/chatContoller.js');


router.get('/categorylist',categorycontroller.categorylist)

router.post('/logout',admincontroller.logout)

router.post('/adminlogin',admincontroller.adminlogin)

router.post('/Categoryadding',categorycontroller.Categoryadding)

router.post('/createNewChatRoom',chatContoller.createNewChatRoom);

router.post('/storeMessages', chatContoller.storeMessages);

router.get('/getAllMessages/:sender_id/:receiver_id', chatContoller.getChatMessages);

module.exports = router


