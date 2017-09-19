var express = require('express');
var router = express.Router();
var https = require('https'); 
var btoa = require('btoa');

var keys = {
    client: "y8Kmyuer2nBdJRauCXujIueUY", 
    secret: "0Aqct0jx8zGWEDKh0NYwcMPg3FDHmrtn08tqagQQYseFdPL3tG"
}



var combined = keys.client + ":" + keys.secret; 
var base64encoded = btoa(combined); 
console.log("Acces Token "+ base64encoded);
console.log("Combined keys "+combined);


function getAccessToken(handleAccessTokenResponse) {
    const options = {
        hostname: "api.twitter.com", 
        port: 443, 
        path: '/oauth2/token',
        method: 'POST', 
        headers: {
            'Authorization': 'Basic ' + base64encoded, 
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }; 
    
    var postData = 'grant_type=client_credentials'; 
    var completeResponse = ''; 
    
    // Set up the request
    var postReq = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
          completeResponse += chunk; 
      });
      
      res.on('end', function() {
            console.log("########################################"); 
            console.log("status code: " + this.statusCode); 
            //console.log("Complete response: " + completeResponse); 
            var responseJSON = JSON.parse(completeResponse); 
            var accessToken = responseJSON.access_token; 
            
            handleAccessTokenResponse(accessToken); 
            
            
            /*execute callback*/
            //sendBackResponseToBrowser(apiResponse); 
            
      }); 
    });
    
    postReq.write(postData);
    postReq.end();
    
}

//curl -H 'Authorization: Bearer AAAAAAAAAAAAAAAAAAAAAOn%2F2AAAAAAA%2FK5ajiMUX%2B3UZ7R5yULG3sWQIIk%3D4TWghebaY5OI9jvdNIlMs12IEPPfHG16eo4MCJ2iCMZZDk9iCX' 
//https://api.twitter.com/1.1/search/tweets.json?q=birds
var keywords=['love','life','sports','age'];
var random= keywords[Math.floor(Math.random()*keywords.length)];
function getTweets(accessToken, sendResponseToBrowser) {
    const options = {
        hostname: "api.twitter.com", 
        port: 443, 
        path: '/1.1/search/tweets.json?q='+random,
        method: 'GET', 
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }; 
    
    var completeResponse = ''; 
    
    // Set up the request
    var twitterRequest = https.request(options, function(twitterResponse) {
      twitterResponse.setEncoding('utf8');
      twitterResponse.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
          completeResponse += chunk; 
      });
      
      twitterResponse.on('end', function() {
            console.log("########################################"); 
            console.log("status code: " + this.statusCode); 
            //console.log("Complete response: " + completeResponse); 
            
            var responseJSON = JSON.parse(completeResponse); 
            var tweetsList = responseJSON.statuses; 
            sendResponseToBrowser(tweetsList); 
      }); 
    });
    
    twitterRequest.end();
    
}









function makeApiRequest(sendBackResponseToBrowser) {
    const options = {
    hostname: "api.gettyimages.com", 
    port: 443, 
    path: '/v3/search/images?phrase='+random,
    method: 'GET', 
    headers: {
        'Api-Key': process.env.GETTY_API_KEY
       //'Api-Key':'w9932mgvysztaxwhxau4meer'
    }
}; 
    var apiResponse = ''; 
    
    https.get(options, function(response){
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
            console.log("received data: "); 
            apiResponse += chunk; 
        }); 
        
        response.on('end', function() {
            console.log("status code: " + this.statusCode); 
            //console.log("Complete response: " + apiResponse); 
            /*execute callback*/
            var responseJSON = JSON.parse(apiResponse); 
            var images = responseJSON.images; 
            console.log(responseJSON); 
            console.log("num images: " + images.length); 
            console.log("url of first image: " + images[0].display_sizes[0].uri); 
            var imageURI = images[3].display_sizes[0].uri; 
            
            sendBackResponseToBrowser(imageURI); 
            
        }); 
    }).on("error", function(e) {
        console.log("Got an error: " + e.message); 
    }); 
}





router.get('/', function(req, res, next) {
  getAccessToken(function(accessToken) {
    getTweets(accessToken, function(tweets) {
         makeApiRequest(function(imageURI){
        //res.send("Hurrah"); 
       // console.log("num tweets: " + tweets.length); 
       //console.log(tweets);
        
        res.render('twitter', {tweets: tweets,imageURI: imageURI});
         });
    }); 
  }); 
});

module.exports = router;