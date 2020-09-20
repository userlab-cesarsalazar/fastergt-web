//Libs
import React, { Component } from 'react'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import { menuOptions } from './commons/consts/Menu'
import moment from 'moment'
import { Auth ,Cache} from 'aws-amplify'
import { withUserDefaults } from './commons/components/UserDefaults';

//Services

//Pages
//Login
import LoginPage from './sections/login/LoginPage'

//DashBoard
import DashboardPage from './sections/dashboard/DashboardPage'

//Clients
import ClientsPage from './sections/clients/ClientsPage'
import ClientsAddForm from './sections/clients/forms/ClientAddForm'
import ClientProfileForm from './sections/clients/forms/ClientProfileForm'
import ClientEditForm from './sections/clients/forms/ClientEditForm'
import ClientViewPackage from './sections/clients/forms/ClientViewPackage'
import ClientAddPackage from './sections/clients/forms/ClientAddPackage'

//Users
import UsersPage from './sections/users/UsersPage'
import UsersAddForm from './sections/users/forms/UsersAddForm'
import UsersProfileForm from './sections/users/forms/UsersProfileForm'
import UsersEditForm from './sections/users/forms/UsersEditForm'

//Packages
import PackagesPage from './sections/packages/PackagesPage'
import PackageAddForm from './sections/packages/forms/PackageAddForm'
import PackageAdminAddForm from './sections/packages/forms/PackageAdminAddForm'
import PackageAdminEditForm from './sections/packages/forms/PackageAdminEditForm'

//Reports
import ReportsPage from './sections/reports/ReportsPage'

//Transfer
import TransferPage from './sections/transfer/TransferPage'

//Components
import UISpinner from './commons/components/UISpinner'

import { Layout, Menu, Icon, Avatar } from 'antd'

const { Header, Content, Footer, Sider } = Layout

const SubMenu = Menu.SubMenu

//Const
const routes = [
  { route: '/dashboard', component: DashboardPage, profiles: ['admin'] },
  { route: '/reports', component: ReportsPage, profiles: ['admin'] },
  { route: '/clients', component: ClientsPage, profiles: ['admin', 'recepcionista','warehouse'] },
  { route: '/packages', component: PackagesPage, profiles: ['admin','warehouse'] },
  { route: '/clients/create', component: ClientsAddForm, profiles: ['admin','recepcionista'] },
  { route: '/clients/profile', component: ClientProfileForm, profiles: ['admin', 'cliente', 'recepcionista'] },
  { route: '/clients/edit/:id', component: ClientEditForm, profiles: ['admin', 'cliente','recepcionista'] },
  { route: '/clients/viewpackage/:id', component: ClientViewPackage, profiles: ['admin', 'cliente', 'recepcionista','warehouse'] },
  { route: '/clients/addpackage', component: ClientAddPackage, profiles: ['cliente'] },
  { route: '/packages/create', component: PackageAddForm, profiles: ['admin','warehouse'] },
  { route: '/packages/admincreate', component: PackageAdminAddForm, profiles: ['admin','warehouse'] },
  { route: '/packages/adminupdate/:id', component: PackageAdminEditForm, profiles: ['admin'] },
  { route: '/users', component: UsersPage, profiles: ['admin'] },
  { route: '/users/create', component: UsersAddForm, profiles: ['admin'] },
  { route: '/users/profile', component: UsersProfileForm, profiles: ['admin'] },
  { route: '/users/edit/:id', component: UsersEditForm, profiles: ['admin'] },
  { route: '/login', component: LoginPage, profiles: ['admin', 'cliente', 'recepcionista','warehouse'] },
  { route: '/transfers', component: TransferPage, profiles: ['admin'] }
]

