import React, { Component } from 'react'
import {View, Text, TouchableOpacity, FlatList, Alert, RefreshControl} from 'react-native'

import axios from 'react-native-axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { categoriesStyles } from '../../globalStyles/categoriesStyles';
import { formStyles } from '../../globalStyles/formStyles';


export class TodayTasksList extends Component {
    constructor(props) {
        super(props)
        this.state={
            token: '',
            todayTasksList: [],
            refreshing: false
        }
    }

    onRefresh = () => {
        this.setState({
            refreshing: true
        })
        setTimeout(() => {
            this.setState({
                refreshing: false
            })
            this.props.getAllCategories()
        }, 1000)
        setTimeout(() => {
            this.componentDidMount()
        }, 3000)
    }

    taskPressed = (id) => {
        let todayTasksList = this.state.todayTasksList
        var taskPressed = false
        for(let i=0; i<todayTasksList.length; i++) {
            if(todayTasksList[i].id == id) {
                if (todayTasksList[i].pressed == true) {
                    todayTasksList[i].pressed = false
                    todayTasksList[i].textColor = '#555'
                } else {
                    todayTasksList[i].pressed = true
                    todayTasksList[i].textColor = '#aaa'
                    taskPressed = true
                }
            } else {
                todayTasksList[i].pressed = false
                todayTasksList[i].textColor = '#555'
            }
        }
        this.props.taskSelected(taskPressed)
        this.setState({
            todayTasksList: todayTasksList,
        })
    }

    taskCompleted = async(task) => {
        this.props.taskSelected(false)
        let todayTasksList = this.state.todayTasksList
        if(task.pressed && !task.completed) {
            await axios.put(`https://tasker.zombiesoup.co/api/tasks/${task.id}`,
                {
                    completed: true
                },
                {
                    headers: {
                        'Authorization': 'Bearer '+this.state.token
                    }
                }
            )
            .then((respose) => {
                // console.log(respose.data)
                for(let i=0; i<todayTasksList.length; i++) {
                    if(todayTasksList[i].id == respose.data.id) {
                        console.log('condition is true')
                        todayTasksList[i].completed = true
                        break;
                    }
                }
                setTimeout(() => {
                    this.setState({
                        todayTasksList: todayTasksList
                    })
                    this.onRefresh()
                    Alert.alert(
                        'Success',
                        'Task completed',
                        [
                            {
                            text: 'Ok',
                            style:'default',
                            onPress: () => console.log('Ask me later pressed')
                            },
                        ],
                    )
                    console.log(this.state.todayTasksList)
                })
            })
            .catch((error) => console.log(error.response.data.error))
        } else {
            return null
        }
    }

    uploadTodayTasks = () => {
        let todayTasksList = this.props.todayTasksList
        let categoriesList = this.props.categoriesList
        console.log('####################')
        for(let i=0; i<todayTasksList.length; i++) {
            for(let j=0; j<categoriesList.length; j++) {
                let id_int = parseInt(categoriesList[j].id, 10)
                if(todayTasksList[i].task_list_id == id_int) {
                    todayTasksList[i].circleColor = categoriesList[j].color
                    break;
                }
            }
            todayTasksList[i].pressed = false
            todayTasksList[i].textColor = '#555'
        }
        this.setState({
            todayTasksList: todayTasksList
        })
    }

    getToken = async() => {
        let token = await AsyncStorage.getItem('token')
        this.setState({
            token: token
        })
    }

    componentDidMount(){
        console.log('todaytasklist mounted')
        this.getToken()
        this.uploadTodayTasks()
    }

    render() {
        return(
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'flex-end', flex: 1}}>
                <FlatList
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                    style={{width: '100%', zIndex: 1}}
                    showsVerticalScrollIndicator={false}
                    data={this.state.todayTasksList}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            key={item.id} 
                            onPress={() => this.taskCompleted(item)}
                            onLongPress={() => this.taskPressed(item.id)}
                            style={{...categoriesStyles.categoryElement, borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
                            <View style={{width: '15%', justifyContent: 'center', alignItems:'center'}}>
                                {item.pressed ? 
                                    <MaterialCommunityIcons name="check-circle" size={35} color="#1e7fff" />
                                :
                                    <FontAwesome name="circle-thin" size={35} color="#aaa" />
                                }
                            </View>
                            <View style={{width: '75%', justifyContent: 'flex-start'}}>
                                <Text style={{...categoriesStyles.categoryTitle, color: item.textColor}}>{item.name}</Text>
                                {item.pressed ? 
                                <Text style={{color: item.textColor}}>
                                    <MaterialCommunityIcons name="clock-outline" color="#aaa" size={14} /> 
                                    {item.due_date}
                                </Text>
                                : null
                                }
                            </View>
                            <View style={{width: '10%', justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{height: 14, width: 14, borderRadius: 7, backgroundColor: item.circleColor}}></View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }
}