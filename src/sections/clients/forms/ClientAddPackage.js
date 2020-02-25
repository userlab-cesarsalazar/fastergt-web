//Libs
import React from 'react';
import { withRouter } from 'react-router';
import  { Cache } from 'aws-amplify';

//Api
import PackagesSrc from '../../packages/PackagesSrc';

//Components
import UICurrencyInput from '../../../commons/components/UICurrencyInput';

import {
  Button,
  Card,
  Form,
  Icon,
  Input,
  message,
  Upload
} from 'antd';

const FormItem = Form.Item;

class ClientAddPackage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      errors: {},
      loading: false,
      tracking_number: '',
      description: '',
      price: 0,
      observations: ''
    }
  }
  
  handleChange = (name, value) => {
    this.setState({ [name]: value })
  }
  
  onSave = async(e) => {
    
    try {
      e.preventDefault()
      
      this.setState({ loading: true })
      await this.validateFields()
      
      let _package = {
        tracking: this.state.tracking_number,
        client_id: Cache.getItem('userApp').client_id,
        weight: '0',
        description: this.state.description,
        costo_producto: this.state.price,
        category_id: 1,
        measurements: '30x28',
        status: 'Registrado',
        tba: 0,
        package_invoice:'https://vod.ebay.com/vod/FetchOrderDetails?_trksid=p2060353.m2749.l2673&itemid=123483796164&transid=2101379374002'
      }
      
      await PackagesSrc.create(_package);
      
      message.success('Creado satisfactoriamente');
      this.onBack();
      return this.setState({ loading: false });
      
    } catch (e) {
      console.log(e)
      if (e && e.message) {
        message.error(e.message);
      }
      this.setState({ loading: false })
    }
  };
  
  onBack = () => {
    this.props.history.push(`/clients/viewpackage/${Cache.getItem('userApp').client_id}`);
  };
  
  validateFields = async() => {
    
    try {
      
      let errors = {}
      
      if(!this.state.tracking_number) {
        errors.tracking_number = 'El nro. de tracking es requerido'
      }
      
      if(!this.state.description) {
        errors.description = 'La descripcion es requerida'
      }
      
      if(!this.state.price) {
        errors.price = 'El precio es requerido'
      }
      
      this.setState({ errors })
      
      if (Object.keys(errors).length > 0)
        throw errors
      
      return false
      
    } catch (errors) {
      throw errors
    }
  }
  
  handleBlur = () => {
    this.validateFields()
  }
  
  render() {
    const {
      loading,
      errors,
      tracking_number,
      description,
      price,
      observations
    } = this.state;
    
    return (
      <div>
        <Card title='Registrar paquete' style={{ width: '100%' }}>
          <Form>
            <Form.Item
              required
              validateStatus={errors.tracking_number && 'error'}
              help={errors.tracking_number}
              label={'Nro. Tracking'}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <Input
                onBlur={this.handleBlur}
                placeholder={'Nro. Tracking'}
                value={tracking_number}
                onChange={e => this.handleChange('tracking_number', e.target.value)}
              />
            </Form.Item>
            
            <Form.Item
              required
              validateStatus={errors.description && 'error'}
              help={errors.description}
              label={'Descripcion'}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <Input
                onBlur={this.handleBlur}
                placeholder={'Descripcion'}
                value={description}
                onChange={e => this.handleChange('description', e.target.value)}
              />
            </Form.Item>
            
            <FormItem
              required
              label={'Precio(USD)'}
              validateStatus={errors.price && 'error'}
              help={errors.price}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <UICurrencyInput
                onBlur={this.handleBlur}
                style={{ width: '100%' }}
                value={price}
                onChange={value => this.handleChange('price', value)}
                placeholder={'Precio(USD)'}
              />
            </FormItem>
            
            <FormItem
              label={'Observaciones'}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <Input
                value={observations}
                placeholder={'Observaciones'}
                onChange={e => this.handleChange('observations', e.target.value)}
              />
            </FormItem>
            
            <FormItem
              required
              label={'Factura'}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <Upload name='upload' action='/upload.do' listType='picture'>
                <Button>
                  <Icon type='upload' /> Adjuntar
                </Button>
              </Upload>
            </FormItem>
            
            <FormItem wrapperCol={{ span: 6, offset: 9 }}>
              <Button type='primary' onClick={this.onSave} loading={loading}>Registrar</Button>
              <Button type='danger' className='btn-separator' onClick={this.onBack} loading={loading}>Regresar</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

const WrappedCreateForm = Form.create()(ClientAddPackage);
export default withRouter(WrappedCreateForm)