//dotenv
require("dotenv").config();
//keys
var keys = require('./keys.js');
//fs
var fs = require("fs");
//twitter
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
//spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
//request
var Request = require("request");



//twitter function
var tweets = function(){
    var params = {screen_name:'realDonaldTrump'};
    client.get('statuses/user_timeline',params, function (error, tweets, response) {
        if (!error){
            for(var i=0; i<20; i++){
                console.log((i+1)+ ": " + tweets[i].text); 
            }
        } else{
            throw error;
        }
    });
}

//spotify function
function playSongs(){

    spotify.search({ type: 'track', query: 'All the Small Things' }).then(function(response) {
        console.log("Artist name: " + response.tracks.items[0].artists[0].name);
        console.log("The song name: " + response.tracks.items[0].name);
        console.log("Album name: " + response.tracks.items[0].album.name);
        console.log("External URL: " + response.tracks.items[0].album.artists[0].external_urls.spotify);
      }).catch(function(err) {
        console.log(err);
      });
}


