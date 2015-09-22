//Function that runs after map loads
function initializeTheRest() {
	console.log("removing Event Listener");
	google.maps.event.clearInstanceListeners(map);
	console.log("initializing the rest");
	//start counter
	startCounter();
	//activate modal
	$('.modal-trigger').leanModal();
	$('#welcome').openModal();
	//Makes PrayitFoward form work nice. 
	$('ul.tabs').tabs('select_tab', 'Step1');
	checkMapVisible();
	//Mobile menu button
	$(".button-collapse").sideNav();
	//Initialize marterialize "tabs"
	$('ul.tabs').tabs();
	//This is for smooth scrolling.
	//Smooth Scrolling interferes with Materiaz's close modal HTML method.
	//FIXED-Make sure any link you want to smoothly scroll has .smoothScroll class.
	$('.smoothScroll').smoothScroll();
	//instafeed
	console.log("starting Instafeed");
	feed.run();
	//facebook
	facebook();
	//Twiter Tweet Button Magic (TBH It really doesn't do much anything)
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
}
//Delaration for instafeed.
var feed = new Instafeed({
    get: 'tagged',
    tagName: 'prayitforward',
    clientId: '5706aa1ac7e84d609a8fd426259749be',
    limit: 12,
    //Sorry this has to be a single line. :( Turn word wrap on and you'll be fine. #toolazytoaddquotesandadditionsymbols
    template: '<div class="col s6 m6 l4"><div class="card hoverable"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="{{image}}"></div><div class="card-content" style="padding:5px;"><span class="card-title activator grey-text text-darken-4" style="font-size: 18px; line-height:0;"><i class="material-icons tiny" style="color: red;">favorite</i>{{likes}}<i class="material-icons right">more_vert</i></span></div><div class="card-reveal" style="padding: 10px;"><span class="card-title grey-text text-darken-4"><i class="material-icons right">close</i></span><div class="left"><i class="material-icons tiny" style="color: red;">favorite</i>{{likes}}</div><br><a target="_blank" href="{{link}}" style="color:black;"><b>{{model.user.full_name}}</b></a><p>{{caption}}<br><a href="{{link}}" target="_blank">See post in context.</a></p></div></div></div>',
    sortBy: 'most-recent',
    resolution: 'low_resolution'
});

var count = 0;
//Startup Script for Prayer Counter
function startCounter() {
	console.log("Starting counter");
	var selector = document.querySelector('#odometer');
	odometer = new Odometer({
		el: selector,
		value: count,
		duration: 3000,
		format: ''
	});
	$('#counter').animate({opacity:1}, 1000);
	odometer.update(count);
	setInterval(function(){
		odometer.update(count);
	}, 3000);
}

//This funciton to get the counter out of the way when you are using the map.
var counterTimeout;
function hideCounter(timeout) {
	if ($('#counter').is(":visible")) {
		$('#counter').animate({opacity:0}, 500, function() {
			$('#counter').css('visibility', 'hidden');
		});
	}
	clearTimeout(counterTimeout);
	counterTimeout = setTimeout(function() {
		$('#counter').css('visibility', 'visible');
		$('#counter').animate({opacity:1}, 500);
	}, timeout);
}



//Script for location selector map
var locatorMap;
var locatorMarker;
var latLng = {lat: 46.046570,lng: -118.390621};
var locatorMapInitialized = false;
//This function initializes the map once it it actually visible.
//  Aparently the maps don't like to be initialized while they are hidden.
function checkMapVisible() {
	var interval = setInterval(function () {
	  if($('#locationMap').is(':visible') && !locatorMapInitialized) {
	    clearInterval(interval);
	    locatorMapInitialized = true;
	    readyLocatorMap();
	  }
	}, 200);
}
function readyLocatorMap() {
	console.log("readying Locator Map & Geocoding");
	var mapOptions = {
		backgroundColor: "#FFF",
		center: latLng,
		zoom: 14,
		disableDefaultUI: true
	};
	locatorMap = new google.maps.Map(document.getElementById('locationMap'), mapOptions);
	locatorMarker = new google.maps.Marker({
		position: latLng,
		map: locatorMap,
		draggable: true,
		title: "Your Choosen Location"
	});
	//Geocoding Initialization
	var geocoder = new google.maps.Geocoder();
	var locatorTimeout;
	//DOM Listener for Geocoding
	document.getElementById('locationButton').addEventListener('click', function() {
		console.log("Geocoding");
		$('#locationStatus').html("Checking...");
		geocodeLocation(geocoder, locatorMap);
  	});
}

