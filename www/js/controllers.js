angular.module('starter.controllers', ['ionic', 'ngCordova'])

  .controller('DashCtrl', function ($scope, $cordovaGeolocation, GeoService, $interval) {

    // SET VARS
    $scope.allLocationsFound = false;

    // INITILIASE MAP
    var mapOptions = {
      center: { lat: 51.45484, lng: -2.594288 },
      zoom: 16
    };
    var map = new google.maps.Map(document.getElementById('geopin-map'), mapOptions);

    // SET LOCATIONS
    var locations = [];
    locations.push({
      name: 'Small street Expresso',
      position: {
        lat: 51.45484,
        lng: -2.594288,
      },
      found: false
    });
    locations.push({
      name: 'Full Court Press',
      position: {
        lat: 51.455170,
        lng: -2.593258,
      },
      found: false
    });
    locations.push({
      name: 'Playground Coffee House',
      position: {
        lat: 51.453761,
        lng: -2.594772,
      },
      found: false
    });

    // SET INFO WINDOWS
    var infoWindow = new google.maps.InfoWindow();
    $scope.foundLocations = 0;
    for (var i = 0; i < locations.length; i++) {
      if(locations[i].found){
        $scope.foundLocations++
      }
      if($scope.foundLocations == 3)
        $scope.allLocationsFound = true;
      var location = locations[i];
      var marker = new google.maps.Marker({
        position: { lat: location.position.lat, lng: location.position.lng },
        map: map,
        animation: google.maps.Animation.DROP,
        title: location.name,
        zIndex: location[3]
      });
      (function (marker, location) {
        google.maps.event.addListener(marker, "click", function (e) {
          //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
          infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + location.name + "</div>");
          infoWindow.open(map, marker);
        });
      })(marker, location);
    }

    // GET LOCATION EVERY SECOND
    $interval(getPosition, 1000);

    //SHOW CURRENT POSITION ON THE MAP
    function showMap(coords) {
      var mapOptions = {
        center: { lat: coords.latitude, lng: coords.longitude },
        zoom: 16
      };
      var marker = new google.maps.Marker({
        position: { lat: coords.latitude, lng: coords.longitude },
        map: map
      });
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    }

    // RETRIEVE CURRENT POSITION
    function getPosition() {
      GeoService.getPosition()
        .then(function (position) {
          $scope.coords = position.coords;
          showMap(position.coords);

        }, function (err) {
          console.log('getCurrentPosition error: ' + angular.toJson(err));
        });
    }

    // MATCH CURRENT POSITION WITH MARKERS
    function matchMarkers(position) {
      for (i = 0; i < locations.length; i++) {
        if (locations[i].position.lat === coords.latitude && locations[i].position.lng === coords.longitude) {
          locations[i].found = true;
        }
      }
    }

  });
