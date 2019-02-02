import React, { Component } from 'react'
import axios from 'axios'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import Loading from '../Shared/Loading'
import store from '../../data/store'
import Favorite from '../Favorite/Favorite'

class MetroLines extends Component {
  constructor (props) {
    super(props)
    this.state = {
      routes: null,
      selectedStation: null,
      loading: false,
      loadingBody: false,
      stationMeta: null
    }
    this.getStation = this.getStation.bind(this)
  }
  async componentDidMount () {
    const agency = this.props.agency || 'lametro-rail'
    this.setState({
      loading: true
    })
    if (store.has('routes-' + agency)) {
      this.setState({
        loading: false,
        routes: store.store[`routes-${agency}`].routes,
        meta: store.store[`routes-${agency}`].meta
      })
    } else {
      const routes = await axios.get(
        'https://api.metro.net/agencies/' + agency + '/routes/'
      )
      const meta = await Promise.all(
        routes.data.items.map(async r => {
          const i = await axios.get(
            `https://api.metro.net/agencies/${agency}/routes/${r.id}`
          )
          return i.data
        })
      )
      store.set('routes-' + agency, {
        routes: routes.data.items,
        meta
      })
      this.setState({
        loading: false,
        routes: routes.data.items,
        meta
      })
    }
  }
  async getStation (station) {
    this.setState({
      loadingBody: true
    })
    if (store.has('routes-' + this.props.agency + '-' + station)) {
      this.setState({
        loadingBody: false,
        [station]: store.get('routes-' + this.props.agency + '-' + station)
      })
    } else {
      const routes = await axios.get(
        'https://api.metro.net/agencies/' +
          this.props.agency +
          '/routes/' +
          station +
          '/sequence'
      )
      store.set('routes-' + this.props.agency + '-' + station, routes.data)
      this.setState({
        loadingBody: false,
        [station]: routes.data
      })
    }
  }
  render () {
    return (
      <div className='pane-group'>
        <div className='pane pane-sm sidebar'>
          {this.state.routes && !this.state.loading ? (
            <ul className='list-group'>
              <li className='list-group-header'>
                <strong>Routes</strong>
              </li>
              {this.state.routes.length > 0 &&
                this.state.routes.map(r => (
                  <li
                    className={`list-group-item ${
                      this.state.selectedStation &&
                      this.state.selectedStation.id === r.id
                        ? 'active'
                        : ''
                    }`}
                    onClick={() => {
                      this.setState({ selectedStation: r })
                      this.getStation(r.id)
                    }}
                  >
                    <div className='media-body'>
                      <span
                        className='icon icon-record'
                        style={{
                          marginRight: '0.5em',
                          color:
                            this.state.meta.find(i => i.id === r.id).bg_color ||
                            '#efefef'
                        }}
                      />
                      {r.display_name}
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <Loading />
          )}
        </div>
        {!this.state.loadingBody &&
        this.state.selectedStation &&
        this.state[this.state.selectedStation.id] ? (
          <div className='pane'>
            {console.log(
              this.state.selectedStation.id,
              this.state[this.state.selectedStation.id]
            )}
            {this.state.selectedStation && (
              <div
                style={{ overflow: 'hidden', width: '100%', height: '100%' }}
              >
                <Map
                  center={[
                    this.state[this.state.selectedStation.id].items[
                      Math.round(
                        this.state[this.state.selectedStation.id].items.length /
                          2
                      )
                    ].latitude,
                    this.state[this.state.selectedStation.id].items[
                      Math.round(
                        this.state[this.state.selectedStation.id].items.length /
                          2
                      )
                    ].longitude
                  ]}
                  zoom={11}
                >
                  <TileLayer
                    attribution='&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />
                  {this.state[this.state.selectedStation.id].items.map(i => (
                    <Marker position={[i.latitude, i.longitude]}>
                      <Popup>
                        <Favorite
                          item={i}
                          route={this.state.meta.find(
                            t => t.id === this.state.selectedStation.id
                          )}
                          agency={this.props.agency}
                        />
                        {i.display_name}
                      </Popup>
                    </Marker>
                  ))}
                </Map>
              </div>
            )}
          </div>
        ) : (
          <div>
            {!this.state.selectedStation ? (
              <div className='padded-more'>Select a station on the left.</div>
            ) : (
              <Loading />
            )}
          </div>
        )}
      </div>
    )
  }
}

export default MetroLines
