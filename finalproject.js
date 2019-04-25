(function() {
	"use strict";
	//when window loads
	let url = "";
	window.onload = function() {
		document.getElementById("search").onclick = movieOrActor;
	};

	function movieOrActor () {
		document.getElementById("success").innerHTML = "";
		document.getElementById("comment_box").innerHTML = "";
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
			for (let i = 0; i < messages.length; i++) {
				//parses messages in message.txt
				//writes to html	
				let message = messages[i];

				let comment1 = document.createElement("div");
				let comment2 = document.createElement("div");
				comment1.innerHTML = message.name + ":";
				comment2.innerHTML = message.comment;
				comment1.style.marginBottom = "10px";
				comment1.style.marginLeft = "5px";
				comment1.style.marginRight = "5px";
				comment2.style.marginBottom = "20px";
				comment2.style.marginLeft = "15px";
				comment1.style.marginRight = "5px";
				comment2.style.fontStyle = "italic";
				comment2.style.fontSize = "14pt";

				let comment = document.createElement("div");
				comment.appendChild(comment1);
				comment.appendChild(comment2);
				comment.style.marginLeft = "50px";
				comment.style.marginRight = "50px";
				comment.style.borderRadius = "20px";
				comment.style.padding = "10px";
				if (i % 2 == 0){
					comment.style.backgroundColor = "#2B2725";
				}
				commentBox.appendChild(comment);
			}
			});
	}
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
				document.getElementById("success").style.color = "#46CC71";
				document.getElementById("success").innerHTML = responseText;
			});
		document.getElementById("comment").value = "";
		document.getElementById("commenter").value = "";
	}
	//if user wants all movies
	function movieSearch() {
		let movieName = document.getElementById("name").value;
		if (movieName != "") {
			let name = movieName.replace(" ", "_");
			url = "http://localhost:3000/?name="+name+"&mode=movie";
			send();
			//checks database
			fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				if (responseText == undefined){
					let p = document.getElementById("errormsg");
					p.style.fontFamily = "Verdana";
					p.style.color = "#CE3A3A";
					p.innerHTML = "<br/>Movie not recognized, check your spelling and try again!";
					document.getElementById("leavecomment").style.visibility = "hidden";
					if (document.getElementById("table").innerHTML != "")
					{
						document.getElementById("h1").innerHTML = "";
						document.getElementById("p").innerHTML = "";
						document.getElementById("table").innerHTML = "";
					}
				}
				else {
					let json = JSON.parse(responseText);
					let sql = json.sql;
					if (sql.length == 0)
					{
						let p = document.getElementById("errormsg");
						p.style.fontFamily = "Verdana";
						p.style.color = "#CE3A3A";
						p.innerHTML = "<br/>Movie not recognized, please try again!";
						document.getElementById("leavecomment").style.visibility = "hidden";
						if (document.getElementById("table").innerHTML != "")
						{
							document.getElementById("h1").innerHTML = "";
							document.getElementById("p").innerHTML = "";
							document.getElementById("table").innerHTML = "";
						}
					}
					else {
						//includes all movies in a table in descending order of the year
						document.getElementById("leavecomment").style.visibility = "visible";
						document.getElementById("errormsg").innerHTML = "";
						let content = document.getElementById("content");
						let h1 = document.getElementById("h1");
						let p = document.getElementById("p");
						let table = document.getElementById("table");
						h1.innerHTML = "";
						p.innerHTML = "";
						table.innerHTML = "";
						table.innerHTML = "";
						h1.innerHTML = "Results for " + movieName;
						p.innerHTML = "Actors in "+ movieName;
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

						loadMessages();
						document.getElementById("insert_comment").onclick = send;
					}
				}
			});
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
			send();
			//checks database
			fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				if (responseText == undefined){
					let p = document.getElementById("errormsg");
					p.style.fontFamily = "Verdana";
					p.style.color = "#CE3A3A";
					p.innerHTML = "<br/>Actor not recognized, check your spelling and try again!";
					document.getElementById("leavecomment").style.visibility = "hidden";
					if (document.getElementById("table").innerHTML != "")
					{
						document.getElementById("h1").innerHTML = "";
						document.getElementById("p").innerHTML = "";
						document.getElementById("table").innerHTML = "";
					}
				}
				else {
					let json = JSON.parse(responseText);
					let sql = json.sql;
					if (sql.length == 0)
					{
						let p = document.getElementById("errormsg");
						p.style.fontFamily = "Verdana";
						p.style.color = "#CE3A3A";
						p.innerHTML = "<br/>Actor not recognized, please try again!";
						document.getElementById("leavecomment").style.visibility = "hidden";
						if (document.getElementById("table").innerHTML != "")
						{
							document.getElementById("h1").innerHTML = "";
							document.getElementById("p").innerHTML = "";
							document.getElementById("table").innerHTML = "";
						}
					}
					else {
						//creates txtfile
						console.log("here");
						document.getElementById("leavecomment").style.visibility = "visible";
						document.getElementById("errormsg").innerHTML = "";
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

						loadMessages();
						document.getElementById("insert_comment").onclick = send;
					}
				}
			});
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
            return; 
        } 
	}
})();