//Libs
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withUserDefaults } from '../../commons/components/UserDefaults';

//Api

//Components
import {
  Button
} from 'antd'


//Styles

//const


class DashboardPage extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    const {
      getWord
    } = this.props.userDefaults;

    return (
      <div>
        <h2>{getWord('DASHBOARD')}</h2>
        <br/>
        <Button type='dashed' icon='bar-chart' onClick={_ => window.open('http://traestodo-env.4nfn6h3d8e.us-east-1.elasticbeanstalk.com')}>Ir a metabase</Button>
      </div>
    );
  }
}

export default withRouter(withUserDefaults(DashboardPage))