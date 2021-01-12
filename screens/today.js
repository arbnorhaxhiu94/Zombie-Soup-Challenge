import React, { Component } from 'react'
import {View, Text, TouchableOpacity, StatusBar} from 'react-native'
import axios from 'react-native-axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'

import { plusStyle } from '../globalStyles/plusStyle';
import { titleStyle } from '../globalStyles/titleStyle';
import { CategoriesList } from './components/categoriesList';
import { formStyles } from '../globalStyles/formStyles';
import { TodayTasksList } from './components/todayTasksList';
import { CategoryDetails } from './myModals/categoryDetails';
import { logout } from './authScreens/logout';

export class Today extends Component {
    constructor(props) {
        super(props)
        this.state={
            token: '',
            plusPressed: false,
            today_tasks: [],
            lists: [],
            showModal: false,
            categoryToOpen: null,
            taskSelected: false,
            dotsPressed: false
        }
    }

    dotsPressed = () => {
        this.state.dotsPressed ?
            this.setState({
                dotsPressed: false
            })
        :
            this.setState({
                dotsPressed: true
            })
    }

    taskSelected = (pressed) => {
        console.log('task selected: '+ pressed)
        if(pressed) {
            this.setState({
                taskSelected: true
            })
        } else {
            this.setState({
                taskSelected: false
            })
        }
    }

    plusPressed = () => {
        console.log('plus is pressed')
        if(this.state.plusPressed) {
            this.setState({
                plusPressed: false,
            })
        } else {
            this.setState({
                plusPressed: true
            })
        }
    }

    showModal = (item) => {
        this.setState({
            showModal: true,
            categoryToOpen: item
        })    
    }

    hideModal = () => {
        this.setState({
            showModal: false,
            // categoryToOpen: item
        })
    }

    getAllCategories = async() => {
        console.log('getting tasks')
        let token = this.state.token
        await axios.get('https://tasker.zombiesoup.co/api/dashboard', {
            headers: {
                'Authorization': 'Bearer '+token
            }
        })
        .then((response) => {
            // Tasks update
            let today_tasks = response.data.data.today_tasks
            for(let i=0; i<today_tasks.length; i++) {
                console.log(i+" -> "+today_tasks[i])
                let id_str = today_tasks[i].id.toString()
                today_tasks[i].id = id_str
            }
            // Lists update
            let lists = response.data.data.lists
            for(let i=0; i<lists.length; i++) {
                if(lists[i].color == '#FFE761' || lists[i].color == '#BCD2F3' ) {
                    lists[i].textColor = '#444'
                } else {
                    lists[i].textColor = '#fff'
                }
                let id_str = lists[i].id.toString()
                lists[i].id = id_str
            }
            this.setState({
                lists: lists,
                today_tasks: today_tasks
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
        setTimeout(() => {
            this.getAllCategories()
        }, 200);
    }

    componentDidMount() {
        // console.log(this.props.route.params.name)
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            console.log('focused')
            
            this.getToken()
        });
      
        this.getToken()
    }

    componentWillUnmount() {
        this._unsubscribe()
    }

    logout = async() => {
        console.log('logout is called')
        console.log(this.state.token)
        await axios.post(
            'https://tasker.zombiesoup.co/api/auth/logout', null, { 
            headers: { 
                'Authorization': 'Bearer '+this.state.token 
            }
        })
        .then(() => this.props.logout())
        .catch(error => {
            console.log(error)
        });
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
                <TouchableOpacity onPress={() => this.dotsPressed()} style={{zIndex: 5, position: 'absolute', width: 30, height: 30, top: 20, right: 10}}>
                    <MaterialCommunityIcons name="dots-horizontal" size={30} color="#1e7fff" />
                </TouchableOpacity>
                {this.state.dotsPressed ? 
                <TouchableOpacity onPress={() => this.logout()} style={plusStyle.logoutOption}>
                    <MaterialCommunityIcons name="logout" size={20} color="#1e7fff" />
                    <Text style={plusStyle.optionsText}>Logout</Text>
                </TouchableOpacity>
                : null}
                {!this.state.taskSelected ? 
                    this.state.plusPressed ? 
                        <TouchableOpacity onPress={() => this.plusPressed()} style={{...plusStyle.container, zIndex:2, transform: [{ rotate: '45deg'}], backgroundColor: '#1e7fff'}}>
                            <Text style={{...plusStyle.plus, color: '#f2f2f2'}}>+</Text>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity onPress={() => this.plusPressed()} style={{...plusStyle.container, zIndex:2, backgroundColor: '#f2f2f2'}}>
                            <Text style={{...plusStyle.plus, color: '#1e7fff'}}>+</Text>
                        </TouchableOpacity>
                : null
                }
                {this.state.plusPressed ? 
                    <View style={{...plusStyle.options, zIndex: 3}}>
                        <TouchableOpacity style={{zIndex: 3, flexDirection:'row', alignItems: 'center'}} onPress={() => this.props.navigation.navigate('NewTaskScreen')}>
                            <Feather name="check-circle" color="#1e7fff" size={20} style={{flex: 1}} />
                            <Text style={{...plusStyle.optionsText, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>Task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{zIndex: 4, flexDirection: 'row', alignItems: 'center'}} onPress={() => this.props.navigation.navigate('NewCategoryScreen')}>
                            <FontAwesome name="reorder" color="#1e7fff" size={20} style={{flex:1}} />
                            <Text style={{...plusStyle.optionsText, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>List</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    null
                }
                <View style={titleStyle.container}>
                    <Text style={titleStyle.text}>Today</Text>
                </View>
                {this.state.today_tasks.length == 0 ? 
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>No tasks for today</Text>
                </View>
                :
                <TodayTasksList 
                    taskSelected={this.taskSelected}
                    getAllCategories={this.getAllCategories}
                    todayTasksList={this.state.today_tasks} 
                    categoriesList={this.state.lists} />
                }
                {this.state.lists.length == 0 ? 
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>No category created</Text>
                    </View>
                :
                    <CategoriesList showModal={this.showModal} categoriesList={this.state.lists} />
                }
                {this.state.showModal ? 
                <CategoryDetails 
                    getAllCategories={this.getAllCategories}
                    navigation={this.props.navigation}
                    token={this.state.token}
                    hideModal={this.hideModal}
                    showModal={this.state.showModal}
                    category={this.state.categoryToOpen} 
                    todayTasksList={this.state.today_tasks} 
                    categoriesList={this.state.lists} />
                : null}
            </View>
        )
    }
}