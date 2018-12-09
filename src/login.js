const axios = require('axios')
const baseURL = 'http://localhost:3000'
const {alert} = require('./utils')

function init(){
    const login = document.querySelector('#login') 
    document.addEventListener('keyup', checkIfEmpty)

    login.addEventListener('submit', function(e){
        const email = document.querySelector('#email').value
        const password = document.querySelector('#password').value
        tryLogin(e, email, password)
    })
}

function checkIfEmpty(){
    const inputs = document.querySelectorAll('input')
    for(let input of inputs){
        if(input.value === '') return document.querySelector('.submit').classList.add('disabled')
    }
    document.querySelector('.submit').classList.remove('disabled')
}
function tryLogin(e, email, password){
    e.preventDefault()
    return axios.post(baseURL+'/auth/login', {email, password})
    .then(result => {
        localStorage.setItem('token', result.data.token)
        window.location.pathname = '/snacks.html'
    })
    .catch(err => {
        if(err.message[err.message.length - 1] == 1) return document.querySelector('#passwordWarning').classList.remove('hidden')
        document.querySelector('#emailWarning').classList.remove('hidden')
    })
}

module.exports = {init}