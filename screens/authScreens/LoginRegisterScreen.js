import React, {Component} from 'react'
import { StyleSheet, View, Image, SafeAreaView, StatusBar, ScrollView } from 'react-native'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export class LoginRegisterScreen extends Component {
    constructor(props) {
        super(props)
        this.state={
            LoginRegister: 'Login'
        }
    }

    changeForm = (action) => {
        this.state.LoginRegister == 'Login' ?
        this.setState({
            LoginRegister: 'Register'
        })
        :
        this.setState({
            LoginRegister: 'Login'
        })
    }

    render() {

        const styles = StyleSheet.create({
            iconContainer: {
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                marginBottom: 20
            },
            icon: {
                width: 150,
                height: 150,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#aaa',
                borderRadius: 50,
                backgroundColor: '#fff',
            },
        })

        return (
            <ScrollView style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
                <StatusBar color="white" backgroundColor="#fff" barStyle="dark-content"/>
                <View style={styles.iconContainer}>
                    <View style={{elevation: 10, borderRadius: 50, backgroundColor: 'orange'}}>
                        <Image style={styles.icon} source={require('../../images/icon.png')} />
                    </View>
                </View>
                {this.state.LoginRegister == 'Login' ?
                    <LoginForm
                        tryToAuthenticate={this.props.tryToAuthenticate} 
                        changeForm={this.changeForm} />
                :
                    <RegisterForm
                        tryToAuthenticate={this.props.tryToAuthenticate} 
                        changeForm={this.changeForm} />
                }
            </ScrollView>
        )
    }
}