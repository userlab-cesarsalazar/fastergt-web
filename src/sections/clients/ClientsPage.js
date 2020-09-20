//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import  { Cache } from 'aws-amplify';

//Api
import ClientsSrc from './ClientsSrc';

//Components
import ClientsTable from './components/ClientsTable';

import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  message,
  Select
} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
//Styles

//const

class ClientsPage extends Component {
  
  constructor(props){
    super(props)

    this.state = {
      loading: false,
      isPageTween: false,
      page: 1,
      clients: [],
      disabledLoadMore: false,
      errors: {},
      client_id:'',
      name:'',
      email:'',
      type:'client_id'
    }
  }
  
  componentDidMount() {
    if(Cache.getItem('userApp').profile === 'admin'){
      this.setState({ loading: true });
      this.loadData();
    }
  }

  loadData = () => {
    ClientsSrc.list(this.getFilters())
      .then(clients => this.setState({ clients, loading: false }))
      .catch(err => {
        message.error(err.message || err);
        this.setState({ loading: false });
      })
  }
  
  onAdd = () => {
    this.props.history.push('/clients/create');
  };

  onSearch = async e => {
    try {
      e.preventDefault();

      if(Cache.getItem('userApp').profile === 'recepcionista'){
        await this.validateFields();
      }

      this.setState({ loading: true });

      let params = this.getFilters();

      let clients = await ClientsSrc.list(params);

      this.setState({ clients: clients, loading: false, page: 1, disabledLoadMore: false });

    } catch (e) {
      console.log(e)
      if (e && e.message) {
        message.error(e.message);
      }
      this.setState({ loading: false })
    }
  };

  getFilters = page => {

    let params = 'type=cliente';

    if(this.state.name) {
      params += '&name='+this.state.name;
    }

    if(this.state.client_id) {
      params += '&client_id='+this.state.client_id;
    }

    if(this.state.email) {
      params += '&email='+this.state.email;
    }
  
    if(this.state.tracking) {
      params += '&tracking='+this.state.tracking;
    }
  
    if(this.state.package_id) {
      params += '&package_id='+this.state.package_id;
    }
  
    if(this.state.phone) {
      params += '&phone='+this.state.phone;
    }

    if(page) {
      params += '&page='+page;
    }

    return params
  }

  validateFields = async() => {
    try {
      let errors = {}
      if(!this.state.name && !this.state.client_id && !this.state.email && !this.state.tracking && !this.state.package_id) {
        errors.client_id = 'Debe ingresar un campo de busqueda'
        errors.name = 'Debe ingresar un campo de busqueda'
        errors.email = 'Debe ingresar un campo de busqueda'
      }

      this.setState({ errors });
      if (Object.keys(errors).length > 0)
        throw errors

      return false
    } catch (errors) {
      throw errors
    }
  };

  handleChange = (name, value) => {
      let otherState = {}
      switch (name) {
        case 'name':
          otherState = {
            client_id: undefined,
            email:undefined,
            package_id:undefined,
            tracking:undefined,
            phone:undefined
          }
          break;
        case 'client_id':
          otherState = {
            name: undefined,
            email:undefined,
            tracking:undefined,
            package_id:undefined,
            phone:undefined
          }
          break;
        case 'package_id':
          otherState = {
            name: undefined,
            email:undefined,
            client_id: undefined,
            tracking:undefined,
            phone:undefined
          }
          break;
        case 'tracking':
          otherState = {
            name: undefined,
            email:undefined,
            client_id: undefined,
            package_id:undefined,
            phone:undefined
          }
          break;
        case 'phone':
          otherState = {
            name: undefined,
            email:undefined,
            client_id: undefined,
            package_id:undefined
          }
          break;
        default:
          otherState = {
            name: undefined,
            client_id:undefined,
            package_id: undefined,
            tracking: undefined,
            phone:undefined
          }
      }
      this.setState({ [name]: value , ...otherState})
  };

