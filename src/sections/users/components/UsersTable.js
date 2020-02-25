import React from 'react';
import { withRouter } from 'react-router';
import {
  Table,
  Form,
  Button,
  Col
} from 'antd';

class UsersTable extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      data: [],
      isPageTween: false,
      loading : false,
      page: 0,
      type: '',
      name: '',
      email: ''
    };
  }

    getColumns = () => {
      let columns = [
        { title: 'Tipo Usuario', dataIndex: 'type', key: 'type' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Activo', dataIndex: 'activo', key: 'activo' },
        {
          title: 'Accion',
          dataIndex: '',
          key: 'x',
          render: (text, record) => (
            <span>
              <Button type='default' icon='edit' onClick={(e) => { this.onEdit(record.key, e); }}/>
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
        type: d.type,
        activo: d.activo === 'Y' ? 'Si' : 'No'
      }));
    };

    onEdit = key => {
        this.props.history.push(`/users/edit/${key}`);
    }

    render() {

      return (
        <div>
          <Table
            loading={this.props.loading}
            columns={this.getColumns()}
            dataSource={this.getData(this.props.users)}
            pagination={false}
          />

          <br/>

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
        </div>
      );
    }
}

export default withRouter(UsersTable)
