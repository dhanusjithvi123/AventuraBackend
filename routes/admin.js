const { Router} = require('express')

const express = require('express');

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const User = require('../models/user')

const router = Router()

const admincontroller = require('../controllers/admincontroller')

const categorycontroller =  require('../controllers/categorycontroller')

router.get('/categorylist',categorycontroller.categorylist)

router.post('/logout',admincontroller.logout)

router.post('/adminlogin',admincontroller.adminlogin)

router.post('/Categoryadding',categorycontroller.Categoryadding)

module.exports = router