  loadMore = async() => {
    try{
      this.setState({ loading: true });
      let listTmp = [];
      let params = this.getFilters(this.state.page + 1);
      let clients = await ClientsSrc.list(params)
      listTmp = this.state.clients.concat(clients);

      let disabledLoadMore = clients && clients.length === 25 ? false : true

      this.setState(prevState => ({
        clients: listTmp,
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
      clients,
      name,
      client_id,
      email,
      errors,
      type,
      tracking,
      package_id,
      phone
    } = this.state;

    return (
      <div>

        <div className={'table-action-bar'}>
          <h2>Clientes</h2>
            <Button type='primary' onClick={this.onAdd}>Nuevo</Button>
        </div>
        <Form autoComplete='NOPE'>
          <Card>
            <Row gutter={24}>
              <Col className='gutter-row' span={12}>
                <FormItem label='Seleccione Filtro' >
                  <Select
                    placeholder='Seleccione'
                    onChange={value => this.handleChange('type', value)}
                    value={type}
                    defaultValue={type}
                  >
                    <Option value='client_id'>Cod. Cliente</Option>
                    <Option value='name'>Nombre Cliente</Option>
                    <Option value='email'>Email</Option>
                    <Option value='tracking'>Tracking</Option>
                    <Option value='package_id'>Cod. Paquete</Option>
                    <Option value='phone'>Telefono</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col className='gutter-row' span={12}>
                {
                  type === 'client_id' &&
                  <FormItem
                    label='Codigo'
                    validateStatus={errors.client_id && 'error'}
                    help={errors.client_id}
                  >
                    <Input
                      placeholder={'Codigo'}
                      name='client_id'
                      onChange={ e => this.handleChange('client_id', e.target.value)}
                      value={client_id}
                    />
                  </FormItem>
                }
                {
                  type === 'name' &&
                  <FormItem
                    label='Nombre'
                    validateStatus={errors.name && 'error'}
                    help={errors.name}
                  >
                    <Input
                      placeholder={'Nombre'}
                      name='name'
                      onChange={ e => this.handleChange('name', e.target.value)}
                      value={name}
                    />
                  </FormItem>
                }
                {type === 'email' &&
                <FormItem
                  label='Email'
                  validateStatus={errors.email && 'error'}
                  help={errors.email}
                >
                  <Input
                    placeholder={'Email'}
                    name='email'
                    onChange={ e => this.handleChange('email', e.target.value)}
                    value={email}
                  />
                </FormItem>
                }
                {type === 'tracking' &&
                <FormItem
                  label='Tracking'
                  validateStatus={errors.tracking && 'error'}
                  help={errors.tracking}
                >
                  <Input
                    placeholder={'Tracking'}
                    name='tracking'
                    onChange={ e => this.handleChange('tracking', e.target.value)}
                    value={tracking}
                  />
                </FormItem>
                }
                {type === 'package_id' &&
                <FormItem
                  label='Cod. Paquete'
                  validateStatus={errors.package_id && 'error'}
                  help={errors.package_id}
                >
                  <Input
                    placeholder={'Cod. Paquete'}
                    name='package_id'
                    onChange={ e => this.handleChange('package_id', e.target.value)}
                    value={package_id}
                  />
                </FormItem>
                }
                {type === 'phone' &&
                <FormItem
                  label='Telefono'
                  validateStatus={errors.phone && 'error'}
                  help={errors.phone}
                >
                  <Input
                    placeholder={'Telefono'}
                    name='phone'
                    onChange={ e => this.handleChange('phone', e.target.value)}
                    value={phone}
                  />
                </FormItem>
                }
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
        <ClientsTable
          loading={loading}
          clients={clients}
          loadMore={this.loadMore}
          disabledLoadMore={this.state.disabledLoadMore}
        />
      </div>
    );
  }
}

export default withRouter(ClientsPage)