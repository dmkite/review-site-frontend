const axios = require('axios')
const reviewCrud = require('./review-crud')
const reviews = require('./reviews')
const baseURL = 'http://localhost:3000'

function init(){
    let createBtn = document.querySelector('#create')
    createBtn.onclick = null
    createBtn.addEventListener('click', reviewSetup)
}

function reviewSetup(){
    document.querySelector('#create').classList.add('disabled')
    document.querySelector('.commentsContainer').innerHTML += reviewTemplate()
    $('.rating').rating();
    $('.toggle .rating').rating({initialRating: 2, maxRating: 5});
    document.querySelector('#submit').addEventListener('click', function(e){submitReview(e)})
}

function reviewTemplate(){
    return `
    <div class="newReview">
        <form class="reviewForm">
            <label for="title">Title:</label>
            <input id="Title" required maxlength="50">
            <label for="rating">Rating:</label>
            <div id="rating" class="ui rating" data-max-rating="5"></div>
            <label for="text">What's the scoop?</label>
            <textarea id="text" required maxlength="255"></textarea>
            <div id="submit" class="ui positive button">submit</div>
        </form>
    </div>`
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
        console.log(result)
        e.target.parentElement.parentElement.setAttribute('data-id', result.data.data[0].id)
        // reviews.getReviews(document.querySelector('.modal').getAttribute('data-id'))
    })
    .catch(err => console.error(err))
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