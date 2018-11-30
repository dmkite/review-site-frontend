const path = window.location.pathname

const login = require('./src/login')
const snacks = require('./src/snacks')
const signup = require('./src/signup')

const paths = {
    '/': login.init,
    '/index.html': login.init,
    '/snacks.html': snacks.init,
    '/signup.html': signup.init
}

if(paths[path]){paths[path]()}

// else {console.error(`no path written for ${path}`)}