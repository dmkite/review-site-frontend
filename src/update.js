const axios = require('axios')
const {addButtonListeners, addListenerToMany} = require('./utils')
const {confirmHTML} = require('./templates')
const baseURL = 'http://localhost:3000'

function init(){
    const edit = document.querySelectorAll('.edit')
    if (edit.length) addListenerToMany(edit, function (e) { editReview(e) })
}

function editReview(e) {
    const originalVals = textToInput(e)
    e.target.parentElement.innerHTML += confirmHTML('deny', 'positive', 'cancel', 'update')
    addButtonListeners(function (e) { minimize(e, originalVals) }, function (e) { update(e) })
}

function minimize(e, originalVals) {
    const box = document.querySelector('.confirmBox')
    setTimeout(
        function () {
            box.style.animation = 'shrink .25s ease-out'
            setTimeout(function () { box.remove() }, 250)
        }, 0)
    return inputToText(e, originalVals)
}

function inputToText(e, { contentH3, contentRating, contentText }) {
    e.target.parentElement.parentElement.children[0].innerHTML = contentH3
    e.target.parentElement.parentElement.children[1].innerHTML = contentRating
    e.target.parentElement.parentElement.children[2].innerHTML = contentText
}

function update(e) {
    let { id, user_id, snack_id, title, rating, text } = accumulateVals()
    const token = localStorage.getItem('token')
    if (!token) return window.location.pathname = '/'

    axios(baseURL + `/reviews/${user_id}`, {
        method: 'put',
        headers: { 'Authorization': `Bearer ${token}` },
        data: { id, user_id, snack_id, title, rating, text }
    })
        .then(result => {
            inputConfirmed()
            minimize()
        })
        .catch(err => console.log(err))
}


function textToInput(e) {
    let contentH3 = e.target.parentElement.children[0].textContent
    const stars = 5 - document.querySelectorAll('.modal .outline').length
    console.log(stars)
    let contentText = e.target.parentElement.children[2].textContent
    e.target.parentElement.children[0].innerHTML = `<input type="text" required value="${contentH3}">`
    e.target.parentElement.children[2].innerHTML = `<textarea required value="${contentText}">${contentText}</textarea>`
    textToStars(e,stars)
    const originalVals = { contentH3, stars, contentText }
    return originalVals
}

function inputConfirmed() {
    const input = document.querySelectorAll('input')
    const textarea = document.querySelector('textarea')
    input[0].parentElement.innerHTML = input[0].value
    input[1].parentElement.innerHTML = input[1].value 
    textarea.parentElement.innerHTML = textarea.value
    return
}

function accumulateVals() {
    result = {}
    result.id = document.querySelector('.positive').parentElement.parentElement.getAttribute('data-id')
    result.user_id = document.querySelector('body').getAttribute('data-id')
    result.snack_id = document.querySelector('.modal').getAttribute('data-id')
    result.title = document.querySelectorAll('input')[0].value
    result.rating = document.querySelectorAll('#rating .stars').length
    result.text = document.querySelector('textarea').value
    return result
}

module.exports = {init}