import React, { Component } from 'react'
import {View, Text, TouchableOpacity, FlatList, Modal, StatusBar, Alert, RefreshControl} from 'react-native'
import axios from 'react-native-axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { categoriesStyles } from '../../globalStyles/categoriesStyles';
import { formStyles } from '../../globalStyles/formStyles';
import { titleStyle } from '../../globalStyles/titleStyle';
import { plusStyle } from '../../globalStyles/plusStyle';


export class CategoryDetails extends Component {
    constructor(props) {
        super(props)
        this.state={
            categoryTasks: [],
            textColor: '',
            taskSelected: false
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
        let categoryTasks = this.state.categoryTasks
        var taskSelected = false
        for(let i=0; i<categoryTasks.length; i++) {
            if(categoryTasks[i].id == id) {
                if (categoryTasks[i].pressed == true) {
                    categoryTasks[i].pressed = false
                    categoryTasks[i].textColor = this.state.textColor
                } else {
                    categoryTasks[i].pressed = true
                    categoryTasks[i].textColor = '#aaa'
                    taskSelected = true
                }
            } else {
                categoryTasks[i].pressed = false
                categoryTasks[i].textColor = this.state.textColor
            }
        }

        this.setState({
            categoryTasks: categoryTasks,
            taskSelected: taskSelected
        })
    }

    taskCompleted = async(task) => {
        let categoryTasks = this.state.categoryTasks

        if(task.pressed && !task.completed) {
            await axios.put(`https://tasker.zombiesoup.co/api/tasks/${task.id}`,
            {
                completed: true
            },
            {
                headers: {
                    'Authorization': 'Bearer '+this.props.token
                }
            })
            .then((respose) => {
                for(let i=0; i<categoryTasks.length; i++) {
                    if(categoryTasks[i].id == respose.data.id) {
                        console.log('condition is true')
                        categoryTasks[i].completed = true
                        break;
                    }
                }
                setTimeout(() => {
                    this.setState({
                        categoryTasks: categoryTasks
                    })
                    this.props.getAllCategories()
                    this.onRefresh()
                    Alert.alert(
                        'Success',
                        'Task completed',
                        [
                            {
                            text: 'Ok',
                            style:'default',
                            onPress: () => console.log('OK')
                            },
                        ],
                    )
                    console.log(this.state.categoryTasks)
                })
            })
            .catch((error) => console.log(error.response.data.error))
        } else {
            return false
        }

    }

    uploadCategoryTasks = async() => {
        let category = this.props.category
        console.log('category_id='+ category.id)
        await axios.get(`https://tasker.zombiesoup.co/api/lists/${category.id}/tasks`, {
            headers: {
                'Authorization': 'Bearer '+this.props.token
            }
        })
        .then((response) => {
            let categoryTasks = []
            for(let i=0; i<response.data.data.length; i++) {
                let id_str = response.data.data[i].id.toString()
                categoryTasks.push(response.data.data[i])
                categoryTasks[i].id = id_str
                categoryTasks[i].pressed = false
                categoryTasks[i].textColor = this.props.category.textColor
            }
            this.setState({
                categoryTasks: categoryTasks,
                textColor: this.props.category.textColor
            })
        })
    }

    componentDidMount(){
        this.uploadCategoryTasks()
    }

    render() {
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.showModal}
                onRequestClose={() => {
                    this.props.hideModal()
                }}
            >
                <StatusBar 
                    backgroundColor={this.props.category.color} 
                    barStyle={this.props.category.textColor == '#fff' ? 'light-content' : 'dark-content'} />
                <View style={{width: '100%', justifyContent: 'center', alignItems: 'flex-end', flex: 1, backgroundColor: this.props.category.color}}>

                <View style={{flexDirection: 'row', width: '100%', alignItems: 'flex-start'}}>
                    <View style={{...titleStyle.container, width: '100%', height: 100}}>
                        <Text style={{...titleStyle.text, color: this.props.category.textColor}}>{this.props.category.name}</Text>
                        <Text style={{left: '15%', color: this.props.category.textColor}}>{this.props.category.task_count} {this.props.category.task_count == 1 ? 'task' : 'tasks'}</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => this.props.hideModal()}
                        style={{position: 'absolute', right: 10, top: 10}}>
                        <Text style={{color: this.props.category.textColor, fontSize: 18, textAlign: 'right', paddingHorizontal: 10}}>Close</Text>
                        {/* <FontAwesome name="close" size={25} color="#444" style={{alignSelf: 'center'}} /> */}
                    </TouchableOpacity>
                </View>
                {this.state.categoryTasks.length == 0 ? 
                <View style={{flex: 1, justifyContent: 'flex-start'}}>
                    <View 
                        style={{...categoriesStyles.categoryElement, borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
                        <View style={{width: '15%', justifyContent: 'center', alignItems:'center'}}>
                            {/* <FontAwesome name="circle-thin" size={35} color="#fff" /> */}
                        </View>
                        <View style={{width: '85%', justifyContent: 'flex-start'}}>
                            <Text style={{...categoriesStyles.categoryTitle, color: this.props.category.textColor}}>No tasks in this category</Text>
                        </View>
                    </View>
                </View>
                :
                <FlatList
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                    style={{width: '100%', zIndex: 1}}
                    showsVerticalScrollIndicator={false}
                    data={this.state.categoryTasks}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            key={item.id} 
                            onLongPress={() => this.taskPressed(item.id)}
                            onPress={() => this.taskCompleted(item)}
                            style={{...categoriesStyles.categoryElement, borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
                            <View style={{width: '15%', justifyContent: 'center', alignItems:'center'}}>
                                {item.completed ? 
                                    <MaterialCommunityIcons name="check-circle" size={35} color="#07c411" />
                                :
                                    item.pressed ?
                                    <MaterialCommunityIcons name="check-circle" size={35} color="#1e7fff" />
                                    :
                                    <FontAwesome name="circle-thin" size={35} color={item.textColor} />
                                }
                            </View>
                            <View style={{width: '85%', justifyContent: 'flex-start'}}>
                                <Text style={{...categoriesStyles.categoryTitle, color: item.textColor}}>{item.name}</Text>
                                {item.pressed ? 
                                <Text style={{color: item.textColor}}>
                                    <MaterialCommunityIcons name="clock-outline" color="#aaa" size={14} /> 
                                    {item.due_date}
                                </Text>
                                : null
                                }
                            </View>
                        </TouchableOpacity>
                    )}
                />
                }
                {this.state.taskSelected ? null :
                <TouchableOpacity 
                    onPress={() => {
                        this.props.hideModal();
                        this.props.navigation.navigate('NewTaskScreen', {
                            category: this.props.category
                        });
                    }} 
                    style={{...plusStyle.container, zIndex:2, backgroundColor: '#f2f2f2'}}>
                    <Text style={{...plusStyle.plus, color: '#1e7fff'}}>+</Text>
                </TouchableOpacity>
                }
            </View>
            </Modal>
        )
    }
}