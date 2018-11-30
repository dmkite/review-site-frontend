const axios = require('axios')
const baseURL = 'http://localhost:3000'
const{confirmHTML} = require('./templates')
const {alert, addListenerToMany, addButtonListeners} = require('./utils')

function init(){
    const trash = document.querySelectorAll('.trash')
    if (trash.length){ 
        addListenerToMany(trash, function (e) { delReview(e) })
        document.querySelector('#create').classList.add('disabled')
    }
}

function delReview(e){
    e.target.parentElement.innerHTML += confirmHTML('deny', 'negative', 'cancel', 'delete')
    addButtonListeners(minimize, remove)
}

function minimize(){
    const box = document.querySelector('.confirmBox')
    setTimeout(
        function(){box.style.animation = 'shrink .25s ease-out'
        setTimeout( function(){ box.remove()}, 250)
    }, 0)
    init()
}

function remove(){
    const review = document.querySelector('.confirmBox').parentElement.parentElement
    const id = review.getAttribute('data-id')
    console.log(review, id)
    const token = localStorage.getItem('token')
    if (!token) return window.location.pathname = '/'

    return axios.delete(baseURL + `/reviews/${id}`, {
        headers: { 'Authorization': `Bearer ${token}`}
    })
    .then(result => {
        console.log('hitting this result')
        // alert(success, result.data)
        review.remove()
        // reviews.getReviews(document.querySelector('.modal').getAttribute('data-id'))
    })
    .catch(err => {
        console.log('possibly?')
        alert('danger', err)
    })
}

module.exports = {init, addListenerToMany}
