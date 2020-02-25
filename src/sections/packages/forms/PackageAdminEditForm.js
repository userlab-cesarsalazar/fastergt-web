//Libs
import React from 'react';
import { withRouter } from 'react-router';
import Accounting from 'accounting';

//Api
import PackagesSrc from '../PackagesSrc';
import ClientsSrc from '../../clients/ClientsSrc';

//Components
import UIIntegerInput from '../../../commons/components/UIIntegerInput';
import ClientSearchSelect from '../../clients/components/ClientSearchSelect';
import PackageStatusSelect from '../components/PackageStatusSelect';

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row
} from 'antd';

const FormItem = Form.Item;

const initialState = {
  errors: {},
  loading: true,
  client_id: null,
  client_data: null,
  weight: null,
  tracking_number: '',
  description: 'Paquete',
  abono:0,
  anticipo:0,
  pendiente: 0
}

class PackageAdminEditForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ...initialState
    }
    this.pendint_calculate = this.pendint_calculate.bind(this)
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      PackagesSrc.get(this.props.match.params.id)
        .then(_package => {
          this.setState({
            client_id: String(_package[0].client_id),
            tracking_number: _package[0].tracking,
            description: _package[0].description,
            weight: _package[0].weight || 1,
            status:_package[0].status,
            package_id: _package[0].package_id,
            anticipo: _package[0].anticipo,
            pendiente: _package[0].pending_amount ? _package[0].pending_amount : 0,
            total : _package[0].total_a_pagar ? _package[0].total_a_pagar : 0
          })
          this.pendint_calculate(false)
          console.log(_package[0],'tt')
          return _package[0]
        })
        .then(_package => this.searchClient(_package.client_id))
        .then(_ => this.setState({ loading: false }))
        .catch(e => {
          this.setState({ loading: false });
          message.error(e.message);
        })

    }
  }

  handleChange = (name, value) => {

    let otherState = {}

    if(name === 'client' && value) {
      this.searchClient(value)
      otherState = { client_id : undefined }
    }

    if(name === 'client_id') {
      otherState = {
        client: undefined,
        client_data: undefined
      }
    }
    
    if(name === 'status'){
      if(value === 'Entregado con saldo pendiente' ){
       this.setState({pendiente: parseInt(this.state.total) })
      }
    }
  /*
    if(name === 'abono' && isNaN(value)) {
     this.setState({pendiente: parseInt(this.state.total) - parseInt(this.state.anticipo)})
    }
*/
    this.setState({ [name]: value, ...otherState })
  }

  onSave = async(e) => {

    try {
      e.preventDefault()

      this.setState({ loading: true })
      await this.validateFields()

      let _package = {
        tracking: this.state.tracking_number,
        client_id: this.state.client_data.client_id,
        weight: this.state.weight,
        description: this.state.description,
        category_id: 1,
        cuota: this.state.client_data.cuota,
        entrega: this.state.client_data.entrega,
        status: this.state.status,
        anticipo: parseInt(this.state.anticipo) + parseInt(this.state.abono),
        pendiente: this.state.pendiente,
        package_id: this.state.package_id
      }
      
      if(_package.pendiente === 0){
        _package.status = 'Entregado'
      }
  
      console.log(_package, 'pp')
      
      await PackagesSrc.update(this.props.match.params.id, _package);

      message.success('Actualizado satisfactoriamente');

      this.props.history.push('/packages')

    } catch (e) {

      message.error(e && e.message ? e.message : 'Error al guardar el paquete');

      this.setState({ loading: false });
    }
  };

  onBack = () => {
    this.props.history.push('/packages');
  };

  validateFields = async() => {

    try {

      let errors = {}

      if(!this.state.client_data) {
        errors.client = 'Es necesario buscar al cliente'
      }

      if(!this.state.tracking_number) {
        errors.tracking_number = 'El nro. de tracking es requerido'
      }

      if(!this.state.description) {
        errors.description = 'La descripcion es requerida'
      }

      if(!this.state.weight) {
        errors.weight = 'El peso es requerido'
      }

      if(!this.state.status) {
        errors.status = 'El estado es requerido'
      }
      
      if(parseInt(this.state.abono) < 0){
        errors.abono = 'El monto de anticipo no puede ser menor a 0'
      }
      
      if((parseInt(this.state.abono) + parseInt(this.state.pendiente)) > parseInt(this.state.total)){
        errors.pendiente = 'El monto de anticipo no puede ser mayor al total'
      }
      
      this.setState({ errors })

      if (Object.keys(errors).length > 0)
        throw errors;

      return false

    } catch (errors) {
      throw errors;
    }
  }

  handleBlur = () => {
    this.validateFields()
  }
  
  pendint_calculate  = (value) =>{
  console.log(value,'value')
  let tmp = 0
    
    if(!value || isNaN(value) || value === ''){ console.log('1')
      if(parseInt(this.state.total) && !isNaN(parseInt(this.state.anticipo))) {
        tmp = (parseInt(this.state.total ) - parseInt(this.state.anticipo))
      }
    }else {console.log('2')
      
      tmp = 0;
      tmp = this.state.anticipo > 0 ? parseInt(this.state.pendiente) - value : parseInt(this.state.total) - value
    }
    
    this.setState({pendiente: tmp}, _=> console.log(this.state.pendiente,'pendiente'))
    
    return tmp
  }

  searchClient = async client_id => {

    try {

      await this.setState({ clientLoading: true });

      let client = await ClientsSrc.getByClientId(client_id);

      await this.setState({ clientLoading: false, client_data: client[0] });

      this.handleBlur()

    } catch (e) {
      this.setState({ clientLoading: false });
      message.error(e);
    }
  }

  render() {
    const {
      loading,
      clientLoading,
      errors,
      tracking_number,
      description,
      weight,
      client_id,
      client,
      client_data,
      main_address,
      status,
      package_id,
      abono
    } = this.state;

    return (
      <div>
        <Card title='Editar Paquete' style={{ width: '100%' }} loading={loading}>
          <Form>
            <Form.Item
              required
              validateStatus={errors.client && 'error'}
              help={errors.client}
              label={'Codigo del Cliente'}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <Row gutter={24}>
                <Col span={20}>
                  <UIIntegerInput
                    onBlur={this.handleBlur}
                    onChange={e => this.handleChange('client_id', e.target.value)}
                    disabled={clientLoading}
                    value={client_id}
                    placeholder='Codigo del Cliente'
                  />
                </Col>
                <Col span={4}>
                  <Button
                    loading={clientLoading}
                    type='primary'
                    onClick={_ => this.searchClient(client_id)}
                  >
                    Buscar
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              required
              validateStatus={errors.client && 'error'}
              help={errors.client}
              label={'Cliente'}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <ClientSearchSelect
                onBlur={this.handleBlur}
                value={client}
                onChange={value => this.handleChange('client', value)}
              />

            </Form.Item>
            {client_data &&
            <div>
              <Form.Item
                label='Codigo del Cliente'
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
              >
                {client_data.client_id}
              </Form.Item>

              <Form.Item
                label='Nombre del Cliente'
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
              >
                {client_data.name}
              </Form.Item>

              <Form.Item
                label='Entrega'
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
              >
                {client_data.entrega}
              </Form.Item>

              <Form.Item
                label='Tarifa'
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
              >
                {Accounting.formatMoney(client_data.cuota, 'Q')}
              </Form.Item>
  
              <Form.Item
                label='No. de Paquete'
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
              >
                {package_id}
              </Form.Item>

            </div>
            }
            
            <Form.Item
              label={'Dirección'}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <Input
                onBlur={this.handleBlur}
                placeholder={'Dirección'}
                value={main_address}
                onChange={e => this.handleChange('main_address', e.target.value)}
              />
            </Form.Item>

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
              validateStatus={errors.weight && 'error'}
              help={errors.weight}
              label={'Peso (Libras)'}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <InputNumber
                onBlur={this.handleBlur}
                style={{ width: '100%' }}
                placeholder={'Peso (Libras)'}
                value={weight}
                onChange={value => this.handleChange('weight', value)}
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

            <Form.Item
              required
              validateStatus={errors.status && 'error'}
              help={errors.status}
              label={'Estado'}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              <PackageStatusSelect
                onChange={value =>  this.handleChange('status', value)}
                value={status}
                placeholder={'Estado'}
              />
            </Form.Item>
            { this.state.status === 'Entregado con saldo pendiente' &&
              <div>
                <Form.Item
                  validateStatus={errors.abono && 'error'}
                  help={errors.abono}
                  label={'Anticipo'}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input
                    onBlur={e => this.pendint_calculate(e.target.value)}
                    placeholder={'0.00'}
                    value={abono}
                    onChange={e => this.handleChange('abono', e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  validateStatus={errors.pendiente && 'error'}
                  help={errors.pendiente}
                  label={'Saldo pendiente'}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  {this.state.pendiente}
                  
                </Form.Item>
              </div>
            }
            <Form.Item
              label='Total a Pagar'
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {client_data && !isNaN(weight) ? Accounting.formatMoney(client_data.cuota * weight, 'Q') : 'Q0'}
            </Form.Item>
            
            <FormItem wrapperCol={{ span: 6, offset: 9 }}>
              <Button type='primary' onClick={this.onSave} loading={loading}>Actualizar</Button>
              <Button type='danger' className='btn-separator' onClick={this.onBack} loading={loading}>Regresar</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

const WrappedCreateForm = Form.create()(PackageAdminEditForm);
export default withRouter(WrappedCreateForm)