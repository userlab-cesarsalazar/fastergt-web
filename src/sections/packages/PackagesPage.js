//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withUserDefaults } from '../../commons/components/UserDefaults';
import { Cache } from 'aws-amplify';

//Api
import PackagesSrc from './PackagesSrc';

//Components
import PackagesTable from './components/PackagesTable';
import ClientSearchSelect from '../clients/components/ClientSearchSelect';
import {
  Button,
  message,
  Form,
  Input,
  Col,
  Row,
  Divider,
  Card,
  Select
} from 'antd';

//Styles

//const
const FormItem = Form.Item;
const Option = Select.Option;

class PackagesPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      packages: [],
      role:'cliente',
      tracking: '',
      client: undefined,
      type:'tracking',
      phone:'',
    }
    
    this.onSearch = this.onSearch.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.loadData();
    let profile = Cache.getItem('userApp');
    this.setState({ role : profile.profile})
  }
  
  handleChange = (name, value) => {
    
    let otherState = {}
    switch (name) {
      case 'client_id':
        otherState = {
          client: undefined,
          tracking:undefined
        }
        break;
      case 'client':
        otherState = {
          client_id: undefined,
          tracking:undefined
        }
      break;
      default:
        otherState = {
          client_id: undefined,
          client:undefined
        }
    }
    
    this.setState({ [name]: value, ...otherState })
  }
  
  loadData = () => {
    PackagesSrc.list()
      .then(packages => this.setState({ packages, loading: false }))
      .catch(err => {
        message.error(err.message || err)
        this.setState({ loading: false })
      })
  }

  onAdd = () => {
    this.props.history.push('/packages/create');
  };

  onAdminAdd = () => {
    this.props.history.push('/packages/admincreate');
  };
  
  onSearch = () => {
    let params = '';
    if(this.state.tracking && this.state.tracking !== ''){
      params = `type=tracking&id=${this.state.tracking}`
    }else {
      if(this.state.client_id && this.state.client_id !== '')
        params = `type=client_id&id=${this.state.client_id ? this.state.client_id : ''}`
    }
  
    if(this.state.package_id && this.state.package_id !== ''){
      params = `type=package_id&id=${this.state.package_id}`
    }
  
    if(this.state.phone && this.state.phone !== ''){
      params = `type=phone&id=${this.state.phone}`
    }
    
    this.setState({loading : true})
    PackagesSrc.getByFilter(params)
      .then( response => this.setState({ packages : response, loading: false }))
      .catch(_ => {
        this.setState({ loading: false });
      })
  }
  
  handleOnDownload = (record) => {
    
    this.setState({ loading: true})
    PackagesSrc.downloadFast(record.key, record)
      .then( response => this.onSearch())
      .catch( e => { message.error('Error en la descarga')
      this.setState({ loading: false})
    })
    
  };

  render() {
    const {
      getWord
    } = this.props.userDefaults;

    const {
      loading,
      packages,
      role,
      tracking,
      client_id,
      client,
      type,
      package_id,
      phone
    } = this.state;

    return (
      <div>
        <div className={'table-action-bar'}>
          <h2>{getWord('PACKAGES')}</h2>
          {role === 'admin' || role === 'warehouse' ? <Button type='primary' onClick={this.onAdminAdd}>Ingresar</Button> : ''}
          {role === 'cliente' ? <Button type='primary' onClick={this.onAdd}>Nuevo</Button> : ''}
        </div>
        <Form autoComplete='off'>
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
                    <Option value='tracking'>Tracking</Option>
                    <Option value='client_id'>Cod. Cliente</Option>
                    <Option value='client'>Nombre Cliente</Option>
                    <Option value='package'>Paquete</Option>
                    <Option value='phone'>Telefono</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col className='gutter-row' span={12}>
                {this.state.type === 'tracking' &&

                <FormItem label='Nro. Tracking' >
                  <Input
                    placeholder={'Nro. Tracking'}
                    onChange={ e => this.handleChange('tracking', e.target.value)}
                    value={tracking}
                    name='tracking'
                  />
                </FormItem>
                }
                {this.state.type === 'client' &&
                  <FormItem label='Nombre Cliente'>
                    <ClientSearchSelect
                      value={client}
                      onChange={value => this.handleChange('client', value)}
                    />
                  </FormItem>
                }
  
                {this.state.type === 'client_id' &&
                <FormItem label='Codigo Cliente' >
                  <Input
                    placeholder={'Codigo de cliente'}
                    onChange={e => this.handleChange('client_id', e.target.value)}
                    value={client_id}
                    name='client_id'
                  />
                </FormItem>
                }
  
                {this.state.type === 'package' &&
                <FormItem label='Cod. Paquete' >
                  <Input
                    placeholder={'Cod. Paquete'}
                    onChange={e => this.handleChange('package_id', e.target.value)}
                    value={package_id}
                    name='package_id'
                  />
                </FormItem>
                }
  
                {this.state.type === 'phone' &&
                <FormItem label='Nro. Telefono' >
                  <Input
                    placeholder={'Telefono'}
                    onChange={e => this.handleChange('phone', e.target.value)}
                    value={phone}
                    name='phone'
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

        <PackagesTable
          loading={loading}
          packages={packages}
          download ={ this.handleOnDownload}
          profile={ this.state.role }
        />
      </div>
    );
  }
}

export default withRouter(withUserDefaults(PackagesPage))