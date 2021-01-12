import React, {Component} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import { formStyles } from '../../globalStyles/formStyles'
import axios from 'react-native-axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export class RegisterForm extends Component {
    constructor(props) {
        super(props)
        this.state={
            email: '',
            email_error: '',
            password: '',
            password_error: '',
            password_confirmation: '',
            password_confirmation_error: '',
        }
    }

    submitForm = async() => {
        console.log(this.state.email)
        console.log(this.state.password)
        console.log(this.state.password_confirmation)
        axios.post('https://tasker.zombiesoup.co/api/auth/register', {
            email : this.state.email,
            password : this.state.password,
            password_confirmation: this.state.password_confirmation
            // email: "arbnor1@test.com",
            // password: "12345678",
            // password_confirmation : "12345678"
          })
          .then(async(response) => {
            console.log(response.data.data.token);
            let user_data = JSON.stringify(response.data.data.user)
            await AsyncStorage.setItem('token', response.data.data.token)
            await AsyncStorage.setItem('user_data', user_data)
            setTimeout(() => {
                this.props.tryToAuthenticate();
            }, 1000);
          })
          .catch((error) => {
            console.log(error.response.data.error);
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
                    if(error.response.data.error.password[i].includes('confirm')) {
                        this.setState({
                            password_confirmation_error: error.response.data.error.password[i]
                        })
                    } else {
                        this.setState({
                            password_error: error.response.data.error.password[i]
                        })
                    }
                }
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
        } else {
            this.setState({
                password_confirmation: input
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
                        style={formStyles.textinput}
                        secureTextEntry={true}
                        onChangeText={(input) => this.handleChange(input, 'password')}
                        value={this.state.password}
                    />
                    {this.state.password_error.length > 0 ? 
                        <Text>{this.state.password_error}</Text>
                        :
                        null
                    } 
                    <Text style={{...formStyles.inputLabel, marginTop: 15}}>Confirm Password</Text>
                    <TextInput 
                        style={formStyles.textinput}
                        secureTextEntry={true}
                        onChangeText={(input) => this.handleChange(input, 'password_confirmation')}
                        value={this.state.password_confirmation} />
                    {this.state.password_confirmation_error.length > 0 ? 
                        <Text>{this.state.password_confirmation_error}</Text>
                        :
                        null
                    } 
                </View>
                <View style={formStyles.buttonsContainer}>
                    <TouchableOpacity onPress={() => this.submitForm()} style={{...formStyles.button, backgroundColor: '#61DEA4'}}>
                        <Text style={formStyles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.props.changeForm()}
                        style={{...formStyles.button, backgroundColor: '#006CFF'}}>
                        <Text style={formStyles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}