//This is the Geocoding Query function API Thingy :)
var locationSet = false;
function geocodeLocation(geocoder, resultsMap) {
	var address = document.getElementById('location').value;
	geocoder.geocode({'address': address}, function(results, status) {
	if (status === google.maps.GeocoderStatus.OK) {
	  locatorMap.setCenter(results[0].geometry.location);
	  locatorMarker.setPosition(results[0].geometry.location);
	  $('#locationStatus').html("Looks Good! Click next to continue.");
	  locationSet = true;
	} else {
	  $('#locationStatus').html('Geocode was not successful for the following reason: ' + status);
	}
	});
}
//Function to move tabs to the next tab. 
function nextTab() {
	var visible;
	var steps = ['Null','Step1','Step2','Step3','Step4'];
	for (var i = 1; i < steps.length; i++) {
		if ($('#' + steps[i]).is(":visible")) {
			visible = i;
			break;
		}
	}
	if(visible == 4) {
		focusoncurrent();
		$('ul.tabs').tabs('select_tab', 'Step1');
		$("#nextButton").html("Next");
		return;
	}
	if(visible == 3) {
		$("#nextButton").html("See Your Pin");
	}
	if(visible == 2 ) {
		if (!checkStep2())
			return;
		$("#nextButton").html("Continue");
		formSubmit();
	}
	if(visible == 1) {
		if (!checkStep1())
			return;
	}
	$('ul.tabs').tabs('select_tab', steps[visible +1]);
	if(visible == 1) {
		$("#nextButton").html("Pin to Map");
		$("#location").focus();
	} 
}

var currentPin;
function formSubmit() {
	var pinsRef = rootRef.child('pins');
	
	var pinsPostRef = pinsRef.push();
	var check = {"name":rmbc($('#name').val()),"story":rmbc($('#story').val()),"email":rmbc($('#email').val()),lat:locatorMarker.getPosition().H,lng:locatorMarker.getPosition().L, "date": dts()};
	pinsPostRef.set({
		name: check.name,
		story: check.story,
		date: Firebase.ServerValue.TIMESTAMP, 
		lat: check.lat,
		lng: check.lng
	}, function(error) {
		if (error) {
			Materialize.toast("Error: " + error);
		}
	});
	//Through Up the email
	var pinsPrivateRef = rootRef.child('pinsPrivate').child(pinsPostRef.key());
	pinsPrivateRef.set({
		"email": check.email
	}, function(error) {
		if (error) {
			Materialize.toast("Error: " + error);
		}	
	});
	//add Duplicate pin to map.
	pins.push(check);
	currentPin = pins.length-1;
	putPin(currentPin, 0);
	pinIndex++;
}
function focusoncurrent() {
	$.smoothScroll({
      scrollTarget: '#nav'
    });
	map.setCenter(markers[currentPin].position);
	openInfoMarker(currentPin);
	hideCounter(20000);
}
//Current date to string
function dts () {
	var date = new Date();
	return date.getTime();
}
//The future function that is going to check the form. :|
function checkStep1() {
	if ($('#name').val() == "") {
		Materialize.toast("Please enter your name.", 4000);
		$('ul.tabs').tabs('select_tab', 'Step1');
		$("#name").focus();
		return false;
	}
	if (!validateEmail($('#email').val())) {
		Materialize.toast("Please enter a valid email.", 4000);
		$('ul.tabs').tabs('select_tab', 'Step1');
		$("#email").focus();
		return false;
	}
	if ($('#story').val() == "") {
		Materialize.toast("Please enter your story.", 4000);
		$('ul.tabs').tabs('select_tab', 'Step1');
		$("#story").focus();
		return false;
	}
	return true;
}
function checkStep2() {
	if (!locationSet) {
		Materialize.toast("Please enter a location and click 'Verify Location.'", 4000);
		$("#location").focus();
		return false;
	}
	return true;
}
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

//Remove Bad Characters
function rmbc(strTemp) {  
    strTemp = strTemp.replace(/[^A-Za-z0-9_!?.@();: ]/g,"");  
    return strTemp; 
}

//This function makes the map ocupy the correct amount of space. 
$(window).resize(function() {
    console.log("Window Resize");
    $("#map-canvas").height($( window ).height() - $( 'nav' ).height());
    google.maps.event.trigger(map, "resize");
  });

