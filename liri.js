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
//inquirer
var inquirer = require("inquirer");


//function using omdb
var movie = function () {
    //asking user which movie to search
    inquirer.prompt([
        {
            type: "input",
            message: "What movie would you like to search?",
            name: "movie"
        }
    ]).then(function (inquirerResponse) {
        //grab user input
        var input = inquirerResponse.movie;

        var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
        //make API call and print out info returned
        Request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("IMDB Rating: " + JSON.parse(body).Rated);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Production location: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                start();
            }
            else {
                throw error;
            }
        });
    })
}

//function using spotify
var song = function () {
    //asking user which song to search
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is a song you'd like to look up?",
                name: "song"
            }
        ]).then(function (inquirerResponse) {
            //grab user input
            var input = inquirerResponse.song;
            var movieName = "";
            //iterate through input to make into correct format for API call
            for (var i = 0; i < input.length; i++) {
                if (i > 0 && i < input.length) {
                  movieName = movieName + "+" + input[i];
                }
                else {
                  movieName += input[i];
                }
            }
            //make API call, return specific info 
            spotify.search({ type: 'track', query: movieName }).then(function (response) {
                console.log("Artist name: " + response.tracks.items[0].artists[0].name);
                console.log("The song name: " + response.tracks.items[0].name);
                console.log("Album name: " + response.tracks.items[0].album.name);
                console.log("External URL: " + response.tracks.items[0].album.artists[0].external_urls.spotify);
                start();
            }).catch(function (err) {
                console.log(err);
            });
        })
}

//function using twitter
var tweet = function () {
    //asking user which twitter account to search
    inquirer
        .prompt([
            {
                type: "input",
                message: "Whose tweets would you like to look up?",
                name: "account"
            }
        ]).then(function (inquirerResponse) {
            //grab user input
            var input = inquirerResponse.account;

            var params = { screen_name: input };
            //make API call and return 20 most recent tweets
            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (!error) {
                    console.log("Users 20 latest tweets:")
                    for (var i = 0; i < 20; i++) {
                        console.log((i + 1) + ": " + tweets[i].text);
                    }
                } else {
                    throw error;
                }
                start();
            });
        });
}

//starter function
var start = function () {
    //ask user what they want to search
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to look up today?",
                choices: ["Tweets", "Songs", "Movies", "Nothing"],
                name: "want"
            }
        ]).then(function (inquirerResponse) {
            if (inquirerResponse.want === "Tweets") {
                tweet();
            }
            else if (inquirerResponse.want === "Songs") {
                song();
            }
            else if (inquirerResponse.want === "Movies") {
                movie();
            }
            else {
                console.log("Goobye :)")
            }
        });
}

start();