import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { ipcRenderer } from 'electron'

import store from '../../data/store'
import predictions from '../../data/predictions'
import {
  getLocation,
  grabDistance,
  sortDistance
} from '../../data/get_location'

import Loading from '../Shared/Loading'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      favorites: [],
      selected: null,
      loading: false
    }
    this.reloadData = this.reloadData.bind(this)
  }
  async componentDidMount () {
    this.reloadData()
    ipcRenderer.on('reload-home', async (event, agg) => this.reloadData())
  }
  async reloadData () {
    this.setState({
      loading: true
    })
    const favorites = Object.values(store.get('favorite', []))
    const favoritesByDistance = sortDistance(
      favorites.map(f => ({
        ...f,
        latitude: f.item.latitude,
        longitude: f.item.longitude
      }))
    )

    this.setState({
      favorites: favoritesByDistance,
      location: getLocation()
    })
    if (
      (favoritesByDistance && favoritesByDistance.length > 0) ||
      (favorites && favorites.length > 0)
    ) {
      const predictionsState = await predictions(favorites[0])
      this.setState({
        selected: favoritesByDistance[0] || favorites[0],
        predictions: predictionsState
      })
    }
    this.setState({
      loading: false
    })
  }
  render () {
    return (
      <div>
        <div className='pane-group'>
          <div className='pane pane-sm sidebar'>
            <ul className='list-group'>
              <li className='list-group-header'>
                <strong>Favorites</strong>
              </li>
              {this.state.favorites.map(f => (
                <li
                  key={f.item.id}
                  className={`list-group-item ${
                    this.state.selected &&
                    this.state.selected.item.id === f.item.id
                      ? 'active'
                      : ''
                  }`}
                  onClick={async () => {
                    this.setState({ selected: f, loading: true })
                    const predictionsState = await predictions(f)
                    this.setState({
                      loading: false,
                      predictions: predictionsState
                    })
                  }}
                >
                  {' '}
                  <span
                    className='icon icon-record'
                    style={{
                      marginRight: '0.5em',
                      color: f.route.bg_color || '#efefef'
                    }}
                  />
                  <strong>{f.item.display_name}</strong>
                  <br />
                  {grabDistance(
                    {
                      latitude: f.item.latitude,
                      longitude: f.item.longitude
                    },
                    this.state.location
                  ) &&
                    `${grabDistance(
                      {
                        latitude: f.item.latitude,
                        longitude: f.item.longitude
                      },
                      this.state.location
                    )} miles away`}
                </li>
              ))}
            </ul>
          </div>
          <div className='pane'>
            {!this.state.selected ? (
              <div className='padded-more' style={{ textAlign: 'center' }}>
                <strong>Welcome</strong>
                <p>Get started by marking a Station as a favorite.</p>
                <p>
                  {' '}
                  <button
                    className='btn btn-primary'
                    onClick={() => {
                      return this.props.history.push('/metro')
                    }}
                  >
                    Do it Now
                  </button>
                </p>
              </div>
            ) : (
              <div>
                {this.state.loading ? (
                  <Loading />
                ) : (
                  <div className='pane-group'>
                    <div className='pane'>
                      {this.state.predictions.map(p => (
                        <ul className='list-group' key={JSON.stringify(p)}>
                          <li className='list-group-header'>
                            <strong>
                              <span className='icon icon-right' />&nbsp;&nbsp;
                              {p.r.display_name.split(' - ')[1]}
                            </strong>
                          </li>
                          {p.predictions.map(p => (
                            <li
                              className='list-group-item'
                              key={JSON.stringify(p)}
                            >
                              <div className='media-body'>
                                <strong>{p.minutes}</strong> minutes
                              </div>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home)
