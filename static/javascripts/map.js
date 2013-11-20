function init(data) {

    var map = L.map('map').setView([42, -82], 5);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    if (data.length>0) {
        for (var i=0; i<data.length; i++) {
            console.log(data[i]);
            var marker = L.marker([data[i].lat, data[i].lng]).addTo(map);
            marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
        }
    }

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(e.latlng.toString())
            .openOn(map);
    }
        
    map.on('click', onMapClick);
}
