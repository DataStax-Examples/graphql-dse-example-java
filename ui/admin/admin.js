import React from 'react'
import CustomDashboard from './custom/Dashboard'

var guests = require('./views/guests')
var { login, logout } = require('./auth')

const OPTIONS = {
    debug: true,
    basePath: '/crudl/',
    baseURL: '/',
}

var admin = {}
admin.title = 'CRUDL GraphQL UI',
admin.options = OPTIONS
admin.views = { guests }
admin.auth = { login, logout }
admin.custom = { dashboard: CustomDashboard }
admin.id = 'crudl'
admin.messages = {
    'login.button': 'Sign in',
    'logout.button': 'Sign out',
    'logout.affirmation': 'Have a nice day!',
    'pageNotFound': 'Sorry, page not found',
}

export default admin
