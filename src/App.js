//Libs
import React, { Component } from 'react';
import { createBrowserHistory } from 'history'

//Components
import { Router, Route, Switch } from 'react-router-dom'
import { UserDefaultsProvider } from './commons/components/UserDefaults'

import AppRouter  from './Router'

//Styles
import './App.css';


//Const
const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <UserDefaultsProvider>
        <Router history={history}>
          <Switch>
            <Route render={props => <AppRouter {...props} />} />
          </Switch>
        </Router>
      </UserDefaultsProvider>
    );
  }
}

export default App;
