//Function that runs after map loads
function initializeTheRest() {
	console.log("removing Event Listener");
	google.maps.event.clearInstanceListeners(map);
	console.log("initializing the rest");
	//start counter
	startCounter();
	//activate modal
	/*$('.modal-trigger').leanModal({
		//Form Assistance Javascript.
		ready: function() {
		  $('ul.tabs').tabs('select_tab', 'Step1');
		  checkMapVisible();
		}
	});*/
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
function hideCounter() {
	if ($('#counter').is(":visible")) {
		$('#counter').animate({opacity:0}, 500, function() {
			$('#counter').css('visibility', 'hidden');
		});
	}
	clearTimeout(counterTimeout);
	counterTimeout = setTimeout(function() {
		$('#counter').css('visibility', 'visible');
		$('#counter').animate({opacity:1}, 500);
	}, 4000);
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
function geocodeLocation(geocoder, resultsMap) {
	var address = document.getElementById('location').value;
	geocoder.geocode({'address': address}, function(results, status) {
	if (status === google.maps.GeocoderStatus.OK) {
	  locatorMap.setCenter(results[0].geometry.location);
	  locatorMarker.setPosition(results[0].geometry.location);
	  $('#locationStatus').html("Looks Good! Click next to continue.");
	} else {
	  $('#locationStatus').html('Geocode was not successful for the following reason: ' + status);
	}
	});
}
//Function to move tabs to the next tab. 
function next() {
	var visible;
	var steps = ['Null','Step1','Step2','Step3','Step4'];
	for (var i = 1; i < steps.length; i++) {
		if ($('#' + steps[i]).is(":visible")) {
			visible = i;
			break;
		}
	}
	if(visible == 4) {
		$('ul.tabs').tabs('select_tab', 'Step1');
		$("#nextButton").html("Next");
		return;
	}
	if(visible == 3) {
		$("#nextButton").html("Enter Another");
		formSubmit();
	}
	if(visible == 2 ) {
		$("#nextButton").html("Pin to Map");
	}
	console.log("Moving from '" + steps[visible] + "' to '" + steps[visible + 1] + "'. ");
	$('ul.tabs').tabs('select_tab', steps[visible +1]);
}
function formSubmit() {
	console.log("postForm() Not implemented yet. Sorry about that folks");
}
//This is an array of Google markers it will be populated when the map finishes initializing.
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
	        { lightness: -85 },
	        { visibility: 'on' }
	      ]
	    },{
	      featureType: 'road',
	      elementType: 'labels',
	      stylers: [
	        { saturation: -100 },
	        { visibility: 'on' },
	        { gamma: .2}
	      ]
	    },{
	      featureType: 'city',
	      elementType: 'labels',
	      stylers: [
	        { saturation: -100 },
	        { visibility: 'on' }
	      ]
	    },{
			featureType: 'all',
			elementType: 'labels.text.fill',
			stylers: [
				{ lightness: -100 },
				{ gamma: .01 }
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
	var pinsPrivate = rootRef.child('pins');
	pinsRef.on("child_added", function(snapshot) {
		console.log(snapshot.val());
		pins.push(snapshot.val());
		putPin(count, count*200);
		count++;
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
}

function putPin(pinNum, timeout) {
	if (timeout > 5000)
		timeout = 5000;
	window.setTimeout(function() {
		console.log("Working on '" + pins[pinNum].name+ "' at (" + pins[pinNum].lat + "," + pins[pinNum].lng + ").");
		markers.push(new google.maps.Marker({
			position: {lat: pins[pinNum].lat, lng: pins[pinNum].lng},
			icon: 'prayer.ico',
			animation: google.maps.Animation.DROP,
			map: map,
			title: pins[pinNum].name + " > " + pins[pinNum].prayeeName,
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
	var contentString = "<div style='background-image: url(\"logo-light.png\");background-repeat:no-repeat;background-size:contain;background-position: center;'><div class='row'><strong>" + pins[pinNum].name + "<i style='font-size:10px;'class='material-icons'>keyboard_arrow_right</i>" + pins[pinNum].prayeeName + "</strong><br><p>" + pins[pinNum].story + "</p></div></div>";
	if (infoWindow != undefined) {
		infoWindow.close();
	}
	infoWindow = new google.maps.InfoWindow({
		content: contentString,
		maxWidth: 200
	});
	infoWindow.open(map, markers[pinNum]);
}


//Facebook JS
function facebook() {
	console.log("Starting Facebook");
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
}
