//Function that runs after map loads
function initializeTheRest() {
	console.log("removing Event Listener");
	google.maps.event.clearInstanceListeners(map);
	console.log("initializing the rest");
	//start counter
	startCounter();
	//activate modal
	$('.modal-trigger').leanModal({
		//Form Assistance Javascript.
		ready: function() {
		  $('ul.tabs').tabs('select_tab', 'Step1');
		  checkMapVisible();
		}
	});
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
	//Twiter Tweet Button Magic (TBH It really doesn't do anything)
	//!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
}
//Delaration for instafeed.
var feed = new Instafeed({
    get: 'tagged',
    tagName: 'prayitforward',
    clientId: '5706aa1ac7e84d609a8fd426259749be',
    limit: 12,
    //Sorry this has to be a single line. :( Turn word wrap on and you'll be fine.
    template: '<div class="col s6 m6 l4"><div class="card hoverable"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="{{image}}"></div><div class="card-content" style="padding:5px;"><span class="card-title activator grey-text text-darken-4" style="font-size: 18px; line-height:0;"><i class="material-icons tiny" style="color: red;">favorite</i>{{likes}}<i class="material-icons right">more_vert</i></span></div><div class="card-reveal" style="padding: 10px;"><span class="card-title grey-text text-darken-4"><i class="material-icons right">close</i></span><div class="left"><i class="material-icons tiny" style="color: red;">favorite</i>{{likes}}</div><br><a target="_blank" href="{{link}}" style="color:black;"><b>{{model.user.full_name}}</b></a><p>{{caption}}<br><a href="{{link}}" target="_blank">See post in context.</a></p></div></div></div>',
    sortBy: 'most-recent',
    resolution: 'low_resolution'
});


//Startup Script for Prayer Counter
function startCounter() {
	console.log("Starting counter");
	var count = 163;
	var selector = document.querySelector('#odometer');
	odometer = new Odometer({
		el: selector,
		value: 0,
		duration: 3000,
		format: ''
	});
	$('#counter').animate({opacity:1}, 1000);
	odometer.update(count);
	setInterval(function(){
		count ++;
		odometer.update(count);
	}, 3000);
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
		formSubmit();
		return;
	}
	if(visible == 3 ) {
		$("#nextButton").html("Post");
	}
	console.log("Moving from '" + steps[visible] + "' to '" + steps[visible + 1] + "'. ");
	$('ul.tabs').tabs('select_tab', steps[visible +1]);
}
function formSubmit() {
	console.log("postForm() Not implemented yet. Sorry about that folks");
}
//This is an array of Google markers it will be populated when the map finishes initializing.
var markers = [];
var pins = [
	{"name": "Eddie", "prayeeName": "Frank","location": {"lat": 46.046568, "lng": -118.390622}, "story": "Walla Walla University"},
	{"name": "Fred", "prayeeName": "Ritchard","location": {"lat": 46.047782, "lng": -118.340123}, "story": "School's tuff!"},
	{"name": "George", "prayeeName": "Mark","location": {"lat": 46.041486, "lng": -118.398145}, "story": "Things don't allways go as planned. You know those kinds of things won't always work out too well and stuff like that. I'm just really fortunate to be alive and well. I also really think that I'm going to grow up to be a great person today and hopefully that would be okay with all ya'll."},
	{"name": "Allisyn", "prayeeName": "Steve","location": {"lat": 46.046632, "lng": -118.391521}, "story": "Why do bad things happen."},
	{"name": "Bob", "prayeeName": "Joe","location": {"lat": 46.041023, "lng": -118.393452}, "story": "Why is life in general hard to cope with."},
	{"name": "Brittney", "prayeeName": "Kate","location": {"lat": 46.046781, "lng": -118.398952}, "story": "My grandma is going through tuff times."}
];
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
        center: wallaWalla,
        zoom: 13,
        disableDefaultUI: false,
        scrollwheel: false,
        styles: styles
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    map.addListener('tilesloaded',function() {
    	console.log("Starting Intitialize");
    	initializeTheRest();
    });
    //initializeTheRest();
    //Put all the pins down.
    setTimeout(function() {
    	for (var i = 0; i < pins.length; i++) {
    		putPin(i, i*200);
    	}
    }, 1000);
}

function putPin(pinNum, timeout) {
	window.setTimeout(function() {
		console.log("Working on '" + pins[pinNum].name+ "' at (" + pins[pinNum].location.lat + "," + pins[pinNum].location.lng + ").");
		markers.push(new google.maps.Marker({
			position: {lat: pins[pinNum].location.lat, lng: pins[pinNum].location.lng},
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

var infoWindow;

function openInfoMarker(pinNum) {
	var contentString = "<div style='background-image: url(\"logo-light.png\");background-repeat:no-repeat;background-size:contain;background-position: center;'><div class='row'><strong>" + pins[pinNum].name + "<i style='font-size:10px;'class='material-icons'>keyboard_arrow_right</i>" + pins[pinNum].prayeeName + "</strong><br><p>" + pins[pinNum].story + "</p></div></div>";
	infoWindow = null;	
	infoWindow = new google.maps.InfoWindow({
		content: contentString,
		maxWidth: 200
	});
	infoWindow.close();
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
