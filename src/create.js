const axios = require('axios')
const baseURL = 'http://localhost:3000'
const {reviewTemplate, reviewHTML} = require('./templates')


function init(){
    const edit = document.querySelectorAll('.edit')
    let createBtn = document.querySelector('#create')
    // createBtn.onclick = null
    createBtn.addEventListener('click', reviewSetup)
}

function reviewSetup(){
    document.querySelector('#create').classList.add('disabled')
    document.querySelector('.commentsContainer').innerHTML += reviewTemplate()
    $('.rating').rating();
    $('.toggle .rating').rating({initialRating: 2, maxRating: 5});
    document.querySelector('#submit').addEventListener('click', function(e){submitReview(e)})
}

function submitReview(e){
    const token = localStorage.getItem('token')
    if(!token) window.location.pathname = '/'
    const id = document.querySelector('body').getAttribute('data-id')
    const review = accumulateVals()
    axios(baseURL + `/reviews/${id}`, {
        method: 'post',
        headers: { 'Authorization': `Bearer ${token}` },
        data: review
    })
    .then(result => {
        e.target.parentElement.parentElement.setAttribute('data-id', result.data.data[0].id)
        getReviews(document.querySelector('.modal').getAttribute('data-id'))
    })
    .catch(err => console.error(err))
}

function getReviews(id) {
    return axios.get(baseURL + `/api/snacks/${id}/reviews`)
        .then(result => {
            const reviewArray = []
            if (result.data.length > 0) {
                result.data.forEach(review => reviewArray.push(reviewHTML(review)))
                document.querySelector('.commentsContainer').innerHTML = reviewArray.join('')
            }
        })
}

function accumulateVals() {
    result = {}
    result.user_id = document.querySelector('body').getAttribute('data-id')
    result.snack_id = document.querySelector('.modal').getAttribute('data-id')
    result.title = document.querySelectorAll('input')[0].value
    result.rating = getStarRating()
    result.text = document.querySelector('textarea').value
    return result
}

function getStarRating() {
    const stars = document.querySelector('.rating').children
    let rating = 0
    for(let star of stars){
        if (star.classList.contains('active')) rating++
    }
    return rating
}

module.exports = {init}