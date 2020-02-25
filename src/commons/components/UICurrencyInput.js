//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Components
import {
  InputNumber
} from 'antd'


class UICurrencyInput extends Component {

  render() {
    return (
      <InputNumber
        value={this.props.value}
        placeholder={this.props.placeholder}
        min={0}
        formatter={value => `${this.props.symbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
        onChange={e => e > 0 && this.props.onChange(e)}
        {...this.props}
      />
    )
  }
}

UICurrencyInput.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  symbol: PropTypes.string
}

UICurrencyInput.defaultProps = {
  symbol: '$'
}

export default UICurrencyInput
