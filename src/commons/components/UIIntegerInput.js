//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Components
import { Input } from 'antd';

class UIIntegerInput extends Component {

  render() {
    const props = this.props;
    return (
      <Input
        {...props}
        pattern='[0-9]*'
        onChange={e => e.target.validity.valid && props.onChange && props.onChange(e)}
      />
    )
  }
}

UIIntegerInput.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func
}

export default UIIntegerInput
