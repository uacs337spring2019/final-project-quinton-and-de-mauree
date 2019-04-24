(function() {
	"use strict";
	//when window loads
	let url = "";
	window.onload = function() {
		document.getElementById("search").onclick = movieOrActor;
	};

	function movieOrActor () {
		let radios = document.getElementsByName("select");
		let value = "";
		for (let i = 0; i < radios.length; i++) {
			if (radios[i].checked){
				value = radios[i].value;
			}
		}
		if (value === "movie"){
			movieSearch();
		}
		else if (value === "actor"){
			actorSearch();
		}
	}
	function loadMessages() {
		fetch(url)
		.then(checkStatus)
		.then(function(responseText) {
			let json = JSON.parse(responseText);
			let messages = json.messages;
			let commentBox = document.getElementById("comment_box");
			commentBox.innerHTML = "";
			document.getElementById("success").innerHTML = "";
			for (let i = 0; i < messages.length; i++) {
				//parses messages in message.txt
				//writes to html	
				let message = messages[i];
				let name = document.createElement("p");
				let comment = document.createElement("p");
				name.innerHTML = message.name + ":";
				comment.innerHTML = message.comment;
				let commentName = document.createElement("div");
				let commentMessage = document.createElement("div");
				commentName.appendChild(name);
				commentMessage.appendChild(comment);
				commentBox.appendChild(commentName);
				commentBox.appendChild(commentMessage);
			}
			});
			//sends error message
			// .catch(function(error) {
			// 	console.log(error);
			// });
	}
	//if user wants movies with kevin bacon only
	function send () {
		let userName = document.getElementById("commenter").value;
		let userMessage = document.getElementById("comment").value;
		let name = document.getElementById("name").value;
		const chat = {userName: userName, 
	                 userMessage: userMessage,
	             	 name: name};
		const fetchOptions = {
			method : 'POST',
			headers : {
				'Accept': 'application/json',
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify(chat)
		};
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
				//adds success message to html page
				document.getElementById("success").innerHTML += responseText;
			});
			//sends error message
			// .catch(function(error) {
			// 	console.log(error);
			// });
		document.getElementById("comment").value = "";
		document.getElementById("commenter").value = "";

	}
	//if user wants all movies
	function movieSearch() {
		let movieName = document.getElementById("name").value;
		if (movieName != "") {
			let name = movieName.replace(" ", "_");
			url = "http://localhost:3000/?name="+name+"&mode=movie";
			//creates txtfile 
			send(url);
			//checks database
			fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				//includes all movies in a table in descending order of the year
				let content = document.getElementById("content");
				let h1 = document.getElementById("h1");
				let p = document.getElementById("p");
				let table = document.getElementById("table");
				// let img = document.getElementById("img");
				h1.innerHTML = "";
				p.innerHTML = "";
				table.innerHTML = "";
				// img.src = "";
				table.innerHTML = "";
				h1.innerHTML = "Results for " + movieName;
				p.innerHTML = "Actors in "+ movieName;
				let json = JSON.parse(responseText);
				let sql = json.sql
				console.log(json);
				let row1 = document.createElement("tr");
				let column = document.createElement("td");
				column.innerHTML = "#";
				row1.appendChild(column);
				let column2 = document.createElement("td");
				column2.innerHTML = "First Name";
				row1.appendChild(column2);
				let column3 = document.createElement("td");
				column3.innerHTML ="Last Name";
				row1.appendChild(column3);
				table.appendChild(row1);
				for (let i = 0; i < sql.length; i++) {
					let firstName = sql[i].first_name;
					let lastName = sql[i].last_name;
					let row = document.createElement("tr");
					let column = document.createElement("td");
					column.innerHTML = i+1;
					row.appendChild(column);
					let column2 = document.createElement("td");
					column2.innerHTML = firstName;
					row.appendChild(column2);
					let column3 = document.createElement("td");
					column3.innerHTML = lastName;
					row.appendChild(column3);
					table.appendChild(row);
				}
				content.appendChild(table);

				// let json = JSON.parse(responseText);
				let messages = json.messages;
				let commentBox = document.getElementById("comment_box");
				commentBox.innerHTML = "";
				document.getElementById("success").innerHTML = "";
				for (let i = 0; i < messages.length; i++) {
					//parses messages in message.txt
					//writes to html	
					let message = messages[i];
					let name = document.createElement("p");
					let comment = document.createElement("p");
					name.innerHTML = message.name + ":";
					comment.innerHTML = message.comment;
					let commentName = document.createElement("div");
					let commentMessage = document.createElement("div");
					commentName.appendChild(name);
					commentMessage.appendChild(comment);
					commentBox.appendChild(commentName);
					commentBox.appendChild(commentMessage);
				}
				document.getElementById("insert_comment").onclick = send;
			});
	
			// .catch(function(error){
			// 	console.log(error);
			// });
			//sends error message
		}
		else {
			alert("Input movie name into textbox.");
		}
	}

	function actorSearch() {
		let actorName = document.getElementById("name").value;
		if (actorName != "") {
			let name = actorName.replace(" ", "_");
			url = "http://localhost:3000/?name="+name+"&mode=actor";
			//creates txtfile
			send(url);
			console.log(url);
			//checks database
			fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				//adds all movies with kevin bacon in a table in descending years
				let content = document.getElementById("content");
				let h1 = document.getElementById("h1");
				let p = document.getElementById("p");
				let table = document.getElementById("table");
				//let img = document.getElementById("img");
				h1.innerHTML = "";
				p.innerHTML = "";
				table.innerHTML = "";
				//img.src = "";
				let row1 = document.createElement("tr");
				let column = document.createElement("td");
				column.innerHTML = "#";
				row1.appendChild(column);
				let column2 = document.createElement("td");
				column2.innerHTML = "Movie";
				row1.appendChild(column2);
				let column3 = document.createElement("td");
				column3.innerHTML ="Year";
				row1.appendChild(column3);
				table.appendChild(row1);
				h1.innerHTML = "Results for " + actorName;
				p.innerHTML = "Films with "+ actorName;
				let json = JSON.parse(responseText);
				let sql = json.sql;
				console.log(h1,p);
				for (let i = 0; i < sql.length; i++) {
					let movieName = sql[i].name;
					let year = sql[i].year;
					let row = document.createElement("tr");
					let column = document.createElement("td");
					column.innerHTML = i+1;
					row.appendChild(column);
					let column2 = document.createElement("td");
					column2.innerHTML = movieName;
					row.appendChild(column2);
					let column3 = document.createElement("td");
					column3.innerHTML = year;
					row.appendChild(column3);
					table.appendChild(row);
				}
				content.appendChild(table);

				let messages = json.messages;
				let commentBox = document.getElementById("comment_box");
				commentBox.innerHTML = "";
				document.getElementById("success").innerHTML = "";
				for (let i = 0; i < messages.length; i++) {
					//parses messages in message.txt
					//writes to html	
					let message = messages[i];
					let name = document.createElement("p");
					let comment = document.createElement("p");
					name.innerHTML = message.name + ":";
					comment.innerHTML = message.comment;
					let commentName = document.createElement("div");
					let commentMessage = document.createElement("div");
					commentName.appendChild(name);
					commentMessage.appendChild(comment);
					commentBox.appendChild(commentName);
					commentBox.appendChild(commentMessage);
				}
				document.getElementById("insert_comment").onclick = send;
			});

			// .catch(function(error){
			// 	console.log(error);
			// });
			//sends error message
		}
		//if no name entered
		else {
			alert("Input first and last name into textbox.");
		}
	}
	// rejects the promise with a message including the status
	function checkStatus(response) {  
		if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } 
        else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
	}
})();