window.addEventListener("load", init);
var mapObject;
var OpenedInfoWindow = null;
function init() {
    calculateRoute(null, null);
}

function calculateRoute(from, to) {
    // Center initialized to Montreal
    var myOptions = {
        zoom: 10,
        center: new google.maps.LatLng(45.5050, -73.5667),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Draw the map
    window.mapObject = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    var directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
        origin: from,
        destination: to,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(
        directionsRequest,
        function(response, status)
        {
            if (status == google.maps.DirectionsStatus.OK)
            {
                new google.maps.DirectionsRenderer({
                    map: window.mapObject,
                    directions: response
                });
            }
            else
                $("#error").append("Unable to retrieve your address<br />");
        }
        );
}

$(document).ready(function() {
    // If the browser supports the Geolocation API
    if (typeof navigator.geolocation == "undefined") {
        $("#error").text("Your browser doesn't support the Geolocation API");
        return;
    }

    $("#from-link, #to-link").click(function(event) {
        event.preventDefault();
        var addressId = this.id.substring(0, this.id.indexOf("-"));

        navigator.geolocation.getCurrentPosition(function(position) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            },
            function(results, status) {
                if (status == google.maps.GeocoderStatus.OK)
                    $("#" + addressId).val(results[0].formatted_address);
                else
                    $("#error").append("Unable to retrieve your address<br />");
            });
        },
        function(positionError){
            $("#error").append("Error: " + positionError.message + "<br />");
        },
        {
            enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
        });
    });

    $("#calculate-route").submit(function(event) {
        event.preventDefault();
        calculateRoute($("#from").val(), $("#to").val());
        Convert_LatLng_To_Address($("#to").val(), returnLatLng);

        function returnLatLng() {
            var location = latitude + ',' + longitude;
            $.post( "/DevClubCODE2014/locations.php", {location: location, radius: $("#radius").val()}, function(data) {
                locations = data;
                for (var i = 0; i < locations.length; i++)
                {
                    var myLatLng = new google.maps.LatLng(locations[i]['Latitude'], locations[i]['Longitude']);
                    var infowindow = new google.maps.InfoWindow({
                        content: '<p style="color:blue;">' + locations[i]['DESCRIPTION_RPA'] +'</p>'
                    });
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: window.mapObject

                    });
                    marker.info = infowindow;

                    google.maps.event.addListener(marker, 'click', function() {
                        if (window.OpenedInfoWindow != null)
                            window.OpenedInfoWindow.close();
                        this.info.open(window.mapObject, this);
                        window.OpenedInfoWindow = this.info;
                    });
                }
            },"json");
        }
    });
});

var latitude;
var longitude;

/*
* Get the json file from Google Geo
*/
function Convert_LatLng_To_Address(address, callback) {
    url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false";
    jQuery.getJSON(url, function (json) {
        Create_Address(json, callback);
    });
}

/*
* Create an address out of the json    
*/
function Create_Address(json, callback) {
    if (!check_status(json)) // If the json file's status is not ok, then return
        return 0;
    latitude = json["results"][0]["geometry"]["location"]["lat"];
    longitude = json["results"][0]["geometry"]["location"]["lng"];
    callback();
}

/* 
* Check if the json data from Google Geo is valid 
*/
function check_status(json) {
    if (json["status"] == "OK") return true;
    return false;
}