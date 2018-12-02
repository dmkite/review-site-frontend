const axios = require('axios')
const baseURL = 'http://localhost:3000'
const del = require('./delete')
const create = require('./create')
const update = require('./update')
const {modalHTML, reviewHTML} = require('./templates')

function init(){
    const cards = document.querySelectorAll('.card')
    for(let card of cards){
        card.addEventListener('click', function(e){modal(e)})
    }
}

function modal(e){
    e.stopPropagation()
    const id = e.currentTarget.getAttribute('data-id')
    return axios.get(baseURL+`/api/snacks/${id}`)
    .then(result => {
        document.querySelector('body').innerHTML += modalHTML(result.data[0])
        $('.ui.modal')
            .modal('show')
            ;
        document.querySelector('.close').addEventListener('click', remove)
        getReviews(id)
        document.querySelector('.modal').onclick = initPath
    })
}

function initPath(){
    const edit = document.querySelectorAll('.edit')
    const createBtn = document.querySelector('#create')
    if (!!edit.length) {
        createBtn.classList.add('disabled')
        del.init()
        update.init()
    }
    else create.init()
}

function remove(e){
    const modal = document.querySelector('.modal')
    setTimeout(
        function(){
            modal.remove()
            location.reload()
        },250)
}
//Below can be used for averages as well
function getReviews(id){
    return axios.get(baseURL + `/api/snacks/${id}/reviews`)
    .then(result => {
        const reviewArray = []
        if (result.data.length > 0){
            result.data.forEach(review => reviewArray.push(reviewHTML(review)))
            document.querySelector('.commentsContainer').innerHTML = reviewArray.join('')
        }
        initPath()
        $('.rating').rating('disable');  
    })
}



module.exports = {init, getReviews}