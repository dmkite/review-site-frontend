const axios = require('axios')
const alert = require('./alert')
const baseURL = 'http://localhost:3000'

function addListenerToMany(eleArr, fn){
    eleArr.forEach(ele => ele.addEventListener('click', fn))
}

function init(){
    const edit = document.querySelectorAll('.edit')
    const trash = document.querySelectorAll('.trash')
    addListenerToMany(edit, function(e){editReview(e)})
    addListenerToMany(trash, function (e) { delReview(e) })
}

function delReview(e){
    console.log(e.target.parentElement)
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
        setTimeout(
            function(){ box.remove()},
            250
        )
    }, 0
    )
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
        console.log(result)
        alert(success, result.data)
        review.remove()
        window.location.pathname = '/snacks.html'
    })
    .catch(err => {
        alert(danger, err)
    })
}

function editReview(e){
    const originalVals = textToInput(e)
    e.target.parentElement.innerHTML += confirmHTML('deny', 'positive','cancel', 'update')
    addButtonListeners(function(e){minimize2(e, originalVals)})
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
    // console.log(e.target.parentElement.parentElement.children[0].children[0].value)
    // let contentH3 = e.target.parentElement.parentElement.children[0].children[0].value
    // let contentRating = e.target.parentElement.parentElement.children[1].children[0].value
    // let contentText = e.target.parentElement.parentElement.children[2].children[0].value

    e.target.parentElement.parentElement.children[0].innerHTML = contentH3
    e.target.parentElement.parentElement.children[1].innerHTML = contentRating
    e.target.parentElement.parentElement.children[2].innerHTML = contentText
}


module.exports = {init}
