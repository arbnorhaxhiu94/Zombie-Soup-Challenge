import React, { Component } from 'react'
import {View, Text, TouchableOpacity} from 'react-native'

export class Category extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <View>
                <Text>Category Tasks</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('TodayScreen')}>
                    <Text>To Today Screen</Text>
                </TouchableOpacity>
            </View>
        )
    }
}