const production = {
  baseUrl: 'https://86qltavbqj.execute-api.us-east-1.amazonaws.com/qa',
  baseUrlUsers: 'https://clrxem52ve.execute-api.us-east-1.amazonaws.com/qa/users',
  baseUrlPackages: ' https://86qltavbqj.execute-api.us-east-1.amazonaws.com/qa/packages',
  reportURL: 'https://0rl2klh0p7.execute-api.us-east-1.amazonaws.com/qa/reports',
  searchUrl: 'https://clrxem52ve.execute-api.us-east-1.amazonaws.com/qa/',
  headers: null,
}


const enviroment = env => {
  switch (env) {
    case 'production':
      return production
    default:
      return 'local'
  }
}

module.exports = {
  stage: enviroment('production'),
}
