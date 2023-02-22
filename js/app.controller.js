import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utilService } from './services/util.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onLocationEntered = onLocationEntered
window.onAddLocation = onAddLocation
window.onGoToLocation = onGoToLocation
window.onDeleteLocation = onDeleteLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .then(() => {
            onGetLocs()
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
    // console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            // console.log('Locations:', locs)
            renderLocations(locs)
            mapService.addMarkers(locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            // console.log('User position is:', pos.coords)
            onPanTo(pos.coords.latitude, pos.coords.longitude)
            // document.querySelector('.user-pos').innerText =
            //     `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
    // console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function onLocationEntered(ev) {
    ev.preventDefault()
    console.log('hi');
    let geocoder = mapService.getGeocoder()
    var address = document.getElementById('address').value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            const lat = results[0].geometry.location.toJSON().lat
            const lng = results[0].geometry.location.toJSON().lng
            console.log('lat', lat)
            console.log('lng', lng)
            onPanTo(lat, lng)
            const time = utilService.getTime()
            const place = {
                name: address,
                lat,
                lng,
                createdAt: time
            }
            console.log('place', place)
            onAddLocation(place)
            // var marker = new google.maps.Marker({
            //     map: map,
            //     position: results[0].geometry.location
            // });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

function onAddLocation(loc) {
    locService.addLocation(loc).then(onGetLocs)
}

function renderLocations(locs) {
    // console.log('locs', locs)
    let strHTML = ''
    locs.map(location => {
        strHTML += `<article class="card">
            <p>${location.name}</p>
            <button onclick="onGoToLocation(${location.lat}, ${location.lng})">Go</button>
            <button onclick="onDeleteLocation('${location.id}')">Delete</button>
        </article>`
    }).join('')
    document.querySelector('.locs').innerHTML = strHTML
}

function onGoToLocation(lat, lng) {
    // console.log('lat', lat)
    // console.log('lng', lng)
    onPanTo(lat, lng)
}

function onDeleteLocation(id) {
    // console.log('id', id)
    locService.deleteLocation(id).then(mapService.removeMarker).then(onGetLocs)
}
