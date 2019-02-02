import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import TabItem from './components/tabItem'
import { ipcRenderer } from 'electron'

class Navigation extends Component {
  render () {
    return (
      <footer className='toolbar toolbar-footer'>
        <div className='tab-group'>
          <TabItem href='/'>
            <span className='icon icon-star' /> Favorites
          </TabItem>
          <TabItem href='/metro'>
            <span className='icon icon-plus' /> Add/Remove
          </TabItem>
          <div
            className='tab-item tab-item-fixed'
            onClick={() => {
              console.log(ipcRenderer.sendSync('synchronous-message', 'ping'))
            }}
          >
            <span className='icon icon-menu' />
          </div>
        </div>
      </footer>
    )
  }
}

export default withRouter(Navigation)
