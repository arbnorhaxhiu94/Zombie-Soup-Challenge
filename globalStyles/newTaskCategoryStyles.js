import { StyleSheet } from 'react-native'

export const newTCstyles = StyleSheet.create({
    buttonsContainer: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    buttons: {
        padding: 5,
    },
    buttonsText: {
        color: '#0f87ff',
        fontSize: 18,
    },
    colorCirclesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#BCD2F3',
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        flexDirection: 'row'
    },
    colorCircles: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    successMessageContainer: {
        position: 'absolute', 
        top: 300, 
        alignSelf: 'center', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: 250, 
        height: 150,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 10,
        zIndex: 2
    },
    successMessageTitle: {
        flex: 1,
        backgroundColor: 'green',
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        padding: 5,
        justifyContent: 'center'
    },
    successMessageTitleText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18
    },
    successMessageButton: {
        flex: 1,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    belt: {
        position: 'absolute', 
        width: '100%', 
        bottom: 0, 
        borderTopWidth: 1,
        borderColor: '#ddd'
    },
    inputsBelt: {
        height: 70,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 15
    },
    beltElements: {
        flex:1, 
        flexDirection: 'row',
        alignItems: 'center'
    }
})