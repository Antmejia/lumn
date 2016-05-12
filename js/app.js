(function() {
    'use strict';
    angular
        .module('lumn', ['ngMaterial'])
        .controller('search', DemoCtrl);

    function DemoCtrl($timeout, $q, $log, $mdToast, $scope) {
        var self = this;
        self.simulateQuery = true;
        self.isDisabled = false;
        self.allCities = loadAll();
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.coords = coords;
        // ******************************
        // Internal methods
        // ******************************
        /**
         * Search for allCities... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch(query) {
            var results = query ? self.allCities.filter(createFilterFor(query)) : self.allCities,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function() {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            if (item.id) {
                alert("id: " + item.id);
                getWeather(item, "cityID");
            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Oops! ' + item.city + ', ' + item.state + ' is currently unavailable')
                    .hideDelay(4000)
                    .theme("error")
                );
            }
        }
        /**
         * Build `components` list of key/value pairs
         */
        function loadAll() {
            var allCities = cities;
            return allCities.map(function(cityItem) {
                cityItem.value = cityItem.city.toLowerCase();
                return cityItem;
            });
        }
        /**
         * Get Weather
         */         
         function getWeather(value, method) {
            var url = "";
            // Determine the method of getting weather results ?
            // Set the URL to the appropriate one
            // Call the api with the URL and handle the callback
            // -- Animate away all the unnecessary stuff
            // -- Use ng-include to add our template and animate data in
            if (method === "cityID") {
                url = "http://api.openweathermap.org/data/2.5/weather?id=" + value.id;
                alert(url);
                confirm(value.city + ", " + value.state + " - " + method);
            }
           else if (method === "geo") {               
                url = "http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139" + value;
                confirm(url);
            }
            else {
                alert("sorry");
            }
        }
        
        function coords() {
            if (navigator.geolocation) { 
                navigator.geolocation.getCurrentPosition(showPosition, showError);          
             } 
             else { 
                 $mdToast.show(
                     $mdToast.simple()
                     .textContent("Your browser doesn't support this feature")
                     .hideDelay(4000)
                     .theme("error")
                );
             } 
             
             function showPosition(position) {
                 alert("Latitude: " + position.coords.latitude + "\nLongitude: " + position.coords.longitude);
                 getWeather("testlat, testlon", "geo");
             }
             
              function showError(error) {
	              var msg;
                  switch(error.code) {
                      case error.PERMISSION_DENIED:
                          msg = "User denied the request for Geolocation."
                      break;
                      case error.POSITION_UNAVAILABLE:
                          msg = "Location information is unavailable."
                      break;
                      case error.TIMEOUT:
                          msg = "The request to get user location timed out."
                      break;
                      case error.UNKNOWN_ERROR:
                          msg = "An unknown error occurred."
                      break;
                  }
                 $mdToast.show(
                     $mdToast.simple()
                     .textContent(msg)
                     .hideDelay(4000)
                     .theme("error")
                 );
             }              
         }
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }
    }
})();