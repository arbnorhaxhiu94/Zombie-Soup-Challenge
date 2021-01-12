import { StyleSheet } from 'react-native'

export const formStyles = StyleSheet.create({
    formContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    inputLabel: {
        marginBottom: 5,
        fontSize: 18,
        textAlign: 'center',
        color: '#252A31',
        opacity: 0.3
    },
    textinput: {
        width: '80%',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#BCD2F3',
        borderRadius: 10,
        backgroundColor: '#f2f2f2'
    },
    buttonsContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        marginTop: 10
    },
    button: {
        width: '80%',
        padding: 15,
        marginTop: 20,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center'
    }
})