//This is an array of Google markers it will be populated when the map finishes initializing.
var pinIndex = 0;
var markers = [];
var pins = [];
var	rootRef = new Firebase("https://prayitforward.firebaseio.com/");
var wallaWalla = new google.maps.LatLng(46.046570, -118.390621); // (zoom 13)
var unitedStates = new google.maps.LatLng(38.96370424778, -98.26366787500001); //United States (Zoom 4)
var world = new google.maps.LatLng(9.281074119839158, 23.201175874999958);//Zoom 2
var map;
function initialize() {
	console.log("Making Map");
	$("#map-canvas").height($( window ).height() - $( 'nav' ).height());
    var styles = [
	    {
	      featureType: 'all',
	      stylers: [
	        { visibility: 'off' }
	      ]
	    },{
	      featureType: 'road',
	      elementType: 'geometry',
	      stylers: [
	        { saturation: -100 },
	        { lightness: -50 },
	        { visibility: 'on' }
	      ]
	    },{
	      featureType: 'road',
	      elementType: 'labels',
	      stylers: [
	        /*{ saturation: -100 },
	        { gamma: .2},*/
	        { visibility: 'on' }
	      ]
	    },{
	      featureType: 'city',
	      elementType: 'labels',
	      stylers: [
	        //{ saturation: -100 },
	        { visibility: 'on' }
	      ]
	    },{
			featureType: 'all',
			elementType: 'labels.text.fill',
			stylers: [
				{ saturation: -100},
				/*{ lightness: -100 },
				{ gamma: .01 },*/
				{ visibility: 'on'}
			]
		},{
			featureType: 'administrative',
			elementType: 'geometry.stroke',
			stylers: [
				{ visibility: 'simplifed' }
			]
		},{
			featureType: 'water',
			elementType: 'geometry',
			stylers: [
				{ visibility: 'on' }
			]
		}
	];
    var mapOptions = {
    	backgroundColor: "#FFFFFF",
        center: world,
        zoom: 3,
        disableDefaultUI: false,
        scrollwheel: false,
        styles: styles
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //Loads the rest of the javascript things once the map is filled.
    map.addListener('tilesloaded',function() {
    	console.log("Starting Intitialize");
    	initializeTheRest();
    });
    //Put all the pins down.
	var pinsRef = rootRef.child('pins');
	pinsRef.on("child_added", function(snapshot) {
		pins.push(snapshot.val());
		putPin(pinIndex, 0);
		count++;
		pinIndex++;
	}, function (errorObject) {
	   Materialize.toast("Failed to get pins: " + errorObject.code);
	});
}

function putPin(pinNum, timeout) {
	if (timeout > 5000)
		timeout = 5000;
	window.setTimeout(function() {
		markers.push(new google.maps.Marker({
			position: {lat: pins[pinNum].lat, lng: pins[pinNum].lng},
			icon: 'prayer.ico',
			animation: google.maps.Animation.DROP,
			map: map,
			title: pins[pinNum].name,
			zIndex: pinNum
		}));
		markers[pinNum].addListener('click', function() {
    		openInfoMarker(pinNum);
  		});
	}, timeout);
}
google.maps.event.addDomListener(window, 'load', initialize);

//Initializaitons and functionality for infoWindows on pins.
var infoWindow;
function openInfoMarker(pinNum) {
	var contentString = "<div style='background-image: url(\"logo-light.png\");background-repeat:no-repeat;background-size:contain;background-position: center;'><div class='row'><strong>" + pins[pinNum].name + "</strong><br><p>" + pins[pinNum].story + "</p><p>"+std(pins[pinNum].date)+"</div></div>";
	if (infoWindow != undefined) {
		infoWindow.close();
	}
	infoWindow = new google.maps.InfoWindow({
		content: contentString,
		maxWidth: 200
	});
	infoWindow.open(map, markers[pinNum]);
}

//String to date
function std(milliseconds){
	var date = new Date(milliseconds);
	return date.toLocaleTimeString() + " " + date.toLocaleDateString();
}


//Facebook JS
function facebook() {
	console.log("Nothing to do for facebook yet.");
	
}
//Facebook share button 
function facebookShare() {
	var w = 500;
	var h = 324;
	var left = (screen.width/2)-(w/2);
  	var top = (screen.height/2)-(h/2);
  	window.open("https://www.facebook.com/dialog/feed?app_id=1476293532700056&display=popup&caption=" + rmbc($("#story").val())+ "&link=https://aswwu.com/prayitforward/&redirect_uri=https://aswwu.com/prayitforward/thanks.html", "Share on Facebook", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}
