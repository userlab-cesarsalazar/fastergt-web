import React from 'react';
import { withRouter } from 'react-router';
import  { Cache } from 'aws-amplify';

import {
  Table,
  Form,
  Button,
  Col
} from 'antd';

class ClientsTable extends React.Component {

  constructor(props){
    super(props);
    this.getColumns = this.getColumns.bind(this);
    this.getData = this.getData.bind(this);

    this.state = {
      data: [],
      isPageTween: false,
      loading : false,
      page: 0,
      type: '',
      name: '',
      email: '',
      errors: {}
    };
  }

    getColumns = ()=>{
      let columns = [
        { title: 'Codigo', dataIndex: 'client_id', key: 'client_id' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Telefono', dataIndex: 'phone', key: 'phone' },
        { title: 'Activo', dataIndex: 'activo', key: 'activo' },
        {
          title: 'Accion',
          dataIndex: '',
          key: 'x',
          render: (text, record) => (
            <span>
              {(Cache.getItem('userApp').profile !== 'recepcionista') ? (
              <Button type='default' icon='edit' onClick={(e) => { this.onEdit(record.client_id, e); }}/>
              ) : ('')}
              <Button type='default' icon='file-search' title='Ver paquetes' onClick={(e) => { this.onViewPackages(record.client_id, e); }}/>
            </span>
          ),
        },
      ];
      return columns
    }

    getData = data => {
      return data.map(d => ({
        key: d.id,
        name:  d.name,
        email: d.email,
        client_id: d.client_id,
        phone: d.phone,
        activo: d.activo === 'Y' ? 'Si' : 'No'
      }));
    };

    onEdit = (key, e) => {
      this.props.history.push(`/clients/edit/${key}`);
    }

    onViewPackages = (key, e) => {
      this.props.history.push(`/clients/viewpackage/${key}`);
    }

    render() {

      return (
        <div>

          <Table
            loading={this.props.loading}
            columns={this.getColumns()}
            dataSource={this.getData(this.props.clients)}
            pagination={false}
          />

          <br/>

          {(Cache.getItem('userApp').profile !== 'recepcionista') ? (
            <Col span={24} style={{ textAlign: 'center' }}>
              <Form.Item>
                <Button
                  type='primary'
                  loading={this.props.loading}
                  disabled={this.props.disabledLoadMore}
                  onClick={this.props.loadMore}
                >
                 Cargar mas
               </Button>
              </Form.Item>
            </Col>
          )
            :
            ''
          }
        </div>
      );
    }
}

export default withRouter(ClientsTable)
