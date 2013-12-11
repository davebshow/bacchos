var mapInit = function() {
    var initLat = 44;
    var initLng = 90;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            initLat = position.coords.latitude;
            initLng = position.coords.longitude;
            wineMap(initLat, initLng);
        },
        function(err) {
            console.log(err);
            wineMap(initLat, initLng);
        }, 
        {maximumAge: 1});
    } else {
        wineMap(initLat, initLng);            
    }
}


wineMap = function(initLat, initLng) {


    // autosize div height
    var window_height = $(window).height();
    var canvas_height = window_height - 20;
    $('#container').height(canvas_height);
    $(window).resize(adjustMapSize);


    // instantiate map
    var map = L.map('map').setView([initLat, initLng], 8);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // fire up them sockets
    var socket = io.connect('http://localhost', {secure: false});
    socket.on('connect', function() {
        console.log('Socket connection established');
    });


    // when server sends wine data show it in sidebar
    socket.on('wines', displayWines);


    socket.on('winery', function(data) {
        console.log(data);
    });


    // these are map popups
    var popup = L.popup();


    // show lat and lng when you click on the map
    map.on('click', onMapClick);


    // find wine stores by zipcode on user form submit
    $('#zipcode-form').submit(zipcodeQuery);


    // get a stores wines when user clicks the wines button
    $(document).on('click', '.store-button', storeQuery);


    // get a wines winery info - not finished
    $(document).on('click', '.wine-button', function() {
        var wineId = $(this).data('wineid');
        var wineryId = $(this).data('wineryid');
        console.log(wineId)
        console.log(wineryId)
        var data = {wineid: wineId, wineryid: wineryId}
        socket.emit('wineryId', data);
    });


    // insert the wine info html into the info column
    function displayWines(wines) {
        // handle strange errors
        if (wines == 'No wines located for this store') {
            var newContent = '<div class="info-column-content">' + wines;
        } else {
            var newContent = '<div id="wine-box" class="info-column-content">'
            for (var i=0; i<wines.length; i++) {
                var wine = wines[i]; 
                var name = wine.name;
                var wineId = wine.code;
                var vintage = wine.vintage;
                var varietal = wine.varietal;
                var winery = wine.winery;
                var wineryId = wine.winery_id;
                var wineDetails = name + '<br>' + vintage + ' ' + varietal; 
                var wineryDetails = ' - '+ '<input type="button" class="wine-button" data-wineryid=' + wineryId + ' data-wineid=' + wineId + ' value=' + winery  + '/><br><br>';
                var newContent = newContent + wineDetails + wineryDetails;
                console.log(wineryDetails)
            }
        }
        newContent = newContent + '</div>'
        if (!document.getElementById('wine-box')) {
            $('#info-column').append(newContent);
        } else {
            console.log('replace')
            $('#wine-box').replaceWith(newContent);
        }
    };


    // keep the same map proportions if you adjust the wine size
    function adjustMapSize() {
        var window_height = $(window).height();
        var canvas_height = window_height - (window_height/20);
        $('#container').height(canvas_height);

    };


    // pop up a lat lng box when you click the map
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(e.latlng.toString())
            .openOn(map);
    };


    // query the server for a zip code upon user form input
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
    };// zipcode submit


    // query the server for a store's wine inventory
    function storeQuery() {
        var zipcode = $(this).data('zipcode');
        var storeId = $(this).data('storeid');
        socket.emit('storeId', {zip: zipcode, store: storeId});
    };


    // query the server about
    function wineryQuery(e) {
        console.log('click');
    }


    function addStoreMarkers(data, textStatus, jqXHR) {
        socket.emit('storeData', data);
        var zipcode = data.zip;   
        var storeData = data.stores;
        //console.log('adding markers');
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
                    var lat = store.lat;
                    var lng = store.lng;
                    latArray.push(lat);
                    lngArray.push(lng);
                } else {
                    console.log(loc);
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
    };

    // function addWineMarker

    // addArcs hmmm don't know how exactly leaflet API

    function handleAjaxError(data, textStatus, jqXHR) {
        console.log(textStatus);
        console.log(jqXHR.status);
    };
} // winemap