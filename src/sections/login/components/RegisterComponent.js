//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Form, Input, Button, Card , Checkbox , message} from 'antd';
import { verifyEmail, verifyPassword } from '../../../config/util';

//Api

//Components
import  { Auth } from 'aws-amplify';
//Styles

//const
const FormItem = Form.Item;

class RegisterComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            fullname: '',
            errors: {},
            loading: false,
            checked: false
        }
        this.onSignUp = this.onSignUp.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = async event => {
        const { target } = event
        const value = target.type === 'checkbox' ? target.checked : target.value
        const { name } = target
        await this.setState({ [name]: value })
    }

    onSignUp = async(e) => {
        try{
            e.preventDefault()
            this.setState({ loading: true })
            await this.validateFields()

            await Auth.signUp({
                  username: this.state.email,
                  password: this.state.password,
                  attributes: {
                      email: this.state.email,
                      name: this.state.fullname
                  },
                  validationData: []  //optional
              })
              .then(data => {
                  console.log(data);
                  this.props.actionRegister();
              })
              .catch(e => {
                  if (e.message.indexOf('An account with') > -1) {
                      message.error('Ya existe un usuario con el email ingresado');
                  }
                  this.setState({ loading: false })
              });

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
            if (!this.state.email) {
                errors.email = 'El email es requerido'
            }else if (verifyEmail(this.state.email)){
                errors.email = 'Email invalido';
            }

            if (!this.state.password) {
                errors.password = 'La contraseña requerida'
            }else if (verifyPassword(this.state.password)){
                errors.password = 'La contraseña debe contener al menos: 6 caracteres, numeros y letras';
            }
            if (!this.state.fullname) {
                errors.fullname = 'El nombre es requerido'
            }
            if (!this.state.checked) {
                errors.checked = 'Debe aceptar terminos y condiciones'
            }
            this.setState({ errors });

            if (Object.keys(errors).length > 0)
                throw errors

            return false

        } catch (errors) {
            throw errors
        }
    };

    onChange = e => {
        this.setState({
            checked: e.target.checked,
        });
    };

    render() {
        const { email, password, fullname, errors, loading } = this.state;
        return (
          <div>
              <Card title="Crear Cuenta" style={{ width: '100%' }}>
                  <Form className="login-form" autoComplete="off">
                      <FormItem
                        required
                        validateStatus={errors.email && 'error'}
                        help={errors.email}
                        label="Email" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                          <Input type='email' autoComplete='off' name={'email'} value={email} onChange={this.handleChange}  />
                      </FormItem>
                      <FormItem
                        required
                        validateStatus={errors.fullname && 'error'}
                        help={errors.fullname}
                        label="Nombre Completo" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                          <Input type='text' autoComplete='off' name={'fullname'} value={fullname} onChange={this.handleChange} />
                      </FormItem>
                      <FormItem
                        required
                        validateStatus={errors.password && 'error'}
                        help={errors.password}
                        label="Password" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                          <Input type='password' autoComplete='off' name={'password'} value={password} onChange={this.handleChange} />
                      </FormItem>
                      <FormItem
                        required
                        validateStatus={errors.checked && 'error'}
                        help={errors.checked}
                        labelCol={{ span: 6 }}>
                          <p><a target="_blank" rel="noopener noreferrer"  href="http://traestodo.com/traestodo17/terms.php">Leer terminos y condiciones</a></p>
                          <Checkbox checked={this.state.checked} onChange={this.onChange}>Acepto terminos y condiciones</Checkbox>
                      </FormItem>
                      <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                          <Button type="primary" loading={loading} className="login-form-button" onClick={this.onSignUp}>Registrarse</Button>
                          <Button className="btn-link" onClick={this.props.actionChangeState}>Ya tiene una cuenta?</Button>
                      </FormItem>
                  </Form>
              </Card>
          </div>
        );
    }
}

export default withRouter(RegisterComponent)