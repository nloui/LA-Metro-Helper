import axios from 'axios'
import store from './store'

const listTimes = async item => {
  let runs
  if (store.has('runs-' + item.route.id)) {
    runs = store.store[`runs-${item.route.id}`]
  } else {
    const runsA = await axios.get(
      'https://api.metro.net/agencies/' +
        item.agency +
        '/routes/' +
        item.route.id +
        '/runs/'
    )
    store.set('runs-' + item.route.id, runsA.data.items)
    runs = runsA.data.items
  }
  const predictions = await axios.get(
    `http://api.metro.net/agencies/${item.agency}/routes/${
      item.route.id
    }/stops/${item.item.id}/predictions/`
  )
  const trainsByRoute = runs.map(r => {
    return {
      r,
      predictions: predictions.data.items.filter(x => x.run_id === r.route_id)
    }
  })
  return trainsByRoute
}

export default listTimes
