// A general purpose object which contains various configuration data
var unsorted = {
	currentPage:		"1",
	logoWidth:		860,
	pagesContainerOffset:	220,
	question:		undefined,
	responseAddress:	undefined
};

// An object to contain general purpose functions, so that we don't clutter the global
// environment.
var funcs = {

	placeElements:	function () {
				var windowWidth = window.innerWidth || document.body.clientWidth;
				var leftOffset = (windowWidth - unsorted.logoWidth) / 2;
				document.getElementById("logo").style.left = leftOffset + "px";
				document.getElementById("menu").style.left = leftOffset + "px";
				document.getElementById("pagesContainer").style.left = (leftOffset + unsorted.pagesContainerOffset) + "px";
			},

	switchToPage:	function (pageNumber) {
				if (document.body.classList) {
					var currentPage = unsorted.currentPage;
					document.getElementById("page"+currentPage).style.display = "none";
					document.getElementById("linkPage"+currentPage).classList.remove("orange");
					document.getElementById("linkPage"+currentPage).classList.add("blue");
					scrollTo(0,0);
					document.getElementById("page"+pageNumber).style.display = "block";
					document.getElementById("linkPage"+pageNumber).classList.remove("blue");
					document.getElementById("linkPage"+pageNumber).classList.add("orange");
					unsorted.currentPage = pageNumber;
				} else {
					var currentPage = unsorted.currentPage;
					document.getElementById("page"+currentPage).style.display = "none";
					document.getElementById("linkPage"+currentPage).className = "menuItem blue";
					scrollTo(0,0);
					document.getElementById("page"+pageNumber).style.display = "block";
					document.getElementById("linkPage"+pageNumber).className = "menuItem orange";
					unsorted.currentPage = pageNumber;
				}
			},

	sendQuestion:	function () {
				// Hide what may have been left
				document.getElementById("aProblemOccurred").style.display = "none";

				// Put together the message
				unsorted.question = document.getElementById("questionField").innerHTML;
				unsorted.responseAddress = document.getElementById("addressField").innerHTML;
				var message = "message=" + "#QUESTION#" + unsorted.question + "#READDR#" + unsorted.responseAddress;

				// Open and send the request
				var request = new XMLHttpRequest();
				request.open("POST", "php/getQuestion.php");
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send(message);

				// Display the wainting status
				document.getElementById("statusMessage").style.display = "block";

				// Attach the necessary handlers for the response
				request.onreadystatechange = function() {
					if (request.readyState === 4 && request.status === 200) {
						var type = request.getResponseHeader("Content-Type");
						if (type.match(/^text/)) {
							funcs.handleResponse(request.responseText);
						}
					}
				};
			},

	handleResponse:	function (responseText) {
				if (responseText === "QUESTIONASKED") {
					// Hide all unnecessary things
					document.getElementById("formParagraph").style.display = "none";
					document.getElementById("aProblemOccurred").style.display = "none";
					document.getElementById("statusMessage").style.display = "none";
					// Display the necessary things
					document.getElementById("sentMessageStatus").style.display = "block";
					// Fill the necessary things with the necessary info
					document.getElementById("sentQuestion").innerHTML = unsorted.question;
					document.getElementById("sentAddress").innerHTML = unsorted.responseAddress;
					// Set the response variable to true
					unsorted.responseReceived = true;
				} else {
					alert(responseText);
					// Hide the unnecessary, display the necessary
					document.getElementById("statusMessage").style.display = "none";
					document.getElementById("aProblemOccurred").style.display = "block";
				}
			}
				
};

window.onload = function () {

	// For browser without css3 calc support, put the elements in position
	if ( document.getElementById("logo").offsetLeft === 0 ) {
		funcs.placeElements();
	}

	// Set page 1 to be visible and change the div's color
	document.getElementById("page1").style.display = "block";
	if (document.body.classList) {
		document.getElementById("linkPage1").classList.remove("blue");
		document.getElementById("linkPage1").classList.add("orange");
	} else {
			document.getElementById("linkPage1").className = "menuItem orange";
	}

	// Attach page switching functionality to menu items
	document.getElementById("linkPage1").onclick = function() { funcs.switchToPage("1"); };
	document.getElementById("linkPage2").onclick = function() { funcs.switchToPage("2"); };
	document.getElementById("linkPage3").onclick = function() { funcs.switchToPage("3"); };
	document.getElementById("linkPage4").onclick = function() { funcs.switchToPage("4"); };
	document.getElementById("linkPage5").onclick = function() { funcs.switchToPage("5"); };
	document.getElementById("linkPage6").onclick = function() { funcs.switchToPage("6"); };
	document.getElementById("linkPage7").onclick = function() { funcs.switchToPage("7"); };
	document.getElementById("linkEnglish").onclick = function() {
		window.location = window.location.href.replace("/it", "/en");
	};

	if (!document.getElementsByClassName) {
		document.getElementsByClassName = function(className) {
			var a = [];
			var re = new RegExp("(^| )" + className + "( |$)");
			var els = document.getElementsByTagName("*");
			for(var i=0, j=els.length; i<j; i++) {
				if(re.test(els[i].className)) {
					a.push(els[i]);
				}
			}
			return a;
		}
	}
	
	// Insert all beNEXT logos in the content
	var benextNames = document.getElementsByClassName("benextName");
	for ( var i=0; i < benextNames.length; i++ ) {
			benextNames[i].innerHTML = "<span class=\"blueText boldText\">be</span><span class=\"orangeText boldText\">NEXT</span>";
	}
	
	// Add handlers to "next arrows"
	var nextArrows = document.getElementsByClassName("nextArrow");
	for ( var i=0; i < nextArrows.length; i++ ) {
		nextArrows[i].onclick = function () {
			var newPage = parseInt(unsorted.currentPage) + 1;
			funcs.switchToPage(newPage);
		};
		nextArrows[i].onmouseover = function () { this.src = "images/png/nextOrange.png"; } ;
		nextArrows[i].onmouseout = function () { this.src = "images/png/nextBlue.png"; } ;
	}
	



	// Set the menu's height to always show the scrollbar
	var height = window.innerHeight || document.body.clientHeight;
	document.getElementById("menu").style.height = height + "px";

	// Attach style changing handlers to the "send" button
	document.getElementById("sendButton").onmousedown = function () {
		document.getElementById("sendButton").style.fontSize="12px";
	};
	document.getElementById("sendButton").onmouseup = function () {
		document.getElementById("sendButton").style.fontSize="13px";
	};

	document.getElementById("sendButton").onclick = funcs.sendQuestion;

};
