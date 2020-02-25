//Libs
import React, { Component } from 'react'
import PropTypes from 'prop-types'

//Components
import {
  Spin
} from 'antd'


class UISpinner extends Component {

  render() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spin size={this.props.size}/>
        <span>{this.props.title}</span>
      </div>
    )
  }
}

UISpinner.defaultProps = {
  size: 'large',
  title: 'Loading'
}

UISpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  title: PropTypes.string
}

export default UISpinner
