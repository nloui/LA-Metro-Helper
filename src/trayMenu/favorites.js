const store = require('../../data/store.js')

export const getFavorites = () => {
  return Object.values(store.get('favorite', []))
}

export default { getFavorites }
