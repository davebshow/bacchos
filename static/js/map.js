var mapInit = function(callback) {
    var initLat = 44;
    var initLng = 90;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            initLat = position.coords.latitude;
            initLng = position.coords.longitude;
            callback(initLat, initLng);
        },
        function(err) {
            console.log(err);
            callback(initLat, initLng);
        }, 
        {maximumAge: 1});
    } else {
        callback(initLat, initLng);            
    }
}


wineMap = function(initLat, initLng) {
    var window_height = $(window).height();
    var canvas_height = window_height - 20;
    $('.dynamic-map').height(canvas_height);
    var map = L.map('map').setView([initLat, initLng], 8);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var socket = io.connect('http://localhost', {secure: false});
    socket.on('connect', function() {
        console.log('Socket connection established');
    });

    socket.on('wines', function(wines) {
        console.log('got wines');
            var newDiv = '<div id="wine-box">';
            for (var i=0; i<wines.length; i++) {
                var wine = wines[i]; 
                var name = wine.name;
                var newDiv = newDiv + name + '<br>'
        
            }
            newDiv = newDiv + '</div>';
        console.log(newDiv);
        $('#map-wrapper').append(newDiv);

    });

    $(window).resize(adjustMapSize); 

    var popup = L.popup();

    map.on('click', onMapClick);

    $('#zipcode-form').submit(zipcodeQuery);

    $(document).on('click', '.store-button', storeQuery);

    function adjustMapSize() {
        var window_height = $(window).height();
        var canvas_height = window_height - (window_height/20);
        $('.dynamic-map').height(canvas_height);
    }

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(e.latlng.toString())
            .openOn(map);
    }

    function zipcodeQuery(e) {
        var zipcode = $(this).serialize();
        var formURL = $(this).attr("action");
        $.ajax({
            url: formURL,
            type: 'get',
            data: zipcode,
            dataType: 'json',
            success: addStoreMarkers,
            error: handleAjaxError
        }); // ajax
        e.preventDefault(); //STOP default action
    } // zipcode submit

    function storeQuery() {
        var zipcode = $(this).data('zipcode');
        var storeId = $(this).data('storeid');
        console.log(zipcode, storeId);
        socket.emit('storeId', {zip: zipcode, store: storeId});
    }


    function addStoreMarkers(data, textStatus, jqXHR) {
        socket.emit('storeData', data);
        var zipcode = data[0];   
        var storeData = data[1];
        console.log('adding markers')
        if (storeData.length>0) {
            var latArray = [];
            var lngArray = [];
            for (var i=0; i<storeData.length; i++) {
                var store = storeData[i];
                var storeId = store.id;
                var name = store.name;
                var address = store.address;
                var city = store.city;
                var state = store.state;
                var country = store.country;
                var loc = address + ', ' + city + ', ' + state + ', ' + country;

                if (store.lat && store.lng) {
                    //console.log('coord');
                    var lat = store.lat;
                    var lng = store.lng;
                    latArray.push(lat);
                    lngArray.push(lng);
                } else {
                    //console.log(loc);
                }

                // NEED TO CLEAN UP HERE TO REDUCE REPITION

                if (store.num_wines>0) { // THIS IF JUST FOR TESTING
                    var marker = L.marker([lat, lng]).addTo(map);
                    // this is gonna need a bunch of ifs to avoid empty
                    if (store.url) {
                        var popupHTML = "<b><a href=" + store.url + ">" + name +"</a></b><br>" + loc;
                    } else {
                        var popupHTML = "<b>" + name + "</b><br>" + loc;
                    }  
                

                    marker.bindPopup(popupHTML);
                    var pop = marker._popup
                    if (store.num_wines>0) {
                        var storeForm = "<input class='store-button' type='button' value='wines' data-storeid=" + storeId.toString() + " data-zipcode=" + zipcode + " ></input>"
                        console.log(storeForm);
                        var newContent = popupHTML + "<br>" + storeForm;
                        pop.setContent(newContent);
                        marker.setOpacity('10');
                    } else {
                        marker.setOpacity('1');
                    }
                }//TESTING IF
            } 
            var latSum = latArray.reduce(function(a, b) {return parseFloat(a) + parseFloat(b)});
            var avgLat = latSum/latArray.length;

            var lngSum = lngArray.reduce(function(a, b) {return parseFloat(a) + parseFloat(b)});
            var avgLng = lngSum/lngArray.length;
            //console.log('New Center:', avgLat, avgLng);
            map.panTo(new L.LatLng(avgLat, avgLng)).setZoom(10);
        }
    }

    // function addWineMarker

    // addArcs hmmm don't know how exactly leaflet API

    function handleAjaxError(data, textStatus, jqXHR) {
        console.log(textStatus);
        console.log(jqXHR.status);
    }
} // winemap