var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var events = require("events");

var eventEmitter = new events.EventEmitter();

var app = express();
var game_array = [];
var competition_temp;
var country_temp;

eventEmitter.on('array_sent', function(){
	console.log("On event...");
	game_array = [];
});

app.get('/fixtures/england', function(req, res){
	getContent("england/premier-league");
	setTimeout(function(){
		if(game_array.length == 0)
			res.send("No game available.");
		else
			res.send(game_array);
		eventEmitter.emit('array_sent');
	}, 1000);
});

app.get('/fixtures/spain', function(req, res){
	getContent("spain/primera-division");
	setTimeout(function(){
		if(game_array.length == 0)
			res.send("No game available.");
		else
			res.send(game_array);
		eventEmitter.emit('array_sent');
	}, 1000);
});

app.get('/fixtures/germany', function(req, res){
	getContent("germany/bundesliga");
	setTimeout(function(){
		if(game_array.length == 0)
			res.send("No game available.");
		else
			res.send(game_array);
		eventEmitter.emit('array_sent');
	}, 1000);
});

app.get('/fixtures/france', function(req, res){
	getContent("france/ligue-1");
	setTimeout(function(){
		if(game_array.length == 0)
			res.send("No game available.");
		else
			res.send(game_array);
		eventEmitter.emit('array_sent');
	}, 1000);
});

app.get('/fixtures/italy', function(req, res){
	getContent("italy/serie-a");
	setTimeout(function(){
		if(game_array.length == 0)
			res.send("No game available.");
		else
			res.send(game_array);
		eventEmitter.emit('array_sent');
	}, 1000);
});

app.listen(3000);
console.log('Listening on port 3000...');

function getContent(country){
	request({
		url: 'http://www.livescores.com/soccer/' + country + '/fixtures',
		followRedirect: false,
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0',
			'Referer': 'http://www.google.com',
		}
	}, function(err, response, body){
		if(!err && response.statusCode == 200){
			var $ = cheerio.load(body);
			$('div.row-gray, div.row.row-tall.mt4').each(function(i, element){
				if($(this).attr('class').trim() == 'row row-tall mt4'){
					competition_temp = $(this).children('.clear').children().find('a').last().text();
					country_temp = $(this).children('.clear').children().find('a').first().text();
				}
				else{
					game_array.push({
						game_id: parseInt(i),
						home_team: $(this).children('div.ply.tright.name').first().text().trim(),
						away_team: $(this).children('div.ply.name').last().text().trim(),
						home_team_score: $(this).children('div.sco').text().trim().substring(0,1),
						away_team_score: $(this).children('div.sco').text().trim().substring(4,5),
						minutes: $(this).children('div.min').text().trim(),
						competition: competition_temp,
						country: country_temp
					});
				}
			});
		}
	});
}