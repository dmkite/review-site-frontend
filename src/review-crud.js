const axios = require('axios')
const alert = require('./alert')
const baseURL = 'http://localhost:3000'
const create = require('./create')
const reviews = require('./reviews')

function addListenerToMany(eleArr, fn){
    eleArr.forEach(ele => ele.addEventListener('click', fn))
}

function init(){
    const edit = document.querySelectorAll('.edit')
    const trash = document.querySelectorAll('.trash')
    addListenerToMany(edit, function(e){editReview(e)})
    addListenerToMany(trash, function (e) { delReview(e) })
    if(!!edit.length) document.querySelector('#create').classList.add('disabled')
    else create.init()
}

function delReview(e){
    e.target.parentElement.innerHTML += confirmHTML('deny', 'negative', 'cancel', 'delete')
    addButtonListeners(minimize, remove)
}

function confirmHTML(type1, type2, text1, text2){
    return `
    <div class="confirmBox" >
        Are you sure about that?
        <div id="button1" class="ui ${type1} button">${text1}</div>
        <div id="button2" class="ui ${type2} button">${text2}</div>
    </div >`
}

function addButtonListeners(fn1, fn2){
    document.querySelector('#button1').addEventListener('click', fn1)
    document.querySelector('#button2').addEventListener('click', fn2)
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

    const token = localStorage.getItem('token')
    if (!token) return window.location.pathname = '/'

    axios.delete(baseURL + `/reviews/${id}`, {
        headers: { 'Authorization': `Bearer ${token}`}
    })
    .then(result => {
        alert(success, result.data)
        review.remove()
        // reviews.getReviews(document.querySelector('.modal').getAttribute('data-id'))
    })
    .catch(err => {
        alert('danger', err)
    })
}

function editReview(e){
    const originalVals = textToInput(e)
    e.target.parentElement.innerHTML += confirmHTML('deny', 'positive','cancel', 'update')
    addButtonListeners(function(e){minimize2(e, originalVals)}, function(e){update(e)})
}

function minimize2(e, originalVals){
    minimize()
    inputToText(e, originalVals)
}

function textToInput(e){
    let contentH3 = e.target.parentElement.children[0].textContent
    let contentRating = e.target.parentElement.children[1].textContent
    let contentText = e.target.parentElement.children[2].textContent
    e.target.parentElement.children[0].innerHTML = `<input type="text" required value="${contentH3}">`
    e.target.parentElement.children[1].innerHTML = `<input type="text" required value="${contentRating}">`
    e.target.parentElement.children[2].innerHTML = `<textarea required value="${contentText}">${contentText}</textarea>`
    const originalVals = {contentH3, contentRating, contentText}
    return originalVals
}

function inputToText(e, { contentH3, contentRating, contentText }){
    e.target.parentElement.parentElement.children[0].innerHTML = contentH3
    e.target.parentElement.parentElement.children[1].innerHTML = contentRating
    e.target.parentElement.parentElement.children[2].innerHTML = contentText
}

function update(e){
    let {id, user_id, snack_id, title, rating, text} = accumulateVals()
    const token = localStorage.getItem('token')
    if (!token) return window.location.pathname = '/'

    axios(baseURL + `/reviews/${user_id}`, {
        method: 'put', 
        headers: { 'Authorization': `Bearer ${token}`},
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
    input[1].parentElement.innerHTML = input[1].value
    textarea.parentElement.innerHTML = textarea.value
}

function accumulateVals(){
    result = {}
    result.id = document.querySelector('.positive').parentElement.parentElement.getAttribute('data-id')
    result.user_id = document.querySelector('body').getAttribute('data-id')
    result.snack_id = document.querySelector('.modal').getAttribute('data-id')
    result.title = document.querySelectorAll('input')[0].value
    result.rating = document.querySelectorAll('input')[1].value
    result.text = document.querySelector('textarea').value
    return result
}

module.exports = {init, accumulateVals}
