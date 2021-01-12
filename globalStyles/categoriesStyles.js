import { StyleSheet } from 'react-native'

export const categoriesStyles = StyleSheet.create({
    categoryContainer: {
        width: '100%',
        alignItems: 'center'
    },
    categoryElement: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 15,
        marginVertical: 5,
        borderRadius: 10
    },
    categoryTitle: {
        fontSize: 20,
        // fontWeight: 'bold'
        fontWeight: '900'
    },
    categoryTaskCount: {
        fontSize: 16,
    },
    checkedCircle: {
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        backgroundColor: '#fff', 
        justifyContent: 'center',
        alignItems: 'center'
    }
})