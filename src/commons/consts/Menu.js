
//Data for menu
const menuOptions = [{
  name: 'DASHBOARD',              //Required
  key: 'dashboard',               //Required
  icon: 'dashboard',              //Required
  route: '/dashboard',            //Required if doesn't have sections
  possiblePermissions: ['read'],  //Required if doesn't have sections
  requiredPermissions: ['read'],   //Required if doesn't have sections
  profilePermissions: ['admin']   //Required if doesn't have sections
}, {
  name: 'USERS',
  key: 'users',
  icon: 'team',
  route: '/users',
  possiblePermissions: [ 'read', 'add', 'edit', 'delete' ],
  profilePermissions: ['admin']
},{
  name: 'CLIENTS',
  key: 'clients',
  icon: 'team',
  route: '/clients',
  possiblePermissions: [ 'read', 'add', 'edit', 'delete' ],
  profilePermissions: ['admin','recepcionista']
}, {
  name: 'PACKAGES',
  key: 'packages',
  icon: 'gift',
  route: '/packages',
  possiblePermissions: [ 'read', 'add', 'edit', 'delete' ],
  profilePermissions: ['admin','warehouse']
}, {
  name: 'PACKAGES',
  key: 'packages',
  icon: 'gift',
  route: 'clients/viewpackage',
  profilePermissions: ['cliente']
},{
  name: 'TRANSFERS',
  key: 'transfers',
  icon: 'gift',
  route: '/transfers',
  profilePermissions: ['admin']
}, {
  name: 'REPORTS',
  key: 'reports',
  icon: 'area-chart',
  route: '/reports',
  possiblePermissions: ['read'],  //Required if doesn't have sections
  requiredPermissions: ['read'],   //Required if doesn't have sections
  profilePermissions: ['admin']
}];

const routeDefaults = [
  { type: 'recepcionista', route: 'clients' },
  { type: 'cliente', route: 'clients/viewpackage/' },
];

export {
  menuOptions,
  routeDefaults
}