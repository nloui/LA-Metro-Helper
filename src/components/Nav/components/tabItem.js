import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class TabItem extends Component {
  constructor(props) {
    super(props);
    this.active = this.active.bind(this);
  }
  active() {
    console.log('active', this.props.href, this.props.location.pathname);
    return this.props.href === this.props.location.pathname;
  }
  render() {
    return (
      <div
        className={`tab-item ${this.active() && 'active'}`}
        onClick={() => {
          this.props.history.push(this.props.href);
        }}
      >
        <span className="icon" />
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(TabItem);
