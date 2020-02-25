//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Form, Input, Button, Card } from 'antd';
import { Auth } from 'aws-amplify';
//Api

//Components

//Styles

//const
const FormItem = Form.Item;

class ForgotPassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      recovery: true,
    }
    this.onRecovery = this.onRecovery.bind(this);
  }

  handleChange = async event => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target
    await this.setState({ [name]: value })
  }

  onRecovery = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    Auth.forgotPassword(this.state.email)
      .then(data =>{
        console.log(data)

        this.setState({ loading: false, recovery: false })
      } )
      .catch(err => {
        console.log(err)
        this.setState({ loading: false })
      });
  };

  onConfirmPawd = (e)=>{
    e.preventDefault()
    this.setState({ loading: true })
    Auth.forgotPasswordSubmit(
      this.state.email,
      this.state.code,
      this.state.password
    )
      .then(data => {
        console.log(data)
        this.setState({ loading: false })
        this.props.actionChangeState()
      })
      .catch(err => {
        console.log(err)
        this.setState({ loading: false })
      });
  }

  render() {
    const { email, password, code, loading } = this.state;
    return (
      <div>
        <Card title="Olvidó su contraseña" style={{ width: '100%' }}>
          {this.state.recovery &&
            <div>
              <span>Ingrese su email y le enviaremos un codigo de verificacion</span>
              <Form className="login-form">
                <FormItem label="Email" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  <Input type='email' autoComplete='off' name={'email'} value={email} onChange={this.handleChange}  />
                </FormItem>
                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                  <Button type="primary" loading={loading} className="login-form-button" onClick={this.onRecovery}>Recuperar contraseña</Button>
                  <Button className="btn-link" onClick={this.props.actionChangeState}>Regresar</Button>
                </FormItem>
              </Form>
            </div>
          }

          { !this.state.recovery &&
            <div>
              <Form className="login-form">
                <FormItem label="Email" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  <Input type='email' autoComplete='off' name={'email'} value={email} onChange={this.handleChange}  />
                </FormItem>
                <FormItem label="Code" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  <Input type='text' autoComplete='off' name={'code'} value={code} onChange={this.handleChange}  />
                </FormItem>
                <FormItem label="Nueva password" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                  <Input type='password' autoComplete='off' name={'password'} value={password} onChange={this.handleChange}  />
                </FormItem>
                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                  <Button type="primary" loading={loading} className="login-form-button" onClick={this.onConfirmPawd}>Actualizar</Button>
                  <Button className="btn-link" onClick={this.props.actionChangeState}>Regresar</Button>
                </FormItem>
              </Form>
            </div>
          }
        </Card>
      </div>
    );
  }
}

export default withRouter(ForgotPassword)