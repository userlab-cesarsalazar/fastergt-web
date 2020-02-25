//Libs
import React from 'react';
import { withRouter } from 'react-router';
import Accounting from 'accounting';

//Components
import {
  Table,
  Button, Divider
} from 'antd';

class PackagesTable extends React.Component {

  constructor(props){
    super(props);

    this.getColumns = this.getColumns.bind(this);
    this.getData = this.getData.bind(this);

    this.state = {
      data: [],
      isPageTween: false,
      loading: false,
      hasMore: true
    };
  }

  getColumns = ()=>{
    let columns = [
      { title: '#', dataIndex: 'package_id', key: 'package_id' },
      { title: 'Codigo', dataIndex: 'client_id', key: 'client_id' },
      { title: 'Usuario', dataIndex: 'contact_name', key: 'contact_name' },
      { title: 'Descripcion', dataIndex: 'description', key: 'description' },
      { title: 'Tracking', dataIndex: 'tracking', key: 'tracking' },
      { title: 'Total', dataIndex: 'total', key: 'total' },
      { title: 'Fecha Registro', dataIndex: 'ing_date', key: 'ing_date' },
      { title: 'Estado', dataIndex: 'status', key: 'status' },
      {
        title: 'Accion',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
              <Button style={{marginLeft:'-20px'}} type='default' icon='edit' onClick={e => { this.onEdit(record.key, e); }}/>
              <Divider type={'vertical'} />
            
            <Button type='primary' icon='download' onClick={e => { this.onDownload(record, e); }} loading={this.state.loading} disabled={ record.status === 'Entregado' || record.status ===  'Entregado.' ? true: false}/>
          </div>
          
        ),
      }
    ];

    return columns
  }

  getData = data => data.map(d => ({

    key: d.package_id,
    package_id: d.package_id,
    client_id: d.client_id,
    contact_name: d.contact_name,
    description: d.description,
    total: Accounting.formatMoney(d.total_a_pagar, 'Q'),
    tracking: d.tracking,
    ing_date: d.ing_date,
    status: d.status
  }));

  onDelete = (key, e) => {
    e.preventDefault();
    const data = this.state.data.filter(item => item.key !== key);
    this.setState({ data, isPageTween: false });
  };

  onEdit = (package_id, e) => {
    e.preventDefault();
    this.props.history.push('/packages/adminupdate/'+package_id);
  };
  
  onDownload = (record, e) => {
    e.preventDefault();
    this.props.download(record)
  };
  

  render() {
    return (
      <div>
        <Table
          loading={this.props.loading}
          columns={this.getColumns()}
          dataSource={this.getData(this.props.packages)}
        />
      </div>
    );
  }
}

export default withRouter(PackagesTable)
