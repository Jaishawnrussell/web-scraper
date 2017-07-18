"use strict";
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();


  //All the web scraping magic will happen here
app.get('/scrape', function(req, res){
    // The URL we will scrape from - in our example Anchorman 2.
    var pageData = new Array;
    var url = "http://www.espn.com/mlb/team/stats/batting/_/name/chc";

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){
      var data = {
            player1: ".player-10-30782",
            player2: ".player-10-33172",
            player3: ".player-10-32656",
            player4: ".player-10-33712",
            player5: ".player-10-33173",
          };

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            Object.keys(data).forEach(k => {
                var playerData = {player:"", ba:"", hr:"", so:""};
                var playerName = $(data[k] + " td a").text();
                var battingAvg = $(data[k] + " td:nth-child(14)").text();
                var homeRuns = $(data[k] + " td:nth-child(8)").text();
                var strikeOuts = $(data[k] + " td:nth-child(12)").text();
                playerData.player = playerName;
                playerData.ba = battingAvg;
                playerData.hr = homeRuns;
                playerData.so = strikeOuts;
                pageData.push(playerData);
                console.log(pageData);
            });
        }

    fs.writeFile('output.json', JSON.stringify(pageData, null, 4), function(err){
      console.log(pageData);
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Check your console!');

  });
});

// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
//res.send('Check your console!')

app.listen('5050');
exports = module.exports = app;
