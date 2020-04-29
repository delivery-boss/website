// Dom7
var $$ = Dom7;
 
 //Distance Calculation
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA_gnTxfwtkxKZh3Q00PiINNv9wo_UsCLc",
    authDomain: "delivery-boss-app.firebaseapp.com",
    databaseURL: "https://delivery-boss-app.firebaseio.com",
    projectId: "delivery-boss-app",
    storageBucket: "delivery-boss-app.appspot.com",
    messagingSenderId: "302420465233",
    appId: "1:302420465233:web:4e407eb9833299b0be8a70",
    measurementId: "G-N6Q4L1PEXF"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

//View dispatch data
var text = "";
db.collection("app").where('verified', '==', 'Yes').where('status', '==', 'open').onSnapshot(querySnapshot => {
	document.getElementById("all-media-list").innerHTML = querySnapshot.docs
	.map(doc => doc.data())
	.map(data => ({
		...data,
		distance: calcDistance(data.lat, data.lng)
	}))
	.sort((a, b) => a.distance - b.distance)
	.map(data => `
	<li data-lat="${data.lat}" data-lng="${data.lng}">
	<div class="card demo-card-header-pic">
	  <div style="background-image:url('${data.profileURL}')" valign="bottom" class="card-header"></div>
	  <div class="card-content card-content-padding">
	  <div class="item-inner">
	  <div class="dispatch-item rider-name">${data.ridername}</div>
	  </div>
	  <p id="distance">${data.distance.toFixed(5)} km away<\/p>
	  <div class="item-title rider-location">${data.location}</div>
	  </div>
	  <div class="card-footer"><a href="" class="popup-open" data-popup=".popup-push" ><i id="riderDetails" data-profileURL="${data.profileURL}" data-ridername="${data.ridername}" data-phone="${data.phone}" data-plate="${data.plate}" data-id="${data.id}" data-payment="${data.payment}" data-delivery="${data.delivery}" data-lat="${data.lat}" data-lng="${data.lng}" class="material-icons">pageview</i></a></div>
	  </div>
  </li>
	`)
	// .join('<hr>\n');
	var isDispatchAvailable = document.querySelector('#all-media-list').hasChildNodes();
	if (isDispatchAvailable === true){ 
		
		$$(".se-pre-con").hide();

		// setInterval(function(){ 
			if(document.getElementById("distance").innerHTML==="NaN km away"){
				// alert("Distance not found");
				document.querySelector("#failed-gps").click();
				// alert('No location');
			}
		// }, 5000);
		
			// alert("Location not found! Recheck location?");
			// cordova.plugins.diagnostic.restart(handleError, false);	
	}else if (isDispatchAvailable === false){
		$$(".se-pre-con").show();
	}

})


//scan area for riders
document.querySelector("#scan-area").addEventListener('click', ()=>{
	location.reload();
})
document.querySelector("#scan-area-modal").addEventListener('click', ()=>{
	location.reload();
})


var lat1, lon1;
//map.zoomControl.setPosition('bottom-left');
//When the location is found

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(showPosition);
	} else {
		x.innerHTML = "Geolocation is not supported by this browser.";
	}
}

getLocation();

function showPosition(position) {
	lat1 = position.coords.latitude;
	lon1 = position.coords.longitude;
	console.log(lat1);
	console.log(lon1);

	//console.log('Location enabled');
	//console.log("Latitude: " + position.coords.latitude + "Longitude:"  + position.coords.longitude)
}

//When the location throws an error
function onLocationError(e) {
	alert(e.message);
}

function calcDistance(lat2, lon2) {

	function toRad(x) {
		return x * Math.PI / 180;
	}

	var R = 6371; // km 
	var dLat = toRad(lat2 - lat1);
	var dLon = toRad(lon2 - lon1);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;
}


//view the info of a single rider
const viewRiderDetails = document.querySelector(".all-dispatch");
viewRiderDetails.addEventListener('click', evt => {

	if (evt.target.id === 'riderDetails') {
		document.getElementById('profileURL').src = evt.target.getAttribute('data-profileURL');
		document.getElementById('pr-ridername').innerHTML = evt.target.getAttribute('data-ridername');
		document.getElementById('pr-plate').innerHTML = evt.target.getAttribute('data-plate');
		document.getElementById('pr-phone').href = 'tel:+233' + evt.target.getAttribute('data-phone');
		// document.getElementById('pr-call').innerHTML = '+233' + evt.target.getAttribute('data-phone');
		document.getElementById('pr-id').innerHTML = evt.target.getAttribute('data-id');
		document.getElementById('pr-payment').innerHTML = evt.target.getAttribute('data-payment');
		document.getElementById('pr-delivery').innerHTML = evt.target.getAttribute('data-delivery');
		document.getElementById('pr-chat').href = 'https://api.whatsapp.com/send?phone=+233' + evt.target.getAttribute('data-phone') + '&' + 'text=' + 'https://www.google.com/maps/place/' + lat1 + ',' + lon1;
	}
})


// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
	theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
	id: 'io.framework7.testapp',
	root: '#app',
	theme: theme,
	data: function() {
		return {
			user: {
				firstName: 'John',
				lastName: 'Doe',
			},
		};
	},
	on: {
		pageInit: function () {

			function onRequestSuccess(success){
				console.log("Successfully requested accuracy: "+success.message);
			}
			
			function onRequestFailure(error){
				console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
				if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
					if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
						cordova.plugins.diagnostic.switchToLocationSettings();
					}
				}
			}
			
			cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
		}
	  },
	methods: {
		helloWorld: function() {
			app.dialog.alert('Hello World!');
		},
	},
	routes: routes,
	popup: {
		closeOnEscape: true,
	},
	sheet: {
		closeOnEscape: true,
	},
	popover: {
		closeOnEscape: true,
	},
	actions: {
		closeOnEscape: true,
	},
	vi: {
		placementId: 'pltd4o7ibb9rc653x14',
	},
});

app.on('connection', function (isOnline) {
	if (isOnline) {
	  console.log('app is online now');
	} else {
	  //scan network
		document.querySelector("#failed-network").click();
		document.querySelector("#scan-network-modal").addEventListener('click', ()=>{
			location.reload();
		})
	}
  });