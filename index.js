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


app.use((req, res, next) => {                      
  res.setHeader('Access-Control-Allow-Origin', "https://aventuraevents.netlify.app");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Enable credentials

  next();
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
      credentials: true,
      origin:"https://aventuraevents.netlify.app"
  }
});


app.use(cors({
  credentials: true,
  origin: "https://aventuraevents.netlify.app",
  methods: ["GET,HEAD,OPTIONS,POST,PUT"]
}))


// app.options('*',cors())
app.use(cookieParser());
app.use(express.json());
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/organisaer", organisaerRoutes);

  
    app.listen(5000, () => {
      console.log("App is listening on port 5000");
    });