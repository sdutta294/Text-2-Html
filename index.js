const express = require("express");
const showdown  = require('showdown');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jwt-simple');
const LocalStrategy = require('passport-local').Strategy;
 
    
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
converter = new showdown.Converter();
 
const ADMIN = 'admin';
const ADMIN_PASSWORD = 'smagazine';
const SECRET = 'secret#4456';
 
passport.use(new LocalStrategy(function(username, password, done) {
  if (username === ADMIN && password === ADMIN_PASSWORD) {
    done(null, jwt.encode({ username }, SECRET));
    return;
  }
  done(null, false);
}));
 
app.get('/', function(req, res){
    res.send('Hello World!');
});
 
 
app.post('/login', passport.authenticate('local',{ session: false }),
                function(req, res) {
                // If this function gets called, authentication was successful.
                // Send a 'Authenticated' string back.
                res.send("Authenticated");
  });
  
 
app.post("/convert", 
         passport.authenticate('local',{ session: false, failWithError: true }), 
         function(req, res, next) {
        // If this function gets called, authentication was successful.
        // Also check if no content is sent
        if(typeof req.body.content == 'undefined' || req.body.content == null) {
            res.json(["error", "No data found"]);
        } else {
            text = req.body.content;
            html = converter.makeHtml(text);
            res.json(["markdown", html]);
        }}, 
        // Return a 'Unauthorized' message back if authentication failed.
        function(err, req, res, next) {
            return res.status(401).send({ success: false, message: err })
        });
 
        
 
app.listen(3000, function() {
 console.log("Server running on port 3000");
});
