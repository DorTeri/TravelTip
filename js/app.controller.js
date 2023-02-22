import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))
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

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs)
    renderLocs(locs)
    // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords)
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}
function onPanTo(latLng) {
  console.log('Panning the Map')
  mapService.panTo(latLng.lat, latLng.lng)
}

function onRemoveLoc(id) {
  locService.removeLoc(id)
}

function renderLocs(locs) {
  console.log(locs)
  let strHTMLs = locs
    .map((loc) => {
    return `<div class="location"> 
     <h3>${loc.name}</h3>
     <p>${loc.createdAt}</p>
     <p>Coords:${loc.latLng.lat},${loc.latLng.lng}</p>
     <button onclick="onPanTo('${loc.latLng}')">?</button>
     <button onclick="onRemoveLoc('${loc.id}')">X</button>
     </div>`
    })
    console.log(strHTMLs)
  document.querySelector('.locs').innerHTML = strHTMLs.join('')
}
