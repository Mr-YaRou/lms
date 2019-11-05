/**
 * Importing dependant modules 
 */
const express = require('express')
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const router = require('./routes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/'));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(router);


/**
 * Console Output
 */
var server = app.listen(3000, function () {

	var port = server.address().port;

	console.log("Server Running on Port: %s", port);
});