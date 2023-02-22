export const locService = {
    getLocs,
    removeLoc,
    addLoc
}

import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'locations'
_createLocs()

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function removeLoc(id) {
    return storageService.remove(STORAGE_KEY , id)
}

function addLoc() {
    storageService.post(STORAGE_KEY , )
}

function save(loc) {
    if (loc.id) {
        return storageService.put(STORAGE_KEY, loc)
    } else {
        return storageService.post(STORAGE_KEY, loc)
    }
}

function _createLocs() {
    let locs = utilService.loadFromStorage(STORAGE_KEY)
    if (!locs || !locs.length) {
        _createDemoLocs()
    }
}

function _createDemoLocs() {
    const locsNames = ['Greatplace', 'Neveragain']
    const locsLatLng = [{lat: 32.047104, lng: 34.832384},{lat: 32.047201, lng: 34.832581}]

    const locs = locsNames.map((locName, i) => {
        const loc = _createLoc(locName)
        loc.latLng = locsLatLng[i]
        return loc
    })

    utilService.saveToStorage(STORAGE_KEY, locs)
}

function _createLoc(name) {
    const loc = {}
    loc.id = utilService.makeId()
    loc.name = name || utilService.randomPetName(pet.type)
    loc.createdAt = Date.now()
    return loc
}
