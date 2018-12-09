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
    $('.currentEdit').rating('enable')
    document.querySelector('.currentEdit').classList.remove('currentEdit')
    document.addEventListener('change', disableIfEmpty)
}

function disableIfEmpty(){
    inputs = document.querySelectorAll('input')
    for (let input of inputs){
        if (input.value === '') return document.querySelector('#button2').classList.add('disabled')
    }
    return document.querySelector('#button2').classList.remove('disabled')
}
function textToInput(e) {
    let contentH3 = e.target.parentElement.children[0].textContent
    e.target.parentElement.children[1].classList.add('currentEdit')
    const stars = document.querySelectorAll('.currentEdit .active').length

    let contentText = e.target.parentElement.children[2].textContent
    e.target.parentElement.children[0].innerHTML = `<input type="text" required value="${contentH3}">`
    e.target.parentElement.children[2].innerHTML = `<textarea required value="${contentText}">${contentText}</textarea>`

    const originalVals = { contentH3, stars, contentText }
    return originalVals
}


function minimize(e, originalVals) {
    const box = document.querySelector('.confirmBox')
    setTimeout(
        function () {
            box.style.animation = 'shrink .25s ease-out'
            setTimeout(function () { box.remove() }, 250)
        }, 0)
    inputToText(e, originalVals)
    $('.rating').rating()
    $('.rating').rating('disable')
}

function inputToText(e, { contentH3, stars, contentText }) {
    e.target.parentElement.parentElement.children[0].innerHTML = contentH3
    e.target.parentElement.parentElement.children[1].innerHTML = ''
    e.target.parentElement.parentElement.children[1].setAttribute('data-rating', stars)
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

function inputConfirmed() {
    const input = document.querySelectorAll('input')
    const textarea = document.querySelector('textarea')
    input[0].parentElement.innerHTML = input[0].value
    textarea.parentElement.innerHTML = textarea.value
    return 
}


function accumulateVals() {
    result = {}
    result.id = document.querySelector('.positive').parentElement.parentElement.parentElement.getAttribute('data-id')
    result.user_id = document.querySelector('body').getAttribute('data-id')
    result.snack_id = document.querySelector('.modal').getAttribute('data-id')
    result.title = document.querySelectorAll('input')[0].value
    result.rating = getRating()
    result.text = document.querySelector('textarea').value
    return result
}

function getRating(){
    const starIcons = document.querySelector('textarea').parentElement.previousElementSibling.children
    let stars = 0
    for(icon of starIcons){
        if(icon.classList.contains('active')) stars++
    }
    return stars
}

module.exports = {init}