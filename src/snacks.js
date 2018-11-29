const axios = require('axios') 
const baseURL = 'http://localhost:3000'
const reviews = require('./reviews')

function init(){
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
        result.data.data.forEach(snack => index[snack.snack_id].reviews = snack.count)
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

function snackTemplate(snack){
    let colorClass = false
    if(snack.reviewed) colorClass ='olive'
    let reviews = '0 reviews'
    if(snack.reviews == 1) reviews = `${snack.reviews} review` 
    else if (snack.reviews > 1) reviews = `${snack.reviews} reviews`
    
return `
    <div class="${colorClass || ''} fluid card" data-id="${snack.id}">
        <div class="image" style="background-image:url('${snack.img}')">
        </div>

        <div class="content">
            <div class="header">${snack.name}</div>
        </div>

        <div class="extra content">
            <span>
                <i class="comments outline icon"></i>
                ${reviews}
            </span>
        </div>

    </div>`
}


module.exports = {init}