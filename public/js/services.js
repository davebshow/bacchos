var bacchosServices = angular.module('bacchosServices', []).

     factory('mapService', function () {
        return {
            processStores: processStoreMarkers
        }
    });
     

// this will go in jscript utils
var processStoreMarkers = function(data) {
    var   latArray = []
    ,     lngArray = []
    ,     markers = {};
    for (var i=0; i<data.length; i++) {
        var store = data[i]
        ,   storeId = store.id
        ,   name = store.name
        ,   address = store.address
        ,   city = store.city
        ,   state = store.state
        ,   country = store.country
        ,   loc = address + ', ' + city + ', ' + state + ', ' + country
        ,   opacaity
        ,   message;
        if (name && store.lat && store.lng) {
            var lat = parseFloat(store.lat)
            ,   lng = parseFloat(store.lng);
            latArray.push(lat);
            lngArray.push(lng);
            name = name.replace(/\W/g, '');
            markers[name] = {lat: lat, lng: lng, focus:true, draggable:false};
            if (store.url) {
                message = "<b><a href=" + store.url + ">" + name +"</a></b><br>" + loc;
            } else {
                message = "<b>" + name + "</b><br>" + loc;
            }
            if (store.num_wines>0) {
                var winesButton = "<button class='btn btn-link' type='submit'>wines</button>";
                message = message + "<br>" + winesButton;
                opacity = '10';
            } else {
                opacity = '1';
            }  
            markers[name]['message'] = message;
            markers[name]['opacity'] = opacity;
        } else {
            console.log('need geolocation for', loc);
        }
    }
    var latSum = latArray.reduce(function (a, b) {return a + b})
    ,   centerLat = latSum/latArray.length
    ,   lngSum = lngArray.reduce(function (a, b) {return a + b})
    ,   centerLng  = lngSum/lngArray.length
    ,   outputData = {markers: markers, centerLat: centerLat, centerLng: centerLng}; 
    return outputData
}
