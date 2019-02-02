import React, { Component } from 'react'
import './css/spinner.css'

class Loading extends Component {
  render () {
    return (
      <div className='spinner center'>
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
        <div className='spinner-blade' />
      </div>
    )
  }
}

export default Loading
