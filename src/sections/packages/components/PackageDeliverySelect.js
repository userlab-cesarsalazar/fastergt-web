//Libs
import React from 'react';

//Components
import {
  Select
} from 'antd';

const options = [
  { value: 'Entrega en Traestodo.', label: 'Entrega en Traestodo.' },
  { value: 'Listo para Entrega a Domicilio.', label: 'Listo para Entrega a Domicilio.' },
]

class PackageDeliverySelect extends React.Component {

  constructor(props){
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Select
        {...this.props}
      >
        {options.map((o, i) => <Select.Option key={i} value={o.value}>{o.label}</Select.Option>)}
      </Select>
    );
  }
}

export default PackageDeliverySelect
