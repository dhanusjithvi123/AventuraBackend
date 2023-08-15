const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const organisaerRoutes = require('./routes/organisaers');

const bodyParser = require('body-parser');
const organisaers = require('./models/organisaers');
const multer = require('multer');
const db= require('./config/connection')
db();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(cors({
  credentials: true,
  origin: ['https://aventuraevents.site/']
}));


app.use(cookieParser());
app.use(express.json());
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/organisaer", organisaerRoutes);


  
    app.listen(5000, () => {
      console.log("App is listening on port 5000");
    });
