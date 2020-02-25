//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Accounting from 'accounting';

//Api
import ReportSrc from '../reports/ReportsSrc';

//Components
import UIDateSelect from '../../commons/components/UIDateSelect';
import UIIntegerInput from '../../commons/components/UIIntegerInput';
import ClientSearchSelect from '../clients/components/ClientSearchSelect';
import ResumeTable from './components/ResumenTable';
import AccountTable from './components/AccountTable';
import {
  Form,
  DatePicker,
  Divider,
  Statistic,
  Input,
  Select,
  Button,
  Card,
  Col,
  Row,
  message
} from 'antd';

//Styles

//const
const FormItem = Form.Item;
const Option = Select.Option;

class ReportsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      radioValue: 'today',
      dateRange: null,
      type: 'CIERRE',
      accounting: 'general',
      code: null,
      data:[],
      loading: false,
      errors: {}
    }

    this.onSearch = this.onSearch.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  onSearch = async () => {
    try {

      await this.validateFields();
      this.setState({ loading: true });
      let params = {
        total: false,
        date: this.state.date ? this.state.date.format('YYYY-MM-DD') : null
      }
      
      let counts;
      let data;
      
      switch (this.state.type){
        case 'BODEGA':
          params.total = true;
          counts = await ReportSrc.warehouseTotal(params)
          data = await ReportSrc.warehouseDetails()
          break;
        case 'CIERRE':
          params.total = true
            counts = await ReportSrc.totals(params)
            data = await ReportSrc.closedReport(params)
          break;
        case 'ENTRADA':
          params.total = true;
          counts = await ReportSrc.entriesTotal(params)
          data = await ReportSrc.entriesDetails(params)
          break;
        case 'RUTA':
          params.total = true;
          counts = await ReportSrc.routeTotal(params)
          data = await ReportSrc.routeDetails()
          break;
        case 'CUENTAS':
          
          if(this.state.accounting === 'client_id'){
            data = await ReportSrc.state_account(`?client_id=${this.state.codigo}`)
          }
          if(this.state.accounting === 'package_id'){
            data = await ReportSrc.state_account(`?package_id=${this.state.codigo}`)
          }else if(this.state.accounting === 'general') {
            data = await ReportSrc.state_account(null)
          }
          
          console.log(data, 'data')
          break;
        default:
          console.log('no actions')
      }
      
      this.setState({ counters: counts ? counts[0] : false, data: data, loading: false })

    } catch (e) {
      console.log(e);
      if (e && e.message) {
        message.error(e.message);
      }
      this.setState({ loading: false });
    }
  }

  validateFields = async() => {
    try {
      let errors = {}
      if((this.state.type === 'RUTA' || this.state.type === 'BODEGA') && this.state.date) {
        errors.date = 'La fecha es requerida'
      }

      this.setState({ errors });
      if (Object.keys(errors).length > 0)
        throw errors

      return false
    } catch (errors) {
      console.log(errors)
      throw errors
    }
  };

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

    this.setState({ [name]: value, ...otherState })
  }
  
  render() {

    const {
      dateRange,
      client_id,
      client,
      type,
      date,
      counters,
      data,
      loading,
      accounting,
      errors,
      codigo
    } = this.state;

    return (
      <div>
        <div className={'table-action-bar'}>
          <h2>Reportes</h2>
        </div>
        <Form>
          <Card>
            <Row>
              <Col span={12}>
                <FormItem label='Tipo de Reporte' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  <Select
                    placeholder='Seleccione'
                    onChange={value => this.handleChange('type', value)}
                    value={type}
                    defaultValue={type}
                  >
                    <Option value='GENERAL'>General</Option>
                    <Option value='BODEGA'>Bodega</Option>
                    <Option value='ENTRADA'>Entradas</Option>
                    <Option value='CIERRE'>Cierre</Option>
                    <Option value='RUTA'>Ruta</Option>
                    <Option value='CUENTAS'>Estado de Cuentas</Option>
                  </Select>
                </FormItem>
              </Col>
              {this.state.type === 'GENERAL' &&
              <div>
                <Col span={12}>
                  <FormItem
                    label='Fecha'
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 12 }}
                  >
                    <UIDateSelect
                      onChange={value => this.handleChange('dateRange', value)}
                      value={dateRange}
                      placeholder={'Fecha'}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label='Cod. Cliente' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <UIIntegerInput
                      onBlur={this.handleBlur}
                      onChange={e => this.handleChange('client_id', e.target.value)}
                      value={client_id}
                      placeholder='Cod. Cliente'
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label='Nombre Cliente' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <ClientSearchSelect
                      value={client}
                      onChange={value => this.handleChange('client', value)}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label='Nro. Tracking' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <Input placeholder={'Nro. Tracking'} />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label='Estado' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <Select placeholder='Seleccione'>
                      <Option value='registrado'>Registrado</Option>
                      <Option value='transito'>En transito guatemala</Option>
                      <Option value='recibidofi'>Recibido en oficina</Option>
                      <Option value='ruta'>En ruta</Option>
                      <Option value='entregado'>Entregado</Option>
                      <Option value='tba'>TBA</Option>
                    </Select>
                  </FormItem>
                </Col>
              </div>
              }
              
              {(this.state.type === 'CIERRE' || this.state.type === 'ENTRADA') &&
                <Col span={12}>
                  <FormItem
                    label='Fecha'
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 12 }}
                    required
                    validateStatus={errors.date && 'error'}
                    help={errors.date}
                  >
                    <DatePicker 
                      placeholder='Seleccione una Fecha'
                      onChange={value => this.handleChange('date', value)}
                      value={date} style={{ width: '300px'}}
                    />
                  </FormItem>
                </Col>
              }
  
              {(this.state.type === 'CUENTAS' ) &&
              <Col span={6}>
                <FormItem label='Estado' labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                <Select
                  placeholder='Seleccione'
                  onChange={value => this.handleChange('accounting', value)}
                  value={accounting}
                  defaultValue={accounting}>
                  <Option value='general'>General</Option>
                  <Option value='client_id'>Por Cliente</Option>
                  <Option value='package_id'>Por Paquete</Option>
                </Select>
                </FormItem>
              </Col>
              }
  
              {(this.state.accounting === 'client_id' ||  this.state.accounting === 'package_id') &&
              <Col span={6}>
                <FormItem
                  required
                  validateStatus={errors.codigo && 'error'}
                  help={errors.codigo}
                  label="codigo" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                  <UIIntegerInput
                    onChange={e => this.handleChange('codigo', e.target.value)}
                    value={codigo}
                    placeholder='codigo'
                  />
                </FormItem>
              </Col>
              }
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
        {counters  &&
          <div style={{ textAlign: 'center' }}>
            <Row gutter={24}>
              <Col span={8}>
                <Statistic title='Total de Paquetes' value={ counters.tota_paquetes || 0 } />
              </Col>
              <Col span={8}>
                <Statistic title='Total de Libras' value={ counters.total_libras || 0 } />
              </Col>
              <Col span={8}>
                <Statistic title={`Total ${this.state.type !== 'CIERRE' && this.state.type !== 'ENTRADA' ?  'por Cobrar' : 'Cobrado'}`} value={Accounting.formatMoney(counters.total_cobrado || counters.total_por_cobrar || 0, 'Q')} />
              </Col>
            </Row>
            <ResumeTable
              loading={this.state.loading}
              packages={data}
            />
          </div>
        }
        
        { (this.state.type === 'CUENTAS' && data.length > 0 ) &&
          <AccountTable
            loading={this.state.loading}
            packages={data}
            />
        }
      </div>
    )
  }
}

export default withRouter(ReportsPage)
