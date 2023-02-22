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
 const loc = renderFilterByQueryStringParams()
//  console.log(loc)
    mapService
    .initMap(+loc.lat,+loc.lng)
    .then(() => {
      console.log('Map is ready')
      renderLocs()
    })
    .catch(() => console.log('Error: cannot init map'))
}

function onCodeAddress(ev) {
  ev.preventDefault()
  const address = document.querySelector('input[name="address"]').value
  mapService.codeAddress(address).then(locService.save).then(renderLocs)
  document.querySelector('input[name="address"]').value = ''
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
 const queryStringParams = new URLSearchParams(window.location.search)
 navigator.clipboard.writeText(queryStringParams)
}

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
  setParams(lat, lng)
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

function setParams(lat, lng) {
  const queryStringParams = `?lat=${lat}&lng=${lng}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const loc = {
    lat: queryStringParams.get('lat'),
    lng: queryStringParams.get('lng'),
  }
  return loc
}
