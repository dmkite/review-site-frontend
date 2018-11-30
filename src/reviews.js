const axios = require('axios')
const baseURL = 'http://localhost:3000'
const reviewCrud = require('./review-crud')

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
    })
}

function remove(e){
    const modal = document.querySelector('.modal')
    setTimeout(
        function(){
            modal.remove()
            init()
        },
        250
    )
}

function modalHTML(card){
   return  `
   <div class="ui modal" data-id="${card.id}" >
        <i class="close icon"></i>
        <div class="header">${card.name}</div>
        <div class="container">
        <main>
            <div class="image content">
                <div class="ui medium image">
                    <img src="${card.img}" alt="Image of ${card.name}">
                </div>
                <div class="description">
                    <p>${card.description}</p>
                    
                    <div class="ui vertical animated button" tabindex="0">
                        <div class="visible content">$${card.price}</div>
                        <div class="hidden content">
                            <i class="shop icon"></i>
                        </div>
                    </div>

                </div>
            </div>
        </main>
        <aside>
        <h3>Comments</h3>
        <div class="commentsContainer">Be the first to review ${card.name}!</div>
        </aside>
    </div>
        
            <div class="bottom">
                   
                    <div id="create" class="ui positive right labeled icon button">
                        add a review
                        <i class="plus circle icon"></i>
                    </div>
                
            </div>
        </div>`
}

function getReviews(id){
    return axios.get(baseURL + `/api/snacks/${id}/reviews`)
    .then(result => {
        const reviewArray = []
        result.data.forEach(review => reviewArray.push(reviewHTML(review)))
        document.querySelector('.commentsContainer').innerHTML = reviewArray.join('')
        return reviewCrud.init()
    })
}

function customizeReview(review){
    let deleteEdit = ''
    const userId = document.querySelector('body').getAttribute('data-id')    
    if (review.user_id == userId) deleteEdit = '<i class="edit icon"></i> <i class="trash alternate icon"></i>'
    let img = review.img
    if (!review.img) img = `<p>${review.first_name[0]}</p>`
    return {deleteEdit, img}
}

function reviewHTML(review){ 
    const {deleteEdit, img} = customizeReview(review) 
    return `
    <div class="review" data-id="${review.id}">
        <div class="profPic">${img}</div>

        <div class="reviewContent">
            <h3>${review.title}</h3>
            <p>${review.rating}</p>
            <p>${review.text}</p>
            ${deleteEdit}
        </div>
    </div>`
}

module.exports = {init}