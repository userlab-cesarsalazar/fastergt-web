//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Form, Input, Button, Card,message } from 'antd';
import { verifyEmail } from '../../../config/util';

//Api

//Components
import  { Auth } from 'aws-amplify';

//Styles

//const
const FormItem = Form.Item;

class ConfirmationAccount extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            code: '',
            errors: {},
            loading: false
        };
        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp = async(e) => {
        try{
            e.preventDefault()
            this.setState({ loading: true })
            await this.validateFields()

            await Auth.confirmSignUp(this.state.email, this.state.code, {
                // Optional. Force user confirmation irrespective of existing alias. By default set to True.
                forceAliasCreation: true
            }).then(data => {
                console.log(data);
                this.props.actionConfirm();
            }).catch(e => {
                console.log(e);
                if (e.message.indexOf('Username/client') > -1) {
                    message.error('No se encontro email y codigo ingresado');
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

    handleChange = async event => {
        const { target } = event
        const value = target.type === 'checkbox' ? target.checked : target.value
        const { name } = target
        await this.setState({ [name]: value })
    }

    validateFields = async() => {
        try {
            let errors = {}
            if (!this.state.email) {
                errors.email = 'El email es requerido'
            }else if (verifyEmail(this.state.email)){
                errors.email = 'Email invalido';
            }

            if (!this.state.code) {
                errors.code = 'El codigo es requerido'
            }

            this.setState({ errors });

            if (Object.keys(errors).length > 0)
                throw errors

            return false

        } catch (errors) {
            throw errors
        }
    };

    render() {
        const { email, code, loading, errors } = this.state;
        return (
          <div>
              <Card title="Confirmar cuenta" style={{ width: '100%' }}>
                  <span>Revise su email, para obtener el codigo de confirmacion</span>
                  <Form className="login-form" autoComplete='off'>
                      <FormItem
                        required
                        validateStatus={errors.code && 'error'}
                        help={errors.code}
                        label="Codigo" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                          <Input type='code'
                                 name='code'
                                 id='code'
                                 placeholder='Ingrese Codigo'
                                 value={code}
                                 onChange={this.handleChange} />
                      </FormItem>
                      <FormItem
                        required
                        validateStatus={errors.email && 'error'}
                        help={errors.email}
                        label="Email" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                          <Input type='email'
                                 name='email'
                                 id='email'
                                 placeholder='Ingrese Email'
                                 value={email}
                                 onChange={this.handleChange}/>
                      </FormItem>
                      <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                          <Button type="primary" className="login-form-button" loading={loading} onClick={this.onSignUp}>Iniciar sesion</Button>
                          <Button className="btn-link" onClick={this.props.actionChangeState}>Ya tiene una cuenta?</Button>
                      </FormItem>
                  </Form>
              </Card>
          </div>
        );
    }
}

export default withRouter(ConfirmationAccount)