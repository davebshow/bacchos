var mapInit = function() {
    var window_height = $(window).height();
    var canvas_height = window_height - (window_height/8);
    $('#map').height(canvas_height);

    //geolocation not working
    var initLat = 44;
    var initLng = -90;
    var map = L.map('map').setView([initLat, initLng], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    $(window).resize(adjustMapSize); 

    popup = L.popup();

    map.on('click', onMapClick);

    $('#zipcode-form').submit(zipcodeQuery);


    function adjustMapSize() {
        var window_height = $(window).height();
        var canvas_height = window_height - (window_height/8);
        $('#map').height(canvas_height);
    }

    // ok back to working code
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(e.latlng.toString())
            .openOn(map);
    }

    function zipcodeQuery(e) {
        var postData = $(this).serialize();
        var formURL = $(this).attr("action");
        console.log(postData);
        $.ajax({
            url: formURL,
            type: 'get',
            data: postData,
            dataType: 'json',
            success: addStoreMarkers,
            error: handleAjaxError
        }); // ajax
        e.preventDefault(); //STOP default action
    } // zipcode submit

    function addStoreMarkers(data, textStatus, jqXHR) {
        console.log(textStatus);
        console.log(jqXHR.status);
        if (data.length>0) {
            var latArray = [];
            var lngArray = []
            for (var i=0; i<data.length; i++) {

                var name = data[i].name;
                var address = data[i].address;
                var city = data[i].city;
                var state = data[i].state;
                var country = data[i].country;
                var loc = address + ', ' + city + ', ' + state + ', ' + country;

                if (data[i].lat && data[i].lng) {
                    console.log('coord');
                    var lat = data[i].lat;
                    var lng = data[i].lng;
                    latArray.push(lat);
                    lngArray.push(lng);
                } else {
                    console.log(loc);
                }

                var marker = L.marker([lat, lng]).addTo(map);

                if (data[i].url) {
                    var popupHTML = "<b><a href=" + data[i].url + ">" + name +"</a></b><br>" + loc;
                } else {
                var popupHTML = "<b>" + name + "</b><br>" + loc;
                }  
                marker.bindPopup(popupHTML);
            }
            var latSum = latArray.reduce(function(a, b) {return parseInt(a) + parseInt(b)});
            var avgLat = latSum/latArray.length;

            var lngSum = lngArray.reduce(function(a, b) {return parseInt(a) + parseInt(b)});
            var avgLng = lngSum/lngArray.length;
            console.log(avgLat);
            console.log(avgLng);
            map.panTo(new L.LatLng(avgLat, avgLng));
        }
    }

    // function addWineMarker

    // addArcs hmmm don't know how exactly leaflet API


    function handleAjaxError(data, textStatus, jqXHR) {
        console.log(textStatus);
        console.log(jqXHR.status);
    }

}; // init