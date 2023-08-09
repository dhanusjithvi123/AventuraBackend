
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import { verifyJwtToken } from './verifyTocken.js';
import User from "../models/user/userModel.js";
import Vendor from "../models/vendor/VendorModel.js";
import dotenv from "dotenv";
dotenv.config();

export const protect = asyncHandler(async (req, res, next ) => {
  let token

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      //  Get Token from header
      token = req.headers.authorization.split(' ')[1]
      console.log("chek token",token);
      
      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not AUthorized')
    }
  }

  if(!token) {
    res.status(401)
    throw new Error('Not Authorized, No Token')
  }
})

