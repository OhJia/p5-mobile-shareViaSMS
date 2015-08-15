// require dependencies for the application
//var twilio = require('twilio');
var express = require('express');
var bodyParser = require('body-parser');
var pass = require('./pass');

// Create a simple Express web app that will parse incoming POST bodies
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var port = process.env.PORT || 4000;

//require the Twilio module and create a REST client
var client = require('twilio')(pass.ACCOUNT_SID, pass.AUTH_TOKEN);


// Create a route to render the home page
// app.get('/', function(request, response) {
//     response.sendFile('/index.html');
// });
app.use(express.static('public'));


// Create a route that will handle the form submission
app.post('/send', function(request, response) {
    // to send a message, we need a Twilio REST client - we create one here,
    // initializing with our Twilio account credentials. I am loading them here
    // from system environment variables, accessible through the "process.env"
    // global object in Node
    //var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID,
        //process.env.TWILIO_AUTH_TOKEN);
 
    // Now, get the parameters POSTed from our form:
    var toNumber = request.body.number;
    var url = request.body.link;
 
    // Now let's send the message!
    client.sendMessage({
        to: toNumber,
        body: url,
        // This is the MMS-enabled number you purchased previously
        from: pass.T_NUMBER
    }, function(err, messageData) {
        if (err) {
            response.send('Oops, there was an error :(');
            console.error(err);
        } else {
            response.send('Message sent! SID: ' + messageData.sid);
        }
    });
});
 
// Start the web application, and serve on local port 4000
app.listen(port, function(){
  console.log('app started on port',port);
});