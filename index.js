const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const DB = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-startegy');
const port = process.env.PORT || 5000;


const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(
	session({secret: "CodeAhead", resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 100 },
	})
);

//extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use(express.urlencoded({ extended: true }));
//static file use
app.use(express.static('./assets'));

//Authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//Router
app.use('/', require('./routes'));

// listen on port
app.listen(port, function (error) {
	if (error) {
		console.log(`Error in connecting to server: ${error}`);
		return;
	}
	console.log(`Server running on port: ${port}`);
});