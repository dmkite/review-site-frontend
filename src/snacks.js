const axios = require('axios') 
const baseURL = 'http://localhost:3000'

function init(){
    const token = localStorage.getItem('token')
    if(!token) return window.location.pathname = '/'
    
    else axios.get(baseURL+'/auth/token', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log(response)
        document.querySelector('body').setAttribute('data-id', response.data.sub.id)
    })
    .catch(err => {
        console.log(err)

    })
}

module.exports = {init}