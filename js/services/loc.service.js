import { mapService } from './map.service.js'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
export const locService = {
    getLocs,
    addLocation,
    deleteLocation
}
const LOCS_KEY = 'locsDB'
let locs = []
_createLocs()

// const locs = [
//     { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
//     { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
// ]

function getLocs() {
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(locs)
    //     }, 2000)
    // })
    return storageService.query(LOCS_KEY)
        .then(locs)
}

function addLocation(loc) {
    console.log('loc', loc)
    if (loc) {
        const place = loc
        console.log('place', place)
        console.log('locs', locs)
        return storageService.post(LOCS_KEY, place)
    }
    else {
        const place = mapService.getLoc()
        console.log('place', place)
        console.log('locs', locs)
        return storageService.post(LOCS_KEY, place)
    }
}

function deleteLocation(id) {
    return storageService.remove(LOCS_KEY, id)
}

function _createLocs() {
    locs = utilService.loadFromStorage(LOCS_KEY)
    if (!locs || !locs.length) {
        _createDemoLocs()
    }
    // console.log('locs', locs)
    return locs
}

function _createDemoLocs() {
    locs = [
        { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
        { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
    ]
    utilService.saveToStorage(LOCS_KEY, locs)
}