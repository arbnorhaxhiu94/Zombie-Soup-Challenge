import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Today } from '../screens/today';
import { Category } from '../screens/category';
import { NewCategory } from '../screens/newTaskCategoryScreens/newCategoryScreen';
import { NewTask } from '../screens/newTaskCategoryScreens/newTaskScreen';

const Stack = createStackNavigator();

export function ZombieStack({logout}) {

    return (
        <NavigationContainer independent={true} >
            <Stack.Navigator
                headerMode="screen"
                screenOptions={({navigation}) => ({
                    // headerTitle: () => <Header color='#2d3f89' navigation={navigation} language="Anglisht" />,
                    // headerStyle: {
                    //     height: 65
                    // }
                })}>
                    <Stack.Screen name="TodayScreen" options={{headerShown: false}}>
                        {props => <Today {...props} logout={logout} />}
                    </Stack.Screen>
                    <Stack.Screen 
                        name="CategoryScreen" 
                        component={Category} 
                        initialParams={{'logout': logout}}
                        options={{headerShown: false}} />
                    <Stack.Screen 
                        name="NewTaskScreen" 
                        component={NewTask} 
                        options={{headerShown: false}} />
                    <Stack.Screen 
                        name="NewCategoryScreen" 
                        component={NewCategory} 
                        options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
        );
  
}
