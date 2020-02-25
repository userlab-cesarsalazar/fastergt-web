//Libs
import React from 'react';
import { withRouter } from 'react-router';
import Accounting from 'accounting';

//Components
import {
  Table,
} from 'antd';

class AccountTable extends React.Component {
  
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
  
  /*
  * date: "2020-01-22T14:52:31.000Z"
    remaining: 65
    client_id: 4398
    package_id: 62601
  * */
  
  getColumns = ()=>{
    let columns = [
      { title: 'Nro. de paquete', dataIndex: 'package_id', key: 'package_id' },
      { title: 'Codigo', dataIndex: 'client_id', key: 'client_id' },
      { title: 'Usuario', dataIndex: 'contact_name', key: 'contact_name' },
      { title: 'Total', dataIndex: 'amount', key: 'amount' },
      { title: 'Abono', dataIndex: 'charge', key: 'charge' },
      { title: 'Restante', dataIndex: 'remaining', key: 'remaining' },
      { title: 'Fecha', dataIndex: 'date', key: 'date' },
    ];
    
    return columns
  }
  
  getData = data => data.map(d => ({
    key: d.package_id,
    package_id: d.package_id,
    client_id: d.client_id,
    contact_name: d.contact_name,
    remaining: d.remaining,
    charge: d.charge,
    amount: Accounting.formatMoney(d.amount, 'Q'),
    date: d.date,
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

export default withRouter(AccountTable)
