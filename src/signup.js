const axios = require('axios')
const baseURL = 'http://localhost:3000'
const {alert} = require('./utils')
function init(){
    console.log('x')
    document.addEventListener('keyup', activateBtn)
}

function checkInputs(){
    const inputs = document.querySelectorAll('input')
    result = {}
    for (let input of inputs){
        if(!input.value) return false
        result[input.id] = input.value
    }
    if (result.retypePassword !== result.password) return false
    delete result.retypePassword
    return result
}

function activateBtn(){
    checkPasswords()
    let result = checkInputs()
    if(!result) return false
    document.querySelector('#submit').classList.remove('disabled') 
    document.querySelector('#signup').addEventListener('submit', function(e){submit(e, result)})
}

function checkPasswords(){
    const retypePassword = document.querySelector('#retypePassword')
    retypePassword.addEventListener('keyup', isEqual)
    }

function isEqual(){
    const retypePassword = document.querySelector('#retypePassword').value
    const password = document.querySelector('#password').value
    if(retypePassword !== password) document.querySelector('.passwordWarning').classList.remove('hidden')
    else document.querySelector('.passwordWarning').classList.add('hidden')
}

function submit(e, result) {
    e.preventDefault()
    return axios.post(baseURL+'/users', result)
    .then( () => {
        return window.location.pathname = '/'
    })
    .catch(err => {
        console.error(err)
        alert('danger', err)
    })
}


module.exports = {init}