class Router extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: false,
      login: false,
      loading: true,
      username: '',
      UserStorage: null,
      menuLoading: true,
      menuOptions: null,
      routes: [],
      year: moment().format('YYYY'),
      visible: false
    }
    this.handleSignOut = this.handleSignOut.bind(this)
    this.loadPage = this.loadPage.bind(this)
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        let profile = {};
        if(!Cache.getItem('userApp')) {
          profile.token = user.signInUserSession.idToken.jwtToken;
          profile.profile = user.attributes.profile || 'cliente';
          profile.attributes = JSON.stringify(user.attributes);
          Cache.setItem('userApp', profile);
        }

        this.setState({ login: true, loading: false })
      })
      .catch(err => console.log(err))
  }

  onCollapse = collapsed => {
    this.setState({ collapsed })
  }

  handleSignOut = e => {
    this.setState({ loading: true });
    Auth.signOut()
        .then(() => {
          this.props.history.push('/')
          setTimeout(function() {
            window.location.reload()
          }, 2000)
        })
        .catch(err => console.log(err))
  };

  showProfile = () => {
    this.props.history.push('/clients/profile');
  };

  changeLanguage = language => {
    this.props.userDefaults.changeLanguage(language);
  };

  loadPage = (page) => {
    if(Cache.getItem('userApp').profile === 'cliente'){
      return `/${page}/${Cache.getItem('userApp').client_id}`;
    }else{
      return page;
    }
  };

  getFilterRoutes = _ => {

    let filterRoutes = [];

    if (Cache.getItem('userApp'))
    filterRoutes = routes.filter(r => r.profiles.find(p => p === Cache.getItem('userApp').profile))

    return filterRoutes
  }

  render() {
    const {
      getWord
    } = this.props.userDefaults;
    let filterRoutes = this.getFilterRoutes();

    return (
      <div>
        {this.state.login ? (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider width={240} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{ background: '#c7e4fb' }}>
              <header className='App-header'>
                <Avatar
                  src={'https://images-traestodo.s3.amazonaws.com/logo_trasn.png'}
                  shape={'square'}
                  size={this.state.collapsed ? 40 : 80}
                />
                {!this.state.collapsed && <h2 className='App-version'>v{process.env.REACT_APP_VERSION}</h2>}
              </header>

              <br />

              <Menu  mode='inline' selectedKeys={[this.props.location && this.props.location.pathname]} style={{ background: '#c7e4fb' }}>
                {menuOptions &&
                  menuOptions.length > 0 &&
                  menuOptions.map((option, i) =>
                    option.sections && option.sections.length > 0 ? (
                      <SubMenu
                        key={`menu${i}`}
                        title={
                          <span>
                            <Icon type={option.icon} />
                            <span>{option.name}</span>
                          </span>
                        }
                      >
                        {option.sections &&
                          option.sections.length > 0 &&
                          option.sections.map(section => {
                            return (
                              section.menus &&
                              section.menus.length > 0 &&
                              section.menus.map(menu => (
                                <Menu.Item key={menu.route}>
                                  <Link to={menu.route}>
                                    <span>{menu.name}</span>
                                  </Link>
                                </Menu.Item>
                              ))
                            )
                          })}
                      </SubMenu>
                    ) : [(option.profilePermissions.indexOf(Cache.getItem('userApp').profile) > -1 ?
                      <Menu.Item key={option.route}>
                        <Link to={this.loadPage(option.route)}>
                          <Icon type={option.icon} />
                          <span>{getWord(option.name)}</span>
                        </Link>
                      </Menu.Item>
                    :''),'']
                  )}
              </Menu>
            </Sider>

            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                <div className={{ display: 'flex', paddingRight: '16px' }}>
                  <Menu mode='horizontal'>
                    <SubMenu
                      style={{ float: 'right' }}
                      title={
                        <span>
                          <Icon type='user' />
                          {this.state.username}
                        </span>
                      }
                    >
                      <Menu.Item key='myaccount' onClick={this.showProfile}>
                        Mi Cuenta
                      </Menu.Item>
                      {/*<Menu.Item key='language' onClick={_ => this.changeLanguage(language === 'EN' ? 'ES' : 'EN')}>*/}
                        {/*{language === 'EN' ? 'Español' : 'English'}*/}
                      {/*</Menu.Item>*/}
                      <Menu.Item key='logout' onClick={this.handleSignOut}>
                        Cerrar Sesion
                      </Menu.Item>
                    </SubMenu>
                  </Menu>
                </div>
              </Header>

              <Content style={{ margin: '0 16px' }}>
                <div style={{ padding: 24, minHeight: 360 }}>
                  {this.state.loading ? (
                    <UISpinner />
                  ) : (
                    <Switch>
                      {filterRoutes.map((r, i) => (
                        <Route exact key={i} path={r.route} component={r.component} />
                      ))}
                      <Redirect to={filterRoutes && filterRoutes.length > 0 ? filterRoutes[0].route : '/'} />
                    </Switch>
                  )}
                </div>
              </Content>

              <Footer style={{ textAlign: 'center' }}>Powered by Userlab ©{this.state.year} - V:{process.env.REACT_APP_VERSION}</Footer>
            </Layout>
          </Layout>
        ) : (
          <Route component={LoginPage} />
        )}
      </div>
    )
  }
}

export default withUserDefaults(Router)