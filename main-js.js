//Startup Script for Prayer Counter
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
setTimeout(function(){
	feed.run();
}, 2000);

//Startup Script for Prayer Counter
$('#odometer').ready(function(){
	var count = 163;
	var selector = document.querySelector('#odometer');
	odometer = new Odometer({
		el: selector,
		value: 0,
		duration: 3000,
		format: ''
	});
	odometer.update(count);
	setInterval(function(){
		count ++;
		odometer.update(count);
	}, 3000);
});

//Materialize and smooth scroll initializations
$(document).ready(function(){
	setTimeout(function () {
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
		//This is supposed to make the map occupy 100% of the window and nothing more
		//but it doesn't seem work without the height 100%. :(
		//$('.map-canvas').height($(window).height( ) - 64);
		//This is for smooth scrolling.
		//Smooth Scrolling interferes with Materiaz's close modal HTML method.
		//FIXED-Make sure any close buttons don't have a href atribute specified.
		$('.smoothScroll').smoothScroll();
	}, 1000);
});

//Script for location selector map
var locatorMap;
var locatorMarker;
var latLng = {lat: 46.046570,lng: -118.390621};
//This function initializes the map once it it actually visible.
//  Aparently the maps don't like to be initialized while they are hidden.
function checkMapVisible() {
	var interval = setInterval(function () {
	  if($('#locationMap').is(':visible')) {
	    // visible, do something
	    clearInterval(interval);
	    readyLocatorMap();
	  }
	}, 200);
}
function readyLocatorMap() {
	console.log("making Locator Map");
	var mapOptions = {
		backgroundColor: "#FFF",
		center: latLng,
		zoom: 14,
		disableDefaultUI: true,
		scrollwheel: false
	};
	locatorMap = new google.maps.Map(document.getElementById('locationMap'), mapOptions);
	locatorMarker = new google.maps.Marker({
		position: latLng,
		map: locatorMap,
		draggable: true,
		title: "Your Choosen Location"
	});
}
//This is an array of Google markers it will be populated when the map finishes initializing.
var markers = [];
var pins = [
	["Home!","Walla Walla University", 46.046568, -118.390622],
	["Fred","School's tuff!", 46.047782, -118.340123],
	["George","Things don't allways go as planned.", 46.041486, -118.398145],
	["Allisyn","Why do bad things happen.", 46.046632, -118.391521],
	["Bob","Why is life in general hard to cope with.", 46.041023, -118.393452],
	["Brittney","My grandma is going through tuff times.", 46.046781, -118.398952]
];
var wallaWalla = new google.maps.LatLng(46.046570, -118.390621); // (zoom 13)
var unitedStates = new google.maps.LatLng(38.96370424778, -98.26366787500001); //United States (Zoom 4)
var world = new google.maps.LatLng(9.281074119839158, 23.201175874999958);//Zoom 2
var map;
function initialize() {
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
    //Put all the pins down.
    setTimeout(function() {
    	for (var i = 0; i < pins.length; i++) {
    		putPin(i, i*200);
    	}
    }, 1000);
}
function putPin(pinNum, timeout) {
	window.setTimeout(function() {
		console.log("Working on '" + pins[pinNum][0]+ "' at (" + pins[pinNum][2] + "," + pins[pinNum][3] + ").");
		markers.push(new google.maps.Marker({
			position: {lat: pins[pinNum][2], lng: pins[pinNum][3]},
			icon: 'prayer.ico',
			animation: google.maps.Animation.DROP,
			map: map,
			title: pins[pinNum][0],
			zIndex: pinNum
		}));
	}, timeout);
}
google.maps.event.addDomListener(window, 'load', initialize);