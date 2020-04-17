//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';

//Api
import PackagesSrc from '../packages/PackagesSrc';
import ClientsSrc from '../clients/ClientsSrc';
import TransferSrc from "./TransferSrc";
import moment from 'moment'
//Components
import UIIntegerInput from '../../commons/components/UIIntegerInput';

import {
  Form,
  Row,
  Card, Col, Button, message, Divider,Input,DatePicker
} from 'antd';
const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';

class TransferPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors:{},
      loading:false,
      package_id: null,
      new_package_id: null,
      date: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.searchClient = this.searchClient.bind(this)
    this.validateFields = this.validateFields.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  
  handleChange = (name, value) => {
    let otherState = {}
    this.setState({ [name]: value , ...otherState})
  };
  
  validateFields = async() => {
    try {
      
      let errors = {}
      
      if(!this.state.package_id) {
        errors.package_id = 'El codigo es requerido'
      }
      
      if(!this.state.client_id) {
        errors.client_id = 'El cliente es requerido'
      }
      
      this.setState({ errors })
      
      if (Object.keys(errors).length > 0)
        throw errors;
      
      return false
      
    } catch (errors) {
      throw errors;
    }
  }
  
  searchClient = async package_id => {
    
    try {
      await this.validateFields()
      
      this.setState({ loading: true });
      
      let package_data = await PackagesSrc.get(package_id);
      let client_data = await ClientsSrc.getByClientId(this.state.client_id)
      this.setState({ loading: false, package_data: package_data[0], client_data:client_data[0], total_a_pagar: package_data[0].total_a_pagar, date: package_data[0].ent_date });
      
    } catch (e) {
      console.log(JSON.stringify(e))
      this.setState({ loading: false });
      message.error('Error')
    }
  }
  
  handleUpdate = ()=> {
    let params = {
      package_id: this.state.package_id,
      client_id: this.state.client_id,
      total: this.state.total_a_pagar,
      ent_date: this.state.date
    }
    
    console.log(params)
    TransferSrc.transfer(params).then( d => {
      message.success('Actualizado')
      this.setState({package_data:null, client_data:null, package_id:null, client_id:null, total_a_pagar:null})
    })
  }
  render() {
    const {
      loading,
      package_id,
      client_id,
      errors,
      package_data,
      client_data,
      date
    } = this.state;
    return (
      <div>
        <Form autoComplete='NOPE'>
        <Card title='Transferir Parquete' style={{ width: '100%' }}>
          <Row gutter={24}>
            <Col className='gutter-row' span={12}>
          <Form.Item
            required
            validateStatus={errors.package_id && 'error'}
            help={errors.package_id}
            label={'Paquete Origen'}
          >
          <UIIntegerInput
            onChange={e => this.handleChange('package_id', e.target.value)}
            value={package_id}
            placeholder='Codigo del Paquete'
          />
          </Form.Item>
            </Col>
            <Col className='gutter-row' span={12}>
          <Form.Item
            required
            validateStatus={errors.client_id && 'error'}
            help={errors.client_id}
            label={'Cliente Destino'}
          >
            <FormItem >
              <Input
                onChange={e => this.handleChange('client_id', e.target.value)}
                value={client_id}
                placeholder='Codigo del Cliente'
              />
            </FormItem>
          </Form.Item>
            </Col>
          </Row>
        </Card>
        <br/>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Form.Item>
              <Button type='primary' onClick={_ => this.searchClient(package_id)} loading={loading} >
                Buscar
              </Button>
            </Form.Item>
          </Col>
        </Row>
        </Form>
        <Divider/>
        {package_data && client_data &&
          <div>
        <Row gutter={24}>
          <Col span={12}>
            <Card title={'Casillero origen'}>
              Cod. Cliente: {package_data.client_id} <br /><br />
              Tracking: {package_data.tracking} <br /><br />
              <Form.Item  validateStatus={errors.total_a_pagar && 'error'}  help={errors.total_a_pagar} label={'Total a pagar: '}>
                            <UIIntegerInput   onChange={e => this.handleChange('total_a_pagar', e.target.value)}
                value={this.state.total_a_pagar}
                placeholder='' /> </Form.Item>
              <FormItem
                label='Modificar la fecha de baja'
                validateStatus={errors.date && 'error'}
                help={errors.date}
              >
                <DatePicker
                  placeholder='Seleccione una Fecha'
                  defaultValue={ date === '0000-00-00' ? null :  moment(date, dateFormat)} format={dateFormat}
                  onChange={value => this.handleChange('date', value)}
      
                  style={{ width: '100%'}}
                />
              </FormItem>
              <br />
            </Card>
          </Col>
          <Col span={12}>
            <Card title={'Casillero de Destino'}>
            Cod. Cliente: {client_data.client_id} <br /> <br />
            Nombre: {client_data.name} <br /><br />
            Cuota: {client_data.cuota} <br />
            </Card>
          </Col>
        </Row>
            <br/>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Form.Item>
              <Button type='primary' onClick={_ => this.handleUpdate()} loading={loading} >
              Transferir
              </Button>
            </Form.Item>
          </Col>
        </Row>
        </div>
        }
      </div>
    )
  }
}

export default withRouter(TransferPage)
