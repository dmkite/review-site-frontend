const axios = require('axios')
const baseURL = 'http://localhost:3000'
const del = require('./delete')
const create = require('./create')
const update = require('./update')
const {modalHTML, reviewHTML} = require('./templates')

function init(){
    const cards = document.querySelectorAll('.card')
    for(let card of cards){
        card.onclick =  function(e){modal(e)}
    }
}

function modal(e){
    e.stopPropagation()
    const id = e.currentTarget.getAttribute('data-id')
    return axios.get(baseURL+`/api/snacks/${id}`)
    .then(result => {
        document.querySelector('body').innerHTML += modalHTML(result.data[0])
        $('.ui.modal').modal('show');
        getReviews(id)
        document.querySelector('.modal').onclick = initPath
    })
    .then( () => {
        document.querySelector('.close').onclick = function (e) { remove }
        document.querySelector('.modals').onclick = function (e) { remove }
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
////////Issue: open modal, click dark screen or x, should delete modal and addlisteners to cards, but it doesn't

function remove(e){
    if (!e.target.classList.contains('modals') || !e.currentTarget.classList.contains('close')) return false
    const modal = document.querySelector('.modal')
    setTimeout(
        function(){
            modal.remove()
            document.querySelector('.ui.dimmer.modals').innerHTML = ''
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
        initPath()
        $('.rating').rating('disable');  
    })
}



module.exports = {init, getReviews}