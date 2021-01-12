import React, {Component} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import { formStyles } from '../../globalStyles/formStyles'
import axios from 'react-native-axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state={
            email: '',
            email_error: '',
            password: '',
            password_error: '',
        }
    }

    submitForm = async() => {
        console.log(this.state.email)
        console.log(this.state.password)
        console.log(this.state.password_confirmation)
        axios.post('https://tasker.zombiesoup.co/api/auth/login', {
            email : this.state.email,
            password : this.state.password,
            // email: "test@test.com",
            // password: "password",
          })
          .then(async(response) => {
            console.log(response.data.data.token);
            let user_data = JSON.stringify(response.data.data.user)
            console.log(user_data)
            await AsyncStorage.setItem('token', response.data.data.token)
            await AsyncStorage.setItem('user_data', user_data)

            // setTimeout(() => {
                // this.props.tryToAuthenticate()
            // }, 100)
          })
          .catch((error) => {
            console.log(error.response.data.error);
            console.log(error.response.data.code);
            if(error.response.data.code == 302 || error.response.data.code == 422) {
                if(error.response.data.error.email !== undefined) {
                    for(let i=0; i<error.response.data.error.email.length; i++) {
                        console.log(error.response.data.error.email[i])
                        this.setState({
                            email_error: error.response.data.error.email[i]
                        })
                    }
                }
                if(error.response.data.error.password !== undefined) {
                    for(let i=0; i<error.response.data.error.password.length; i++) {
                        console.log(error.response.data.error.password[i])
                        this.setState({
                            password_error: error.response.data.error.password[i]
                        })
                    }
                }
            } else if( error.response.data.code == 401) {
                this.setState({
                    password_error: 'Email or password is incorrect.'
                })
            }
          });
    }

    handleChange = (input, field) => {
        if(field == 'email') {
            this.setState({
                email: input
            })
        } else if(field == 'password') {
            this.setState({
                password: input
            })
        }
    }

    render() {

        return (
            <View>
                <View style={formStyles.formContainer}>
                    <Text style={formStyles.inputLabel}>Email</Text>
                    <TextInput
                        style={formStyles.textinput}
                        onChangeText={(input) => this.handleChange(input, 'email')}
                        value={this.state.email}
                    />
                    {this.state.email_error.length > 0 ? 
                        <Text>{this.state.email_error}</Text>
                        :
                        null
                    }
                    <Text style={{...formStyles.inputLabel, marginTop: 15}}>Password</Text>
                    <TextInput 
                        secureTextEntry={true}
                        style={formStyles.textinput}
                        onChangeText={(input) => this.handleChange(input, 'password')}
                        value={this.state.password} 
                    />
                    {this.state.password_error.length > 0 ? 
                        <Text>{this.state.password_error}</Text>
                        :
                        null
                    }
                </View>
                <View style={formStyles.buttonsContainer}>
                    <TouchableOpacity 
                        onPress={() => {
                            this.submitForm(); 
                            setTimeout(() => {
                                this.props.tryToAuthenticate();
                            }, 1000);
                        }}
                        style={{...formStyles.button, backgroundColor: '#61DEA4'}}>
                        <Text style={formStyles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.props.changeForm()}
                        style={{...formStyles.button, backgroundColor: '#006CFF'}}>
                        <Text style={formStyles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}