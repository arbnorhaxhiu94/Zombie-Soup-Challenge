import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { Component } from 'react'
import { View, TouchableOpacity, Text, StatusBar, FlatList, Keyboard, KeyboardAvoidingView, Alert } from 'react-native'

import axios from 'react-native-axios'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from '@react-native-community/datetimepicker'

import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { formStyles } from '../../globalStyles/formStyles'
import { newTCstyles } from '../../globalStyles/newTaskCategoryStyles'
import { categoriesStyles } from '../../globalStyles/categoriesStyles'
import { dateTimeFormater } from '../../random/formatDateTime'

export class NewTask extends Component {
    constructor(props) {
        super(props)
        this.state={
            task: '',
            category_id: null,
            categoryName: '',
            categoryColor: '',
            categoriesList: [],
            token: '',
            disabledButton: true,
            keyboardOpen: false,
            showDateTime: false,
            mode: '',
            date: new Date(Date.now()),
            date_str: '',
            params: false
        }
    }

    onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        this.setState({
            date: currentDate,
            mode: '',
            showDateTime: false
        })
        
        console.log(selectedDate)
        let unformatedDate = (this.state.date).toString()
        let formated_date = dateTimeFormater(unformatedDate)
        this.setState({
            date_str: formated_date
        })
    };

    showDateTimePicker = (mode) => {
        this.setState({
            mode: mode,
            showDateTime: true,
        })
    }

    handleChange = (field, input) => {
        let categoriesList = this.state.categoriesList
        for(let i=0; i<categoriesList.length; i++) {
            if(categoriesList[i].id == input.id) {
                categoriesList[i].selected = true
            } else {
                categoriesList[i].selected = false
            }
        }
        console.log(input)
        if(field == 'category') {
            this.setState({
                category_id: input.id,
                categoryName: input.name,
                categoryColor: input.color,
                categoriesList: categoriesList
            })
        } else if(field == 'task'){
            this.setState({
                task: input,
                disabledButton: input.length > 0 ? false : true
            })
        }
    }

    submitForm = async() => {
        console.log('type of date: '+typeof(this.state.date))
        console.log('date to submit: '+ this.state.date)

        if(this.state.category_id == null) {
            return alert("You must select a category")
        }

        await axios.post(
            'https://tasker.zombiesoup.co/api/tasks', 
            {
                name: this.state.task,
                task_list_id: this.state.category_id,
                due_date: this.state.date_str
            },
            {
            headers: { 
                'Authorization': 'Bearer '+this.state.token 
            }
        })
        .then(() => {
            this.setState({
                task: ''
            })
            Keyboard.dismiss()
            Alert.alert('Success', 'New task got inserted', [
                {text:'OK', onPress: () => {
                    console.log("Navigate to Today Screen");
                    this.props.navigation.navigate('TodayScreen');
                    }
                }
            ])
        })
        .catch((error) => {
            console.log('error occurred')
            alert(error.response.data.error.due_date)
        })
    }

    getAllCategories = async() => {
        console.log('getting categories')
        let token = this.state.token
        await axios.get('https://tasker.zombiesoup.co/api/lists', {
            headers: {
                'Authorization': 'Bearer '+token
            }
        })
        .then((response) => {
            let categoriesList = response.data.data
            for(let i=0; i<categoriesList.length; i++) {
                if(categoriesList[i].color == '#FFE761' || categoriesList[i].color == '#BCD2F3' ) {
                    categoriesList[i].textColor = '#444'
                } else {
                    categoriesList[i].textColor = '#fff'
                }
                let id_str = categoriesList[i].id.toString()
                categoriesList[i].id = id_str
                categoriesList[i].selected = false
            }
            this.setState({
                categoriesList: categoriesList,
                category_id: categoriesList[0].id,
                categoryName: categoriesList[0].name,
                categoryColor: categoriesList[0].color
            })
        })
        .catch((error) => {
            console.log('error occurred')
            console.log(error.response.data.error)
        })
    }

    getToken = async() => {
        let token = await AsyncStorage.getItem('token')
        this.setState({
            token: token
        })
        
        if(this.props.route.params !== undefined) {
            this.setState({
                category_id: this.props.route.params.category.id,
                categoryName: this.props.route.params.category.name,
                categoryColor: this.props.route.params.category.color,
                params: true
            })
        } else {
            setTimeout(() => {
                this.getAllCategories()
            }, 100)
        }
    }

    componentDidMount() {
        var date = this.state.date
        date.setDate(date.getDate()+1)
        var date_str = date.toString()
        setTimeout(() => {
            this.setState({
                date_str: dateTimeFormater(date_str)
            })
        }, 500);
        setTimeout(() => {
            console.log('now: '+this.state.date)
        }, 1000);
        
        this.getToken()
    }

    showKeyboard = () => {
        this.setState({
            keyboardOpen: true
        })
    }
    hideKeyboard = () => {
        this.setState({
            keyboardOpen: false
        })
    }

    render() {
        return (
            <KeyboardAvoidingView  behavior="padding" style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); this.hideKeyboard();}} style={newTCstyles.buttonsContainer}>
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
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); this.hideKeyboard();}} style={{...formStyles.formContainer, marginTop: 20}}>
                    <TextInput 
                        multiline={true}
                        numberOfLines={3}
                        placeholder="What do you want to do ?"
                        value={this.state.task}
                        onFocus={() => this.showKeyboard()}
                        onChangeText={(input) => this.handleChange('task', input)} />
                </TouchableWithoutFeedback>
                <View style={newTCstyles.belt}>
                    <View style={newTCstyles.inputsBelt}>
                        <View style={{...newTCstyles.beltElements}}>
                            <TouchableOpacity onPress={() => {Keyboard.dismiss(); this.showDateTimePicker('date');}} style={{marginRight: 15}}>
                                <FontAwesome name="calendar-o" size={25} color={this.state.mode == 'date' ? '#0f87ff' : '#aaa'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {Keyboard.dismiss(); this.showDateTimePicker('time')}}>
                                <MaterialCommunityIcons name="clock-outline" size={25} color={this.state.mode == 'time' ? '#0f87ff' : '#aaa'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{...newTCstyles.beltElements}}>
                            {this.state.category_id == null ? 
                            <TouchableOpacity onPress={() => {Keyboard.dismiss(); this.hideKeyboard();}} style={{...newTCstyles.beltElements, justifyContent: 'flex-end'}}>
                                <Text style={{marginHorizontal: 10, color: '#aaa', fontSize: 14}}>Select a category</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => {Keyboard.dismiss(); this.hideKeyboard();}} style={{...newTCstyles.beltElements, justifyContent: 'flex-end'}}>
                                <Text style={{marginHorizontal: 10, color: '#aaa', fontSize: 14}}>{this.state.categoryName}</Text>
                                <View style={{width: 16, height: 16, borderRadius: 8, backgroundColor: this.state.categoryColor}}></View>
                            </TouchableOpacity>
                            }
                        </View>
                    </View>
                    {this.state.showDateTime ? 
                        <DateTimePicker
                            minimumDate={new Date(Date.now())}
                            testID="dateTimePicker"
                            value={this.state.date}
                            mode={this.state.mode}
                            is24Hour={true}
                            display="default"
                            onChange={this.onDateChange}
                        />
                        : null
                    }
                    {this.state.keyboardOpen || this.state.params ? 
                        null
                    :
                        <View style={{...categoriesStyles.categoryContainer, height: 250}}>
                            <FlatList
                                style={{width: '90%'}}
                                showsVerticalScrollIndicator={false}
                                data={this.state.categoriesList}
                                renderItem={({item}) => (
                                    <TouchableOpacity 
                                        onPress={() => this.handleChange('category', item)}
                                        key={item.id} 
                                        style={{...categoriesStyles.categoryElement, paddingHorizontal: 10, backgroundColor: item.color}}>
                                        <View style={{flex:5}}>
                                            <Text style={{...categoriesStyles.categoryTitle, color: item.textColor}}>{item.name}</Text>
                                            {item.task_count == 1 ?
                                            <Text style={{...categoriesStyles.categoryTaskCount, color: item.textColor}}>{item.task_count} task</Text>
                                            :
                                            <Text style={{...categoriesStyles.categoryTaskCount, color: item.textColor}}>{item.task_count} tasks</Text>
                                            }
                                        </View>
                                        {item.selected ? 
                                        <View style={{flex:1, justifyContent: 'center'}}>
                                            <View style={categoriesStyles.checkedCircle}>
                                                <MaterialCommunityIcons name="check" color="#0f87ff" size={20} />
                                            </View>
                                        </View>
                                        : null
                                        }
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    }
                </View>
            </KeyboardAvoidingView>
        )
    }
}