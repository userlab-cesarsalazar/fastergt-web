import React from 'react';
import { withRouter } from 'react-router';
import { Form, Input, Select, Button, Radio, Switch , Card, message } from 'antd';
import { utilChange, verifyEmail, verifyPassword } from '../../../config/util';

import UsersSrc from '../UsersSrc';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class UsersAddForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tipo: 'cliente',
            tarifa: 'normal',
            preferencia: 'traestodo',
            activo: 'Y',
            errors: {}
        };
        this.onSave = this.onSave.bind(this);
        this.init = this.init.bind(this);
    }

    onSave = async(e) => {
        try {
            e.preventDefault()
            this.setState({ loading: true })
            await this.validateFields()

            let _users = {
                type: this.state.type,
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            };
            await UsersSrc.create(_users);
            message.success('Creado satisfactoriamente');
            this.init();
            return this.setState({ loading: false });
        } catch (err) {
            if((typeof err === 'string') && err.indexOf('Duplicate') > -1) {
                message.error('Ya existe un usuario con el email ingresado');
            }
            this.setState({ loading: false })
        }
    };

    init = () => {
        this.setState({
            type: '',
            name: '',
            email: '',
            password: ''
        });
    }

    validateFields = async() => {
        try {
            let errors = {}

            if(!this.state.type) {
                errors.type = 'El tipo es requerido'
            }
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
        this.props.history.push('/users');
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
              <Card title="Nuevo Usuario" style={{ width: '100%' }}>
                  <Form autoComplete="off">
                      <FormItem label="Tipo Usuario" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                          <Select placeholder="Seleccione"
                                  name="type"
                                  onChange={this.handleSelectChange}
                                  value={this.state.type}
                                  disabled={loading}
                          >
                              <Option value="vendedor">Usuario traesTodo</Option>
                              <Option value="admin">Administrador</Option>
                              <Option value="warehouse">Operador Guatemala</Option>
                              <Option value="delegate">Operador Miami</Option>
                              <Option value="recepcionista">Recepcionista</Option>
                          </Select>
                      </FormItem>
                      <FormItem
                        required
                        validateStatus={errors.email && 'error'}
                        help={errors.email}
                        label="Email" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                          <Input
                            name="email"
                            placeholder="Email"
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
                            placeholder="Nombre"
                            name="name"
                            onChange={this.handleChange}
                            value={this.state.name}
                            disabled={loading}
                          />
                      </FormItem>
                      <FormItem
                        required
                        validateStatus={errors.password && 'error'}
                        help={errors.password}
                        label="Contraseña Temporal" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                          <Input.Password
                            placeholder="Contraseña Temporal"
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
                                  <Option value="normal">Q60 (Normal)</Option>
                                  <Option value="cc">Q56 (CC)</Option>
                                  <Option value="vip">Q55 (Vip)</Option>
                                  <Option value="c">Q50 (C)</Option>
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

const WrappedCreateForm = Form.create()(UsersAddForm);
export default withRouter(WrappedCreateForm)
