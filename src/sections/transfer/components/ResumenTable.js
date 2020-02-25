//Libs
import React from 'react';
import { withRouter } from 'react-router';
import Accounting from 'accounting';

//Components
import {
  Table,
} from 'antd';

class ResumenTable extends React.Component {

  constructor(props){
    super(props);

    this.getColumns = this.getColumns.bind(this);
    this.getData = this.getData.bind(this);

    this.state = {
      data: [],
      isPageTween: false,
      loading: false,
      hasMore: true,
    };
  }

  getColumns = ()=>{
    let columns = [
      { title: '#', dataIndex: 'package_id', key: 'package_id' },
      { title: 'Codigo', dataIndex: 'client_id', key: 'client_id' },
      //{ title: 'Usuario', dataIndex: 'contact_name', key: 'contact_name' },
      { title: 'Descripcion', dataIndex: 'description', key: 'description' },
      { title: 'Tracking', dataIndex: 'tracking', key: 'tracking' },
      { title: 'Peso', dataIndex: 'weight', key: 'weight' },
      { title: 'Total', dataIndex: 'total', key: 'total' },
      { title: 'Fecha Registro', dataIndex: 'ing_date', key: 'ing_date' },
      { title: 'Estado', dataIndex: 'status', key: 'status' },
      
    ];

    return columns
  }

  getData = data => data.map(d => ({

    key: d.package_id,
    package_id: d.package_id,
    client_id: d.client_id,
    //contact_name: d.contact_name,
    description: d.description,
    total: Accounting.formatMoney(d.total_a_pagar, 'Q'),
    tracking: d.tracking,
    ing_date: d.ing_date,
    status: d.status,
    weight: d.weight
  }));
  
  render() {
    return (
      <div>
        <Table
          loading={this.props.loading}
          columns={this.getColumns()}
          dataSource={this.getData(this.props.packages)}
          pagination={{ pageSize: 100 }}
        />
      </div>
    );
  }
}

export default withRouter(ResumenTable)
