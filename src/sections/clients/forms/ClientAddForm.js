import React from 'react';
import { withRouter } from 'react-router';
import { Form, Input, Select, Button, Radio, Switch , Card, message } from 'antd';
import { utilChange, verifyEmail, verifyPassword } from '../../../config/util';

import ClientsSrc from '../ClientsSrc';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ClientsAddForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      type: 'cliente',
      tarifa: 'normal',
      preferencia: 'traestodo',
      activo: 'Y',
      errors: {}
    };
    this.onSave = this.onSave.bind(this);
  }

  onSave = async(e) => {
    try {
      e.preventDefault()
      //this.setState({ loading: true })
      await this.validateFields()

      let _users = {
        type: 'cliente',
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        nit: this.state.nit,
        phone: this.state.phone,
        main_address: this.state.main_address,
        entrega: this.state.entrega,
        message_user: this.state.message_user,
        cuota: this.state.cuota
      };


      await ClientsSrc.create(_users);
      message.success('Creado satisfactoriamente');
      return this.setState({ loading: false });

    } catch (e) {
      console.log(e)
      if (e && e.message) {
        message.error(e.message);
      }
      this.setState({ loading: false })
    }
  };

  validateFields = async() => {
    try {
      let errors = {}
      if(!this.state.name) {
        errors.name = 'El nombre es requerido'
      }
      if(!this.state.password) {
        errors.password = 'La contraseña temporal es requerida'
      }else if (verifyPassword(this.state.password)){
        errors.password = 'Contraseña invalida';
      }
      if(!this.state.email) {
        errors.email = 'El email es requerido';
      }else if (verifyEmail(this.state.email)){
        errors.email = 'Email invalido';
      }
      this.setState({ errors });
      if (Object.keys(errors).length > 0)
        throw errors

      return false

    } catch (errors) {
      throw errors
    }
  };

  onBack = () => {
    this.props.history.push('/clients');
  };

  handleChange = event => {
    utilChange(event, (name, value) => {
      this.setState({ [name]: value }, this.validate)
    });
  };


  handleSelectChange = (value) => {
    this.setState({type: value });
  };

  handleSelectTarifaChange = (value) => {
    this.setState({cuota: value });
  };

  onPreferencesChanged = (e) => {
    this.setState({entrega: e.target.value });
  };

  onActivoChanged = (value) => {
    this.setState({activo: value });
  };

  render() {
    const { errors, loading } = this.state;
    return (
      <div>
        <Card title="Nuevo Cliente" style={{ width: '100%' }}>
          <Form>
            {/*<FormItem label="Tipo Usuario" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                          <Select placeholder="Seleccione"
                                  name="type"
                                  onChange={this.handleSelectChange}
                                  value={this.state.type}
                                  disabled={loading}
                          >
                              <Option value="cliente">Cliente</Option>
                              <Option value="vendedor">Usuario traesTodo</Option>
                              <Option value="admin">Administrador</Option>
                              <Option value="warehouse">Operador Guatemala</Option>
                              <Option value="delegate">Operador Miami</Option>
                          </Select>
                      </FormItem>*/}
            <FormItem
              required
              validateStatus={errors.email && 'error'}
              help={errors.email}
              label="Email" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
              <Input
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
                disabled={loading}
              />
            </FormItem>
            <FormItem
              required
              validateStatus={errors.name && 'error'}
              help={errors.name}
              label="Nombre" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
              <Input
                name="name"
                onChange={this.handleChange}
                value={this.state.name}
                disabled={loading}
              />
            </FormItem>x
            <FormItem
              required
              validateStatus={errors.password && 'error'}
              help={errors.password}
              label="Contraseña Temporal" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
              <Input.Password
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
                disabled={loading}
              />
              <span>
                          La contraseña debe contener al menos:
                          <ul>
                              <li> 6 caracteres </li>
                              <li> numeros </li>
                              <li> letras</li>
                          </ul>
                        </span>
            </FormItem>

            <div className={this.state.type !== 'cliente' ? 'hidden' : ''}>
              <FormItem label="Numero de telefono" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                <Input
                  name="phone"
                  onChange={this.handleChange}
                  value={this.state.phone}
                  disabled={loading}
                />
              </FormItem>
              <FormItem label = "Nit" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                <Input
                  name="nit"
                  onChange={this.handleChange}
                  value={this.state.nit}
                  disabled={loading}
                />
              </FormItem>
              <FormItem label="Tarifa" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                <Select placeholder="Selecciona tarifa"
                        name="cuota"
                        onChange={this.handleSelectTarifaChange}
                        value={this.state.cuota}
                        disabled={loading}
                >
                  <Option value="64">Q64 (Normal)</Option>
                  <Option value="80">Q80 (vip)</Option>
                  <Option value="61">Q61 (CC)</Option>
                  <Option value="25">Q25 (sobre)</Option>
                </Select>
              </FormItem>
              <FormItem label="Preferencia de entrega" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                <RadioGroup>
                  <Radio
                    value="Entrega en Traestodo"
                    checked={this.state.entrega === "Entrega en Traestodo"}
                    onChange={this.onPreferencesChanged}
                    disabled={loading}
                  >TraesTodo</Radio>
                  <Radio
                    value="Entrega a Domicilio"
                    checked={this.state.entrega === "Entrega a Domicilio"}
                    onChange={this.onPreferencesChanged}
                    disabled={loading}
                  >Domicilio</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="Direccion de entrega" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                <Input
                  name="main_address"
                  onChange={this.handleChange}
                  value={this.state.main_address}
                  disabled={loading}
                />
              </FormItem>
              <FormItem label="Observaciones" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                <Input
                  name="message_user"
                  onChange={this.handleChange}
                  value={this.state.message_user}
                  disabled={loading}
                />
              </FormItem>
            </div>

            <FormItem label="Activo" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
              <Switch
                name="activo"
                checked={this.state.activo === 'Y'}
                onChange={this.onActivoChanged}
                disabled={loading}
              />
            </FormItem>

            <FormItem wrapperCol={{ span: 6, offset: 9 }}>
              <Button type="primary" loading={loading} onClick={this.onSave}>Guardar</Button>
              <Button type="danger" className="btn-separator" onClick={this.onBack}>Regresar</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

const WrappedCreateForm = Form.create()(ClientsAddForm);
export default withRouter(WrappedCreateForm)
