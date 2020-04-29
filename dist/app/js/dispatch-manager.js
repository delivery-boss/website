
		//var map = L.map('map').fitWorld();
		//Create new map
		var map = L.map("map", {
			zoomControl: false
			//... other options
		});


		// Create full-layout notification to inform the user upon successfull submission
		var submitNotification = app.notification.create({
		icon: '<i class="icon material-icons">add_alert</i>',
		title: 'Dispatch Boss',
		//titleRightText: 'now',
		subtitle: 'Submission Notice',
		text: 'Hello, your submission was successfull!',
		closeTimeout: 3000,
		});


		// Create full-layout notification to inform the user upon failed submission
		var failedNotification = app.notification.create({
		icon: '<i class="icon material-icons">warning</i>',
		title: 'Dispatch Boss',
		//titleRightText: 'now',
		subtitle: 'Submission Notice',
		text: 'Hello, your submission failed. Please try again later!',
		closeTimeout: 3000,
		});
		

		
		//map.zoomControl.setPosition('bottom-left');
		//When the location is found
		function onLocationFound(e) {
			var radius = e.accuracy / 2;
			var lat = e.latlng.lat;
			var lng = e.latlng.lng;

			var getLocationError = app.notification.create({
				icon: '<i class="icon material-icons">warning</i>',
				title: 'Dispatch Boss',
				//titleRightText: 'now',
				subtitle: 'Location Error',
				text: 'Your location cannot be determined',
				close: true,
				});

			function getLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.watchPosition(showPosition);
			} else { 
				getLocationError.open();
			}
			}
			
			getLocation();

			function showPosition(position) {
			console.log('Location enabled');
			console.log("Latitude: " + position.coords.latitude + "Longitude:"  + position.coords.longitude)
			}
			


			L.marker(e.latlng).addTo(map)
				.bindPopup("You are within " + radius + " meters from this point").openPopup();

			L.circle(e.latlng, radius).addTo(map);


			document.getElementById("submitButton").addEventListener("click", function(){
				var dateSubmit = new Date();
				var userName = document.querySelector("#name").value;
				//console.log(date);
				db.collection("webmucho").doc(userName).set({
					    name: userName,
						email: document.querySelector("#emailCompany").value,
						url: document.querySelector("#url").value,
						phone: document.querySelector("#phone").value,
						status: document.querySelector("#dis-availability").value,   
						bio: document.querySelector("#bio").value,
						lat: lat,
						lng: lng,
                        time: dateSubmit
                    }).then(function() {
						submitNotification.open();
                    }).catch(function() {
                        failedNotification.open();
                    })
			});
			
		}
		
		//When the location throws an error
		function onLocationError(e) {
			//alert(e.message);
			var locError = app.notification.create({
				icon: '<i class="icon material-icons">warning</i>',
				title: 'Dispatch Boss',
				//titleRightText: 'now',
				subtitle: 'Location Error Notice',
				text: e.message,
				closeButton: true,
				});
				locError.open();
		}
		
		map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);

		map.locate({setView: true, maxZoom: 16});
