import React, { Component } from 'react'
import {View, Text, TouchableOpacity, FlatList} from 'react-native'
import axios from 'react-native-axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categoriesStyles } from '../../globalStyles/categoriesStyles';
import { formStyles } from '../../globalStyles/formStyles';


export class CategoriesList extends Component {
    constructor(props) {
        super(props)
        this.state={
            token: '',
            categoriesList: []
        }
    }

    // getAllCategories = async() => {
    //     console.log('getting categories')
    //     let token = this.state.token
    //     await axios.get('https://tasker.zombiesoup.co/api/lists', {
    //         headers: {
    //             'Authorization': 'Bearer '+token
    //         }
    //     })
    //     .then((response) => {
    //         let lists = response.data.data
    //         for(let i=0; i<lists.length; i++) {
    //             if(lists[i].color == '#FFE761' || lists[i].color == '#BCD2F3' ) {
    //                 lists[i].textColor = '#444'
    //             } else {
    //                 lists[i].textColor = '#fff'
    //             }
    //             let id_str = lists[i].id.toString()
    //             lists[i].id = id_str
    //         }
    //         // for(let i=0; i<response.data.data.length; i++) {
    //         //     let id_str = response.data.data[i].id.toString()
    //         //     categoriesList.push(response.data.data[i])
    //         //     categoriesList[i].id = id_str
    //         // }
    //         this.setState({
    //             categoriesList: lists
    //         })
    //     })
    // }

    render() {
        return(
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10, flex: 1}}>
                <Text style={{...formStyles.inputLabel, fontSize: 18, alignSelf: 'flex-start', marginLeft: '20%'}}>Lists</Text>
                <FlatList
                    style={{width: '85%', zIndex: 1}}
                    showsVerticalScrollIndicator={false}
                    data={this.props.categoriesList}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            key={item.id} 
                            onPress={() => this.props.showModal(item)}
                            style={{...categoriesStyles.categoryElement, paddingHorizontal:15, zIndex:1, backgroundColor: item.color}}>
                            <View style={{flex:5}}>
                                <Text style={{...categoriesStyles.categoryTitle, color: item.textColor}}>{item.name}</Text>
                                {item.task_count == 1 ?
                                <Text style={{...categoriesStyles.categoryTaskCount, color: item.textColor}}>{item.task_count} task</Text>
                                :
                                <Text style={{...categoriesStyles.categoryTaskCount, color: item.textColor}}>{item.task_count} tasks</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }
}