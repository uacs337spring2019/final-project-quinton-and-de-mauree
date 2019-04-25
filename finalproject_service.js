const express = require("express");
const app = express();
app.use(express.static('public'));
var mysql = require('mysql');

const fs = require("fs");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


// connection object
let con = mysql.createConnection({
  host: "mysql.allisonobourn.com",
  database: "csc337imdb_small",
  user: "csc337homer",
  password: "d0ughnut",
  debug: "true"
});

console.log("connected");

app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	//gets info from html
	let userName = req.body.userName;
	let userMessage = req.body.userMessage;
	let name = req.body.name;
	let fileName = name.replace(" ", "_");
	let write = false;
	//only writes to file if something written in both textboxes
	if (userName != "" && userMessage != ""){
		write = true;
	}
	//writes name and comment with ":::" in between, followed by new line
	if (write) {
		console.log("file created");
		fs.appendFile(fileName+".txt", userName+":::"+userMessage+"\n", function(err) {
			//send error message
	    	if(err) {
				console.log(err);
				res.status(400);
	    	}
	    	//send success message to terminal
	    	console.log("The file was saved!");
	    	res.send("Success!");
		});
	}
	else {
		fs.appendFile(fileName+".txt", "", function(err) {
			//send error message
	    	if(err) {
				console.log(err);
				res.status(400);
	    	}
	    	//send nothing if commentor name or comment missing
	    	res.send("");
	    });
	}
});

//give user info from database & gives information to user from text file
app.get('/', function (req, res) { 
	res.header("Access-Control-Allow-Origin", "*");
	let params = req.query;
	let mode = params.mode;
	let name = params.name;
	//reads file
	let file = fs.readFileSync(name+".txt", 'utf8');
	let lines = file.split("\n");
	let json = {};
	let messages = [];
	//writes in json
	for (let i = 0; i < lines.length-1; i++) {
		let single = lines[i].split(":::");
		let message = {};
		message.name = single[0];
		message.comment = single[1];
		messages.push(message);
	}
	//comments from user
	json.messages = messages;
	
	//user wants all movies an actor has been in
	if(mode === "actor"){
		let actorName = name.split("_");
		let firstName = actorName[0];
		let lastName = actorName[1];
		console.log("Connected!");
		con.query("SELECT m.name, m.year FROM actors a JOIN roles r ON a.id = r.actor_id JOIN movies m ON m.id = r.movie_id WHERE a.first_name='"+firstName+"' AND a.last_name = '"+lastName+"' ORDER BY m.year DESC;", 
            function (err, result, fields) {
				if (err) throw err;
				//database info
				json.sql = result;
				res.send(json);
			});
	}
	//user wants all actors in a movie
	else if (mode === "movie"){
		let movieName = name.replace("_", " ");
		console.log("Connected!");
		con.query("SELECT DISTINCT a.first_name, a.last_name FROM actors a JOIN roles r ON a.id = r.actor_id JOIN movies m ON m.id = r.movie_id WHERE m.name = '"+movieName+"' ORDER BY a.last_name, a.first_name;", 
            function (err, result, fields) {
				if (err) throw err;
				//database info
				json.sql = result;
				res.send(json);
			});
	}
});

app.listen(process.env.PORT);
