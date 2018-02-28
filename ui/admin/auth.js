import { login as loginConnector } from './connectors'

//-------------------------------------------------------------------
var login = {
    actions: {
        login: loginConnector.create,
    },
}

login.fields = [
    {
        name: 'username',
        label: 'Username',
        field: 'Text',
    },
    {
        name: 'password',
        label: 'Password',
        field: 'Password',
    },
]

//-------------------------------------------------------------------
module.exports = {
    login,
    logout: undefined, // Logout is optional
}
