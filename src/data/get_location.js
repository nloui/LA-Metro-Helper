import { orderByDistance, getDistance } from 'geolib'
import store from './store'
let location

export const getLocation = () => {
  if ('geolocation' in navigator) {
    console.log('navigator geolocation')

    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log(position)
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        console.log('location', location)
        store.set('currentLocation', location)
        return location
      },
      function (error) {
        console.log(error)
      }
    )
  }
  console.log('last known', store.get('currentLocation', null))
  return store.get('currentLocation', null)
}

export const grabDistance = (point1, point2 = getLocation()) => {
  return (getDistance(point1, point2) * 0.000621371192).toFixed(2)
}

export const sortDistance = points => {
  const origin = getLocation()
  const distances = orderByDistance(origin, points)
  return distances.map(d => ({
    ...d,
    ...points[d.key]
  }))
}

export default { getLocation, sortDistance }
