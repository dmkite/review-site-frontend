const path = window.location.pathname

const login = require('./src/login')
const snacks = require('./src/snacks')

const paths = {
    '/': login.init,
    '/index.html': login.init,
    '/snacks.html': snacks.init
}

if(paths[path]){paths[path]()}

// else {console.error(`no path written for ${path}`)}