/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { LoginRegisterScreen } from './screens/authScreens/LoginRegisterScreen';
import { ZombieStack } from './stack/navigationStack';
import SplashScreen from 'react-native-splash-screen';

class App extends Component {
  constructor(props) {
    super(props)
    this.state={
      authenticated: false
    }
  }

  logout = async() => {
    console.log('logging out')
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user_data')

    this.setState({
      authenticated: false
    })
  }

  tryToAuthenticate = async() => {
    console.log('auth is checked')
    if(await AsyncStorage.getItem('token')) {
      this.setState({
        authenticated: true
      })
    } else {
      this.setState({
        authenticated: false
      })
    }
  }

  componentDidMount(){
    // this.logout()
    this.tryToAuthenticate()

    setTimeout(() => {
      SplashScreen.hide()
    }, 500);
  }


  render() {
    return (
      <>
          {this.state.authenticated ?
            <ZombieStack logout={this.logout} name="Arbnor" />
          :
            <LoginRegisterScreen
              tryToAuthenticate={this.tryToAuthenticate}
            />
          }
      </>
    );
  }
};

export default App;
