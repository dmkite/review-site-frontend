const axios = require('axios') 
const baseURL = 'http://localhost:3000'
const reviews = require('./reviews')
const {snackTemplate} = require('./templates')

function init(){
    document.querySelector('#signout').addEventListener('click', signout)
    const token = localStorage.getItem('token')
    if(!token) return window.location.pathname = '/'
    
    else axios.get(baseURL+'/auth/token', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        customGreet(response.data.user)
        displaySnacks()
    })
    .catch(err => {
        localStorage.removeItem('token')
        window.location.pathname = '/'
    })
}

function signout(){
    localStorage.removeItem('token')
    window.location.pathname = '/'
}

function customGreet(user){
    document.querySelector('body').setAttribute('data-id', user.id)
    document.querySelector('#snacks header h2').innerHTML += `What's cooking, ${user.first_name}?`
}

function displaySnacks(){
    const id = document.querySelector('body').getAttribute('data-id')
    axios.get(baseURL+'/api/snacks')
    .then(result => {
        const indexedResults = index(result.data)
        return indexedResults
    })
    .then(index => {
            axios.get(baseURL + `/users/${id}/reviews`)
            .then(result => {
                result.data.data.forEach(item => index[item.snack_id].reviewed = true)
                return addReviewCt(index)
            })
            .then(index => {
            HTMLify(index)
            return reviews.init()
            })
        
        .catch(err => console.log(err))
    })

}

function addReviewCt(index){
    return axios.get(baseURL + `/reviews/count`)
    .then(result => {
        result.data.data.forEach(snack => {
            index[snack.snack_id].reviews = snack.count
            index[snack.snack_id].avg = snack.avg
        })
        return index
    })
    .catch(err => console.log(err))
}

function index(arr){
   let result = arr.reduce((acc, item) => {
      acc[item.id] = item
      return acc  
    }, {})
    return result
}

function HTMLify(obj){
    let HTMLArray = []
    for (let key in obj){   
        let result = snackTemplate(obj[key]) 
        HTMLArray.push(result)
    }
    document.querySelector('#cardHolder').innerHTML = HTMLArray.join('')
}




module.exports = {init, displaySnacks}