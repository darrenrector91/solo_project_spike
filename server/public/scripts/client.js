var app = angular.module('myApp', []);

app.service('Map', function($q) {
    
    this.init = function() {
        var options = {
            center: new google.maps.LatLng(41.850033, -97.992272),
            zoom: 13,
            disableDefaultUI: true    
        }
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    }
    
    this.search = function(str) {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results[0]);
            }
            else d.reject(status);
        });
        return d.promise;
    }
    
    this.addMarker = function(res) {
        if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(res.geometry.location);
    }
    
});

app.controller('newPlaceCtrl', function(self, Map) {
    
    self.place = {};
    
    self.search = function() {
        self.apiError = false;
        Map.search(self.searchPlace)
        .then(
            function(res) { // success
                Map.addMarker(res);
                self.place.name = res.name;
                self.place.lat = res.geometry.location.lat();
                self.place.lng = res.geometry.location.lng();
            },
            function(status) { // error
                self.apiError = true;
                self.apiStatus = status;
            }
        );
    }
    
    self.send = function() {
        alert(self.place.name + ' : ' + self.place.lat + ', ' + self.place.lng);    
    }
    
    Map.init();
});