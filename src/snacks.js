const axios = require('axios') 
const baseURL = 'http://localhost:3000'

function init(){
    const token = localStorage.getItem('token')
    if(!token) return window.location.pathname = '/'
    
    else axios.get(baseURL+'/auth/token', {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        customGreet(response.data.user)
        displaySnacks()
    })
    .catch(() => {
        localStorage.removeItem('token')
        window.location.pathname = '/'
    })
}

function customGreet(user){
    document.querySelector('body').setAttribute('data-id', user.id)
    document.querySelector('body').innerHTML += `What's cooking, ${user.first_name}?`
}

function displaySnacks(){
    const id = document.querySelector('body').getAttribute('data-id')
    axios.get(baseURL+'/api/snacks')
    .then(result => {
        const indexedResults = index(result.data)
        return indexedResults
    })
    .then(index => {
        axios.get(baseURL+`/users/${id}/reviews`)
        .then(result => {
            console.log(result)
            result.data.data.forEach(item => index[item.id].reviewed = true)
            HTMLify(index)
        })
        .catch(err => console.log(err))
    })

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
        if (obj[key].hasOwnProperty('reviewed') ) console.log('found')
        HTMLArray.push(result)
    }
    document.querySelector('body').innerHTML = HTMLArray.join('')
}

function snackTemplate(snack){
    let colorClass = false
    if(snack.reviewed) colorClass ='olive'
return `
    <div class="${colorClass || ' '} card" data-id="${snack.id}">
        <div class="image">
            <img src="${snack.img}" alt="Image of ${snack.name}>
        </div>

        <div class="content">
            <div class="header">${snack.name}</div>
            <div class="meta">
                <a>Friends</a>
            </div>
        </div>

        <div class="extra content">
            <span class="right floated">Joined in 2013</span>
            <span>
                <i class="comment outline"></i>
                0 reviews
            </span>
        </div>

    </div>`
}

module.exports = {init}