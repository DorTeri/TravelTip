import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const controller = {
    renderWeather
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc
window.onCodeAddress = onCodeAddress
window.onMapClick = onMapClick

function onInit() {
  const loc = renderFilterByQueryStringParams()
  setParams(+loc.lat, +loc.lng)
  mapService
    .initMap(+loc.lat, +loc.lng)
    .then(() => {
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
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onMapClick(ev) {
  mapService.getClickedLoc(ev).then(locService.save).then(renderLocs)
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  const url = window.location.href
  navigator.clipboard.writeText(url)
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      mapService.panTo(pos.coords.latitude, pos.coords.longitude)
      mapService
        .codeLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        .then((address) => {
          document.querySelector('.user-pos').innerText = address
        })
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
     <button class="btn-remove" onclick="onRemoveLoc('${loc.id}')">X</button>
     <h3>${loc.name}</h3>
     <button class="btn-go" onclick="onPanTo('${loc.latLng.lat}' , '${loc.latLng.lng}')">Fly There <i class="fa-solid fa-rocket"></i></button>
     <p class="created-time"><span>Created at:</span> ${loc.createdAt}</p>
     <p class="coords"><span>Coords:</span>${loc.latLng.lat},${loc.latLng.lng}</p>
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
    lat: queryStringParams.get('lat') || 32.0227775,
    lng: queryStringParams.get('lng') || 34.8676452,
  }
  return loc
}

function renderWeather(weather) {
    const elWeather = document.querySelector('.weather')
    const strHTML = `<div><h3>${weather.name}</h3><p>${weather.weatherDesc}</p>
    <p>Temp: ${weather.temp}</div>`
    console.log('strHTML', strHTML)
    elWeather.innerHTML = strHTML
}
