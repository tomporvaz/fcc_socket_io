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
const passportSocketIo = require('passport.socketio');


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

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key:          'express.sid',
  secret:       process.env.SESSION_SECRET,
  store:        sessionStore
}, (success, fail) => {
  if(success){
    console.log("passportSocketIO success!")
  } else console.log("passortSocketIO failed :( ")
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
    console.log(`user ${socket.request.user.name} connected :) `);
    //emit user count
    io.emit('user', {name:  socket.request.user.name, currentUsers, connected: true});
    
    //disconnect user
    socket.on('disconnect', () => {
      console.log('A user has disconnected');
      --currentUsers;

      //emit user count
      io.emit('user',{name: socket.request.user.name, currentUsers, connected: false});  
    });

    socket.on('chat message', (message) => {
      console.log(message);
      io.emit('chat message', {name: socket.request.user.name, message});

    })

    
    
    
  });
  
   
  
  
  //end socket.io code
  
  
});
