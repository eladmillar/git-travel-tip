import { utilService } from './util.service.js'
export const mapService = {
    initMap,
    addMarker,
    panTo,
    getLoc,
    getGeocoder,
    addMarkers,
    removeMarker
}


// Var that is used throughout this Module (not global)

var gMap
var gGeocoder
let currMarker = []
let markers = []



function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            gGeocoder = new google.maps.Geocoder()
            // console.log('InitGeocoder');
        })
        .then(() => {
            // console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            // console.log('Map!', gMap)
        })
        .then(checkEventListener)
}

function getGeocoder() {
    return gGeocoder
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    // console.log('loc', loc)

    setMapOnMarker(null)
    currMarker = []
    currMarker.push(marker)
    return marker
}

function addMarkers(locs) {
    // console.log('locs', locs)
    markers = []
    locs.forEach(loc => {
        var marker = new google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: gMap,
            title: loc.name,
            id: loc.id
        })
        markers.push(marker)
    });
    // console.log('markers', markers)
}

function removeMarker(value) {
    let counter = 0
    markers.forEach(marker => {
        counter++
        if (marker.id === value) return counter
    })
    markers.splice(counter, 1)
    setMapOnAll(null)
    markers = []
}

function getLoc() {
    // console.log('currMarker', currMarker[0].title);
    const lat = currMarker[0].position.toJSON().lat
    const lng = currMarker[0].position.toJSON().lng
    const name = prompt('name?')
    const time = utilService.getTime()

    const place = {
        name,
        lat,
        lng,
        createdAt: time
    }
    return place
}


function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    return Promise.resolve
}

function setMapOnMarker(map) {
    for (let i = 0; i < currMarker.length; i++) {
        currMarker[i].setMap(map);
    }
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function checkEventListener() {
    gMap.addListener("click", (mapsMouseEvent) => {
        // console.log('mapsMouseEvent', mapsMouseEvent)
        // console.log('mapsMouseEvent.latLng.toJSON()', mapsMouseEvent.latLng.toJSON())
        addMarker(mapsMouseEvent.latLng.toJSON())
        return Promise.resolve()
    });
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyC8NBMO_Jv4ROg5guCXiStnnQ1QoNhLcdE' //TODO: Enter your API Key
    // const API_KEY = ''
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}