'use strict';

const express     = require('express');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const auth        = require('./app/auth.js');
const routes      = require('./app/routes.js');
const mongo       = require('mongodb').MongoClient;
const passport    = require('passport');
const cookieParser= require('cookie-parser')
const app         = express();
const http        = require('http').Server(app);
const io = require('socket.io')(http);
const sessionStore= new session.MemoryStore();
const cors = require('cors');
app.use(cors());


fccTesting(app); //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));


mongo.connect(process.env.DATABASE, (err, db) => {
  if(err) console.log('Database error: ' + err);
  
  auth(app, db);
  routes(app, db);
  
  http.listen(process.env.PORT || 3000);
  
  let currentUsers = 0;

  //start socket.io code  
  io.on('connection', socket => {
    console.log('A user has connected');
    ++currentUsers;



    //disconnect user
    socket.on('disconnect', () => {
      console.log('A user has disconnected');
      --currentUsers;
    });

    //emit user count
    io.emit('user count', currentUsers);

    //emit user count
    //io.emit('bye bye user', currentUsers);

  });

  

  
  
  
  
  //end socket.io code
  
  
});
