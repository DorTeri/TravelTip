import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc
window.onCodeAddress = onCodeAddress

function onInit() {
    mapService
        .initMap()
        .then(() => {
            console.log('Map is ready')
            renderLocs()
        })
        .catch(() => console.log('Error: cannot init map'))
}

function onCodeAddress(ev) {
    ev.preventDefault()
    const address = document.querySelector('input[name="address"]').value
    mapService.codeAddress(address)
        .then(locService.save)
        .then(renderLocs)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

// function onGetLocs() {
//     locService.getLocs().then((locs) => {
//         console.log('Locations:', locs)
//         renderLocs(locs)
//     })
// }

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            console.log('User position is:', pos.coords)
            document.querySelector(
                '.user-pos'
            ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch((err) => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat, lng) {
    mapService.panTo(+lat, +lng)
}

function onRemoveLoc(id) {
    locService.removeLoc(id)
    renderLocs()
}

function renderLocs() {
    locService.getLocs().then((locs) => {
        let strHTMLs = locs.map((loc) => {
            return `<div class="location"> 
     <h3>${loc.name}</h3>
     <p>Created at: ${loc.createdAt}</p>
     <p>Coords:${loc.latLng.lat},${loc.latLng.lng}</p>
     <button onclick="onPanTo('${loc.latLng.lat}' , '${loc.latLng.lng}')">Take me there</button>
     <button onclick="onRemoveLoc('${loc.id}')">X</button>
     </div>`
        })
        document.querySelector('.locs').innerHTML = strHTMLs.join('')
    })
}
