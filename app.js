require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require('express-fileupload');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded( { extended: true } ));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static('public'));
app.use(expressLayouts);
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecure',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());



app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/recipeRoutes.js')
app.use('/', routes);


app.listen(port, () => console.log(`Server started at: http://127.0.0.1:${port}`))



