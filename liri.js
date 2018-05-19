require("dotenv").config();


var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request")
var keys = require("./keys");

var action = process.argv[2];
var parameter = process.argv[3];

function switchCase() {

  switch (action) {

    case 'my-tweets':
      grabTweets();
      break;

    case 'spotify-this-song':
      grabSong();
      break;

    case 'movie-this':
      grabMovie();
      break;

    case 'do-what-it-says':
      grabReadme();
      break;

    default: // default for if there is a missing 'break' 
      console.log("Please specify one of the following programs : my-tweets, spotiy-this-song, movie-this, do-what-it-says.");
      break;

  }
};

function grabTweets() {
  console.log("Latest Tweets From VnardozzNick!");
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });

  var params = {
    screen_name: "VnardozzNick"
  };
  // only posted 5 fake tweets but would grab the last 20  
  client.get("statuses/user_timeline", params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        var returnedData = ('Number: ' + (i + 1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
        console.log(returnedData);
      }
    }
  });
};

function grabMovie() {

  var findMovie;
  // Testing if search term is included with: movie-this '<movie name here>', if not defaults to Mr. Nobody.
  if (parameter === undefined) {
    findMovie = "Mr. Nobody";
  } else {
    findMovie = parameter;
  };

  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";

  console.log(queryUrl); //sanity check 

  request(queryUrl, function (err, res, body) {

    if (!err && res.statusCode === 200) {

      console.log("Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    } else {
      console.log (" Someting went wrong!");
    }
  });
};

function grabSong() {
  console.log("Music!");
  // Spotify variable loading keys from keys.js
  var spotify = new Spotify({
    id: keys.spotifyKeys.client_ID,
    secret: keys.spotifyKeys.client_secret
  });
  // Same search terms like from twitter code, for use with: spotify-this-song '<song name here>'. Defaults to Good Ol' Ottis Redding if nothing.
  var searchTrack;
  if (parameter === undefined) {
    searchTrack = "sitting on the dock of the bay";
  } else {
    searchTrack = parameter;
  }
  spotify.search({
    type: 'track',
    query: searchTrack
  }, function (error, data) {
    if (error) {
      console.log('Error occurred: ' + error);
      return;
    } else {
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song Name: " + data.tracks.items[0].name);
      console.log("Preview: " + data.tracks.items[3].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);

    }
  });
};

function grabReadme() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    // split the string  by comma separation and store the contents into the output array.
    var output = data.split().splice(",");
    // Loop output array
    for (var i = 0; i < output.length; i++) {
      console.log(output[i]);
    }
  });
}
switchCase();