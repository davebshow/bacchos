var mapInit = function() {
    var window_height = $(window).height();
    var canvas_height = window_height - (window_height/8);
    $('#map').height(canvas_height);

    var map = L.map('map').setView([42, -88], 5);
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
            type: 'post',
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
            for (var i=0; i<data.length; i++) {
                var marker = L.marker([data[i].lat, data[i].lng]).addTo(map);
                marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
            }
        }
    }

    function handleAjaxError(data, textStatus, jqXHR) {
        console.log(textStatus);
        console.log(jqXHR.status);
    }

}; // init


