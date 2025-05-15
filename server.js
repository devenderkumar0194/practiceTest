const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRoute');
const webRouter = require('./routes/webRoute');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const path = require('path');

require('dotenv').config();
const portNumber = process.env.PORT || 3000;
require('./db');


app.set('view engine', 'ejs');


app.use(cors());
app.use(cookieParser());

app.use(session({
    secret: 'dsgdfhsgdhwerewrethtrgawe',
    resave: false,
    saveUninitialized: true,
  }));
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/uploads', express.static('public/uploads'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static('public'));

app.use('/',webRouter);
app.use('/api', apiRouter);

app.use((req, res)=>{
    res.send("404 route not found!"); 
});

app.listen(portNumber, function(){
    console.log("server is running at port: "+portNumber);
});