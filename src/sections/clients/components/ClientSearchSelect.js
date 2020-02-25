//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Api
import ClientsSrc from '../../clients/ClientsSrc';

//Components
import {
  message,
  Select
} from 'antd';

//Styles

//Const

class ClientSearchSelect extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      clients: []
    }
  }

  handleSearch = async value => {
    try {

      if(value && value.length > 2) {
        let clients = await ClientsSrc.getByName(value)

        this.setState({clients})
      }
    } catch (e) {
      console.log(e)
      message.error(e.message)
    }


  }


  render() {
    const clients = this.state.clients.map((d, i)=> <Select.Option key={i} value={d.client_id}>{d.name}</Select.Option>);

    return (
      <Select
        showSearch
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        notFoundContent={null}
        {...this.props}
      >
        {clients}
      </Select>
    );
  }
}

ClientSearchSelect.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array
  ]),
  clients: PropTypes.array,
  mode: PropTypes.string,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func
}

ClientSearchSelect.defaultProps = {
  disabled: false,
  onChange: () => {},
  placeholder: 'Cliente',
  onFocus: () => {}
}

export default ClientSearchSelect