import React from 'react';
import { withRouter } from 'react-router';
import { Form, Input, Button, Switch , Card, message } from 'antd';
import { utilChange } from '../../../config/util';
import  { Cache } from 'aws-amplify';

import UsersSrc from '../UsersSrc';

const FormItem = Form.Item;

class UsersEditForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			type: '',
			activo: 'Y',
			errors: {}
		};
		this.onSave = this.onSave.bind(this);
		this.loadUsers = this.loadUsers.bind(this);
	}

	loadUsers = () => {
		UsersSrc.get(this.props.match.params.id).then(
			profile => {
				this.setState({
					user_id:profile.id,
					email:profile.email,
					name:profile.name,
					type:profile.type,
					activo:profile.activo
				})
			}
		)
	};

	componentDidMount(){
		this.loadUsers();
	}

	onSave = async(e) => {
		try {
			e.preventDefault()
			this.setState({ loading: true })
			await this.validateFields()

			let _users = {
				user_id: this.state.user_id,
				type: this.state.type,
				name: this.state.name,
				activo: this.state.activo
			};
			await UsersSrc.update(_users,this.state.user_id);
			message.success('Registro actualizado');
			this.loadUsers();
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

				this.setState({ errors });
				if (Object.keys(errors).length > 0)
					throw errors

				return false
		} catch (errors) {
			throw errors
		}
	};

	onBack = () => {
		if(Cache.getItem('userApp').profile === 'recepcionista'){
			this.props.history.push('/clients/');
		}else{
			this.props.history.push('/users/');
		}
	};

	handleChange = event => {
		utilChange(event, (name, value) => {
			this.setState({ [name]: value })
		});
	};

	onActivoChanged = (value) => {
		this.setState({activo: (value) ? 'Y' : 'N' });
	};

	render() {

		const { errors, loading, email, name } = this.state;
		return (
			<div>
				<Card title='Editar' style={{ width: '100%' }}>
					<Form>
						<FormItem
							label='Email' labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							<Input
								name='email'
								value={email}
								disabled
							/>
						</FormItem>
						<FormItem
							required
							validateStatus={errors.name && 'error'}
							help={errors.name}
							label='Nombre' labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
							<Input
								placeholder="Nombre"
								name='name'
								onChange={this.handleChange}
								value={name}
								disabled={loading}
							/>
						</FormItem>
						<FormItem label='Activo' labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} className={(Cache.getItem('userApp').profile !== 'recepcionista') ? 'show' :'hidden'}>
							<Switch
								name='activo'
								checked={this.state.activo === 'Y'}
								onChange={this.onActivoChanged}
								disabled={loading}
							/>
						</FormItem>
						<FormItem wrapperCol={{ span: 6, offset: 9 }}>
							<Button type='primary' loading={loading} onClick={this.onSave}>Guardar</Button>
							<Button type='danger' className='btn-separator' onClick={this.onBack}>Regresar</Button>
						</FormItem>
					</Form>
				</Card>
			</div>
		);
	}
}

const WrappedCreateForm = Form.create()(UsersEditForm);
export default withRouter(WrappedCreateForm)
