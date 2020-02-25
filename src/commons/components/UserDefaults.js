import React, { createContext } from 'react';
import { Cache } from 'aws-amplify'
import { dictionary } from '../consts/Dictionary';

const { Provider, Consumer } = createContext();

export const UserDefaults = Consumer;

export function withUserDefaults(Component) {
  return function UserDefaultsComponent(props) {
    return <Consumer>{value => <Component {...props} userDefaults={{ ...value }} />}</Consumer>
  }
}

export class UserDefaultsProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuth: false,
      isLoading: true,
      language: 'ES'
    }
  }

  componentDidMount() {
    this.setState({ language: this.getLanguage() })
  }

  getLanguage = () => {

    let language = Cache.getItem('language')

    return language ? JSON.parse(language) : 'ES'
  }

  changeLanguage = async language => {

    await this.setState({ isLoading: true });
    await Cache.setItem('language', JSON.stringify(language));
    await this.setState({ language, isLoading: false });

  }

  getWord = index => dictionary[index] && dictionary[index][this.state.language] ? dictionary[index][this.state.language] : 'WORD NOT FOUND';

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          getWord: this.getWord,
          changeLanguage: this.changeLanguage
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}
