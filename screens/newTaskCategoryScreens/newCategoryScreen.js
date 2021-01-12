import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { Component } from 'react'
import { View, TouchableOpacity, Text, StatusBar, Alert } from 'react-native'

import axios from 'react-native-axios'
import Feather from 'react-native-vector-icons/Feather'

import { TextInput } from 'react-native-gesture-handler'
import { formStyles } from '../../globalStyles/formStyles'
import { newTCstyles } from '../../globalStyles/newTaskCategoryStyles'

export class NewCategory extends Component {
    constructor(props) {
        super(props)
        this.state={
            categoryName: '',
            color: '',
            token: '',
            disabledButton: true,
            success: false,
            borderStyle: []
        }
    }

    handleChange = (input) => {
        console.log(input)
        this.setState({
            categoryName: input,
            disabledButton: input.length > 0 ? false : true
        })
    }

    chooseColor = (color) => {
        console.log(color)
        this.setState({
            color: color
        })
    }

    submitForm = async() => {
        var color = this.state.color == '' ? '#252A31' : this.state.color
        await axios.post(
            'https://tasker.zombiesoup.co/api/lists', 
            {
                name : this.state.categoryName,
                color : color
            },
            {
            headers: { 
                'Authorization': 'Bearer '+this.state.token 
            }
        })
        .then(() => {
            console.log('new list inserted')
            // alert('New category got inserted')
            this.setState({
                success: true
            })
            Alert.alert('Success', 'New category got inserted', [
                {text:'OK', onPress: () => this.props.navigation.navigate('TodayScreen')}
            ])
        })
        .catch((error) => console.log(error.response))
        
    }

    getToken = async() => {
        let token = await AsyncStorage.getItem('token')
        setTimeout(() => {
            this.setState({
                token: token
            })
        }, 300)
    }

    componentDidMount() {
        this.getToken()
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#fff', zIndex: 1}}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={newTCstyles.buttonsContainer}>
                    <View style={{flex:1, alignItems: 'flex-start', paddingHorizontal: 10}}>
                        <TouchableOpacity
                            style={newTCstyles.buttons}
                            onPress={() => this.props.navigation.navigate('TodayScreen')} >
                            <Text style={newTCstyles.buttonsText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1, alignItems:'flex-end', paddingHorizontal: 10}}>
                        <TouchableOpacity 
                            disabled={this.state.disabledButton} 
                            onPress={() => this.submitForm()}
                            style={newTCstyles.buttons}>
                            <Text style={{...newTCstyles.buttonsText, fontWeight: 'bold'}}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{...formStyles.formContainer, marginTop: 20}}>
                    <Text style={formStyles.inputLabel}>Category name</Text>
                    <TextInput 
                        style={formStyles.textinput}
                        onChangeText={(input) => this.handleChange(input)} />
                    <Text style={{...formStyles.inputLabel, marginTop: 20}}>Category name</Text>
                    <View style={{...newTCstyles.colorCirclesContainer}}>
                        <TouchableOpacity 
                            onPress={() => this.chooseColor('#252A31')} 
                            style={{
                                ...newTCstyles.colorCircles, 
                                backgroundColor: '#252A31',
                                borderWidth: this.state.color == '#252A31' ? 2 : 0,
                                borderColor: '#fff'
                                }}>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.chooseColor('#006CFF')} 
                            style={{
                                ...newTCstyles.colorCircles, 
                                backgroundColor: '#006CFF',
                                borderWidth: this.state.color == '#006CFF' ? 2 : 0,
                                borderColor: '#fff'
                                }}>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.chooseColor('#B678FF')} 
                            style={{
                                ...newTCstyles.colorCircles, 
                                backgroundColor: '#B678FF',
                                borderWidth: this.state.color == '#B678FF' ? 2 : 0,
                                borderColor: '#fff'
                                }}>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.chooseColor('#FFE761')} 
                            style={{
                                ...newTCstyles.colorCircles, 
                                backgroundColor: '#FFE761',
                                borderWidth: this.state.color == '#FFE761' ? 2 : 0,
                                borderColor: '#fff'
                                }}>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.chooseColor('#F45E6D')} 
                            style={{
                                ...newTCstyles.colorCircles, 
                                backgroundColor: '#F45E6D',
                                borderWidth: this.state.color == '#F45E6D' ? 2 : 0,
                                borderColor: '#fff'
                                }}>
                            </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.chooseColor('#61DEA4')} 
                            style={{
                                ...newTCstyles.colorCircles, 
                                backgroundColor: '#61DEA4',
                                borderWidth: this.state.color == '#61DEA4' ? 2 : 0,
                                borderColor: '#fff'
                                }}>
                            </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.chooseColor('#BCD2F3')} 
                            style={{
                                ...newTCstyles.colorCircles, 
                                backgroundColor: '#BCD2F3',
                                borderWidth: this.state.color == '#BCD2F3' ? 2 : 0,
                                borderColor: '#fff'
                                }}>
                            </TouchableOpacity>
                    </View>
                </View>
                {/* {this.state.success ? 
                <View style={newTCstyles.successMessageContainer}>
                    <View style={newTCstyles.successMessageTitle}>
                        <Text style={newTCstyles.successMessageTitleText}>New category inserted successfully</Text>
                    </View>
                    <TouchableOpacity style={newTCstyles.successMessageButton}>
                        <Feather name="check-circle" color="#1e7fff" size={40} />
                    </TouchableOpacity>
                </View>
                : null 
                } */}
            </View>
        )
    }
}