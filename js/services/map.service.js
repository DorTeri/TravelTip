export const mapService = {
    initMap,
    addMarker,
    panTo,
    codeAddress,
    codeLatLng,
    getClickedLoc
}


// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            gMap.addListener("click", onMapClick)
        })
}

function getClickedLoc(ev) {
    return codeLatLng(JSON.parse(JSON.stringify(ev.latLng)))
        .then(name => ({ name, latLng: JSON.parse(JSON.stringify(ev.latLng)) }))
}

function codeAddress(address) {
    return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == 'OK') {
                const loc = JSON.parse(JSON.stringify(results[0].geometry.location))
                panTo(loc.lat, loc.lng)
                resolve({ latLng: loc, name: address })
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        })
    })
}

function codeLatLng(latlng) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder()
        geocoder
            .geocode({ location: latlng })
            .then((response) => {
                const address = response.results[1].formatted_address
                resolve(address)
            })
    })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAkv6uHzL1yR1owAMmi_Gg-TOS9H-RVNbs' //Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}