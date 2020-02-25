import React from 'react';
import { withRouter } from 'react-router';
import { Card, message, Divider, Col, Row, Button } from 'antd';
import { utilChange, verifyPassword } from '../../../config/util';

import UsersSrc from '../UsersSrc';

const DescriptionItem = ({ title, content }) => (
		<div className="desc-item-div">
			<p className="desc-item-p">{title}:</p>
			{content}
		</div>
);


class UsersProfileForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loading: false,
			errors: {},
			showRow: false,
			password1: '',
			password2: ''
		};
		this.onSave = this.onSave.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	onSave = async(e) => {
		try {
			e.preventDefault()
			this.setState({ loading: true });
			await this.validateFields();

			let _users = {
				password1: this.state.password1,
				password2: this.state.password2
			};

			await UsersSrc.create(_users);
			message.success('Contrasena actualizada');
			return this.setState({ loading: false });

		} catch (e) {
			console.log(e)
			if (e && e.message) {
				message.error(e.message);
			}
			this.setState({ loading: false })
		}
	};

	onEdit = () => {
		this.props.history.push('/users/edit');
	};

	handleClick = (e) => {
		e.preventDefault();
		if(this.state.showRow){
			this.setState({showRow: false });
		}else{
			this.setState({showRow: true });
		}
	};

	componentDidMount(){
		UsersSrc.getProfile().then(profile => this.setState({data:profile[0]}))
	}

	validateFields = async() => {
		try {
			let errors = {}

			if(!this.state.password1 || !this.state.password2) {
				errors.password1 = 'La contraseña es requerida';
				errors.password2 = 'La confirmacion de contraseña es requerida';
			}else if(verifyPassword(this.state.password1) || verifyPassword(this.state.password2)){
				errors.password1 = 'Contraseña invalida';
				errors.password2 = 'Contraseña invalida';
			}else if(this.state.password1 !== this.state.password2){
				errors.password1 = 'Las contraseñas deben ser iguales ';
				errors.password2 = 'Las contraseñas deben ser iguales ';
			}
			this.setState({ errors });
			if (Object.keys(errors).length > 0)
				throw errors;
			return false

		} catch (errors) {
			throw errors
		}
	};

	handleChange = event => {
		utilChange(event, (name, value) => {
			this.setState({ [name]: value }, this.validate)
		});
	};

	render() {
		return (
			<div>
				<Card title="Mi Cuenta" style={{ width: '100%' }} extra={<Button type="default" icon="edit" onClick={this.onEdit}/>}>
					<Row>
						<Col span={12}>
							<DescriptionItem title="Codigo Cliente" content={this.state.data.client_id} />
						</Col>
						<Col span={12}>
							<DescriptionItem title="Nombre" content={this.state.data.name} />
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<DescriptionItem title="Nit" content={this.state.data.nit} />
						</Col>
					</Row>
					<Divider />
					<h3>Entrega</h3>
					<Row>
						<Col span={12}>
							<DescriptionItem title="Preferencia" content={this.state.data.entrega} />
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<DescriptionItem title="Direccion" content={this.state.data.main_address} />
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<DescriptionItem title="Observaciones" content={this.state.data.message_user} />
						</Col>
					</Row>
					<Divider />
					<h3>Contacto</h3>
					<Row>
						<Col span={12}>
							<DescriptionItem title="Email" content={this.state.data.email} />
						</Col>
						<Col span={12}>
							<DescriptionItem title="Telefono" content={this.state.data.phone} />
						</Col>
					</Row>
					{/*<Divider />
					<Row>
						<Col span={12}>
							<a href="#" onClick={this.handleClick}>Cambiar contraseña</a>
						</Col>
					</Row>
					<Row className={this.state.showRow ? '' : 'hidden'}>
						<Col span={6}>
							<span>
                La contraseña debe contener al menos:
                <ul>
                  <li> 6 caracteres </li>
                  <li> numeros </li>
                  <li> letras</li>
                </ul>
              </span>
						</Col>
						<Col span={12}>
							<FormItem
								required
								validateStatus={errors.password1 && 'error'}
								help={errors.password1}
								label="Nueva contraseña" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
								<Input.Password
									name="password1"
									onChange={this.handleChange}
									value={this.state.password1}
									disabled={loading}
								/>
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem
								required
								validateStatus={errors.password2 && 'error'}
								help={errors.password2}
								label="Repetir contraseña" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
								<Input.Password
									name="password2"
									onChange={this.handleChange}
									value={this.state.password2}
									disabled={loading}
								/>
							</FormItem>
						</Col>
						<Col span={12} offset={9}>
							<FormItem wrapperCol={{ span:12 }}>
								<Button type="primary" loading={loading} onClick={this.onSave}>Guardar</Button>
								<Button type="danger" className="btn-separator" onClick={this.onBack}>Cancelar</Button>
							</FormItem>
						</Col>
					</Row>*/}
				</Card>
			</div>
		);
	}

}

export default withRouter(UsersProfileForm)