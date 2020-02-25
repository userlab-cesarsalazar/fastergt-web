//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';

//Api
import UsersSrc from './UsersSrc';

//Components
import UsersTable from './components/UsersTable';

import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select
} from 'antd';

//Styles

//const
class UsersPage extends Component {

  constructor(props){
    super(props)

    this.onAdd = this.onAdd.bind(this);
    this.state = {
      loading: true,
      page: 1,
      disabledLoadMore: false,
      isPageTween: false,
      users: [],
      errors: {},
      email:'',
      name:'',
      type: undefined
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    UsersSrc.list()
      .then(users => this.setState({ users, loading: false }))
      .catch(err => {
        message.error(err.message || err);
        this.setState({ loading: false })
      })
  }

  onAdd = () => {
    this.props.history.push('/users/create');
  };

  handleChange = (name, value) => {
      let otherState = {}
      switch (name) {
        case 'name':
          otherState = {
            email: undefined,
            type:undefined
          }
          break;
        case 'email':
          otherState = {
            name: undefined,
            type:undefined
          }
          break;
        default:
          otherState = {
            name: undefined,
            email:undefined
          }
      }
    this.setState({ [name]: value, ...otherState }, _=> console.log(this.state, 'state'))
    
  };

  handleSelectChange = value => {
    this.setState({ type: value, name: undefined, email:undefined });
  };

  getFilters = page => {

    let params = 'page=' + (page ? page : 0);

    if(this.state.name) {
      params += '&name='+this.state.name;
    }

    if(this.state.type) {
      params += '&type='+this.state.type;
    }

    if(this.state.email) {
      params += '&email='+this.state.email;
    }

    return params
  }

  onSearch = async e => {
    try {
      e.preventDefault();

      this.setState({ loading: true });

      let params = this.getFilters();

      let users = await UsersSrc.list(params);

      this.setState({ users: users, loading: false, page: 1, disabledLoadMore: false });

    } catch (e) {
      console.log(e)
      if (e && e.message) {
        message.error(e.message);
      }
      this.setState({ loading: false })
    }
  };

  loadMore = async() => {
    try{
      this.setState({ loading: true });
      let listTmp = [];
      let params = this.getFilters(this.state.page + 1);
      let users = await UsersSrc.list(params)
      listTmp = this.state.users.concat(users);

      let disabledLoadMore = users && users.length === 25 ? false : true

      this.setState(prevState => ({
        users: listTmp,
        loading: false,
        page: prevState.page+1,
        disabledLoadMore: disabledLoadMore
      }));

    } catch (e) {
      console.log(e)
      if (e && e.message) {
        message.error(e.message);
      }
      this.setState({ loading: false })
    }
  };

  render() {
    const {
      loading,
      users,
      email,
      name,
      type
      } = this.state;

    return (
      <div>
      <div className={'table-action-bar'}>
        <h2>Usuarios</h2>
          <Button type='primary' onClick={this.onAdd}>Nuevo</Button>
        </div>
        <Form autoComplete='off'>
          <Card>
            <Row gutter={16}>
              <Col className='gutter-row' span={8}>
                <Form.Item label='Tipo'>
                  <Select
                    allowClear
                    placeholder='Tipo'
                    name='type'
                    onChange={this.handleSelectChange}
                    value={type}
                  >
                    <Select.Option value='vendedor'>Vendedor</Select.Option>
                    <Select.Option value='admin'>Administrador</Select.Option>
                    <Select.Option value='recepcionista'>Recepcionista</Select.Option>
                    <Select.Option value='warehouse'>Operador Guatemala</Select.Option>
                    <Select.Option value='delegate'>Operador Miami</Select.Option>
                    
                  </Select>
                </Form.Item>
              </Col>
              <Col className='gutter-row' span={8}>
                <Form.Item label='Nombre'>
                  <Input
                    placeholder={'Nombre'}
                    name='name'
                    onChange={ e => this.handleChange('name', e.target.value)}
                    value={name}
                  />
                </Form.Item>
              </Col>
              <Col className='gutter-row' span={8}>
                <Form.Item label='Email'>
                  <Input
                    placeholder={'Email'}
                    name='email'
                    onChange={ e => this.handleChange('email', e.target.value)}
                    value={email}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <br/>

          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Form.Item>
                <Button type='primary' onClick={this.onSearch} loading={loading} >
                  Buscar
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider/>

        <UsersTable
          loading={loading}
          users={users}
          loadMore={this.loadMore}
          disabledLoadMore={this.state.disabledLoadMore}
        />
      </div>
    );
  }
}

export default withRouter(UsersPage)