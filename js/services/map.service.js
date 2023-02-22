export const mapService = {
    initMap,
    addMarker,
    panTo,
    codeAddress
}

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            gMap.addListener("click", (ev) => {
                console.log(JSON.stringify(ev.latLng))
            })
        })
}

function codeAddress(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == 'OK') {
                const loc = JSON.parse(JSON.stringify(results[0].geometry.location))
                panTo(loc.lat, loc.lng)
                resolve({latLng: loc , name: address})
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
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
    console.log(lat)
    console.log(lng)
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