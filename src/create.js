const axios = require('axios')

function init(){
    let createBtn = document.querySelector('#create')
    createBtn.onclick = null
    createBtn.addEventListener('click', reviewSetup)
}


function reviewSetup(){
    document.querySelector('#create').classList.add('disabled')
    document.querySelector('.commentsContainer').innerHTML += reviewTemplate()
    $('.rating').rating();
    $('.toggle .rating')
        .rating({
            initialRating: 2,
            maxRating: 5
        })
        ;
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
            <div class="ui positive button">submit</div>
        </form>
    </div>`
}



module.exports = {init}