const axios = require('axios')
const baseURL = 'http://localhost:3000'
const {alert} = require('./utils')

function init(){
    const login = document.querySelector('#login')

    login.addEventListener('submit', function(e){
        const email = document.querySelector('#email').value
        const password = document.querySelector('#password').value
        tryLogin(e, email, password)
    })
}

function tryLogin(e, email, password){
    e.preventDefault()
    return axios.post(baseURL+'/auth/login', {email, password})
    .then(result => {
        localStorage.setItem('token', result.data.token)
        window.location.pathname = '/snacks.html'
    })
    .catch(err => {
        alert('danger', err)
    })
}

module.exports = {init}