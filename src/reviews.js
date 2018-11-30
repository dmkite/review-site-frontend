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
        initPath()
        document.querySelector('.modal').onclick = initPath
    })
}

function initPath(){
    const edit = document.querySelectorAll('.edit')
    if (!!edit.length) {
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
            init()
        },250)
}

function getReviews(id){
    return axios.get(baseURL + `/api/snacks/${id}/reviews`)
    .then(result => {
        const reviewArray = []
        if (result.data.length > 0){
            result.data.forEach(review => reviewArray.push(reviewHTML(review)))
            document.querySelector('.commentsContainer').innerHTML = reviewArray.join('')
        }
    })
}



module.exports = {init, getReviews}