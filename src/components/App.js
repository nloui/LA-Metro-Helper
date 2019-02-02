import React, { Component } from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import Helmet from 'react-helmet'
import '../assets/css/photon.min.css'
import '../assets/css/App.css'
import Navigation from './Nav/Primary'
import Home from './Screens/Home'
import Metro from './Screens/Metro'
import Bus from './Screens/Bus'

class App extends React.Component {
  render () {
    return (
      <Router>
        <div>
          <div className='header-arrow' />
          <div className='window'>
            <Helmet>
              <title>LA Metro Helper</title>
            </Helmet>
            <div className='window-content'>
              <Route path='/metro' exact component={Metro} />
              <Route path='/bus' exact component={Bus} />
              <Route path='/' exact component={Home} />
            </div>
            <Navigation />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
