import { StyleSheet } from 'react-native'

export const plusStyle = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10
    },
    plus: {
        fontSize: 30,
    },
    options: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 200,
        height: 100,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        elevation: 10
    },
    optionsText: {
        flex: 6,
        fontSize: 18,
        color: '#1e7fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    logoutOption: {
        position: 'absolute',
        top: 60,
        right: 10,
        width: 200,
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 10,
        flexDirection:'row', 
        alignItems: 'center'
    }
})