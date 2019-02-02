import React, { Component } from 'react'
import store from '../../data/store'
import Loading from '../Shared/Loading'

class Favorite extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: null,
      loading: false
    }
  }
  componentDidMount () {
    this.setState({
      status: store.get(`favorite.${this.props.item.id}`, false)
    })
  }
  mark () {
    this.setState({
      status: true,
      loading: true
    })
    store.set(`favorite.${this.props.item.id}`, {
      item: this.props.item,
      route: this.props.route,
      agency: this.props.agency
    })
    this.setState({
      loading: false
    })
  }
  unmark () {
    this.setState({
      status: false,
      loading: true
    })
    store.delete(`favorite.${this.props.item.id}`)
    this.setState({ loading: false })
  }
  render () {
    return (
      <div style={{ float: 'left', marginRight: '0.5em' }}>
        <button
          className='btn btn-default'
          onClick={() => {
            if (this.state.status) {
              this.unmark()
            } else {
              this.mark()
            }
          }}
        >
          {this.state.loading && <Loading />}
          {this.state.status !== null && (
            <span
              className={`icon ${
                this.state.status ? 'icon-star' : 'icon-star-empty'
              }`}
            />
          )}
        </button>
      </div>
    )
  }
}

export default Favorite
