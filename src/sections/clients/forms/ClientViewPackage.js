import React from 'react';
import Accounting from 'accounting';
import { withRouter } from 'react-router';
import { Card, message, Divider, Col, Row, Table, Button, Icon, Input } from 'antd';
import  { Cache } from 'aws-amplify';
import ClientsSrc from '../ClientsSrc';
import Highlighter from 'react-highlight-words';

const DescriptionItem = ({ title, content }) => (
	<div className='desc-item-div'>
		<p className='desc-item-p'>{title}:</p>
		{content}
	</div>
);

class ClientViewPackage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
      notDeliveredPackages: [],
      deliveredPackages: [],
			loading: false,
			errors: {}
		};

		this.getColumns = this.getColumns.bind(this);
		this.getData = this.getData.bind(this);
		this.loadPackage = this.loadPackage.bind(this);
		this.onAddPackage = this.onAddPackage.bind(this);
	}

	componentDidMount(){
		this.loadPackage();
	}

	loadPackage = async() => {
		try{
			this.setState({ loading: true })
			await ClientsSrc.getPackage(this.props.match.params.id).then(
        packages => {
          this.setState({data: packages.profile}, _ => {
            if(packages.profile === 'cliente'){
              let profile = packages.profile
              Cache.setItem('userApp',profile);
            }
          });
          this.setState({
            notDeliveredPackages: packages.packages.filter(p => p.status !== 'Entregado' && p.status !== 'Entregado.'),
            deliveredPackages: packages.packages.filter(p => p.status === 'Entregado' || p.status === 'Entregado.')
          });
					}
			)
   
   
			this.setState({ loading: false });
		} catch (e) {
			console.log(e)
			if (e && e.message) {
				message.error(e.message);
			}
			this.setState({ loading: false })
		}
	};
  
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };
  
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });
  
	getColumns = ()=>{
		let columns = [
			{ title: 'Ref#', dataIndex: 'package_id', key: 'package_id', ...this.getColumnSearchProps('package_id') },
			{ title: 'Tracking', dataIndex: 'tracking', key: 'tracking', ...this.getColumnSearchProps('tracking')  },
			{ title: 'Estado', dataIndex: 'status', key: 'status' },
			{ title: 'Peso', dataIndex: 'weight', key: 'weight' },
			{ title: 'Ingreso', dataIndex: 'ing_date', key: 'ing_date' },
			{ title: 'Entrega', dataIndex: 'ent_date', key: 'ent_date' },
			{ title: 'Total', dataIndex: 'total_a_pagar', key: 'total_a_pagar' },
			{ title: 'Pendiente', dataIndex: 'anticipo', key: 'anticipo' }
		];
		return columns
	}

	getData = (data)=>{
		return data.map( (d) => ({
			key: d.package_id,
			package_id: d.package_id,
			tracking:  d.tracking,
			status: d.status,
			weight: d.weight,
			ing_date: d.ing_date,
			ent_date: d.ent_date,
			total_a_pagar: Accounting.formatMoney(d.total_a_pagar, 'Q'),
			anticipo: Accounting.formatMoney(d.total_a_pagar-d.anticipo, 'Q')
		}));
	};

	onBack = () => {
		this.props.history.push('/clients');
	};

	onAddPackage = () => {
		this.props.history.push(`/clients/addpackage`);
	};

	render() {
		const { loading } = this.state;
		return (
			<div>
				<Card loading={loading} title={`Código: ${this.state.data.client_id } - ${this.state.data.name}`} style={{ width: '100%' }}  extra={ (Cache.getItem('userApp').profile === 'cliente') ? <Button type='primary' icon='file-add' title='Registrar paquete' onClick={this.onAddPackage}>Registrar Paquete</Button> : ''} >
					<Row>
						<Col span={17}>
							<DescriptionItem title='Email' content={this.state.data.email} />
						</Col>
						<Col span={7}>
							<DescriptionItem title='Teléfono' content={this.state.data.phone} />
						</Col>
					</Row>
					<Row>
						<Col span={17}>
							<DescriptionItem title='Dirección' content={this.state.data.main_address} />
						</Col>
            <Col span={7}>
              <DescriptionItem title='Nit' content={this.state.data.nit} />
            </Col>
					</Row>
          <Row>
            <Col span={17}>
              <DescriptionItem title='Cuota' content={this.state.data.cuota} />
            </Col>
            <Col span={7}>
              <DescriptionItem title='Preferencia de entrega' content={this.state.data.entrega} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem title='Observaciones' content={this.state.data.message_user} />
            </Col>
          </Row>
				</Card>
				<Divider/>
        <h3>Paquetes Pendientes</h3>
        <Table loading={this.props.loading} columns={this.getColumns()} dataSource={this.getData(this.state.notDeliveredPackages)} pagination={false}/>
        <br/>
				<h4>Total de Paquetes Pendientes: {this.state.notDeliveredPackages && this.state.notDeliveredPackages.length > 0 ? this.state.notDeliveredPackages.length : 0}</h4>
        <h4>Total Libras Pendientes: {this.state.notDeliveredPackages && this.state.notDeliveredPackages.length > 0 ? this.state.notDeliveredPackages.map(p => p.weight).reduce((a, b) => a + b) : 0}</h4>
        <h4>Monto Total Pendiente: {Accounting.formatMoney(this.state.notDeliveredPackages && this.state.notDeliveredPackages.length > 0 ? this.state.notDeliveredPackages.map(p => p.total_a_pagar - p.anticipo).reduce((a, b) => a + b) : 0, 'Q')}</h4>
        <Divider/>
        <h3>Paquetes Entregados</h3>
        <Table loading={this.props.loading} columns={this.getColumns()} dataSource={this.getData(this.state.deliveredPackages)} pagination={false}/>
			  <br/>
				<h4>Total de Paquetes Entregados: {this.state.deliveredPackages && this.state.deliveredPackages.length > 0 ? this.state.deliveredPackages.length : 0}</h4>
        <h4>Total Libras Entregadas: {this.state.deliveredPackages && this.state.deliveredPackages.length > 0 ? this.state.deliveredPackages.map(p => p.weight).reduce((a, b) => a + b) : 0}</h4>
        <h4>Monto Total Entregado: {Accounting.formatMoney(this.state.deliveredPackages && this.state.deliveredPackages.length > 0 ? this.state.deliveredPackages.map(p => Number(p.total_a_pagar)).reduce((a, b) => a + b) : 0, 'Q')}</h4>
      </div>
		);
	}
}

export default withRouter(ClientViewPackage)