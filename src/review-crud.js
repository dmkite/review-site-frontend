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
    e.target.parentElement.innerHTML += confirmHTML()
    addButtonListeners()
}

function confirmHTML(){
    return `
    <div class="confirmBox" >
        Are you sure about that?
        <div class="ui black deny button">cancel</div>
        <div class="ui negative button">delete</div>
    </div >`
}

function addButtonListeners(){
    document.querySelector('.deny').addEventListener('click', minimize)
    document.querySelector('.negative').addEventListener('click', remove)
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
    console.log(e.target.parentElement)
    let contentH3 = e.target.parentElement.children[0].textContent
    let contentRating = e.target.parentElement.children[1].textContent
    let contentText = e.target.parentElement.children[2].textContent
    console.log(contentH3)
    e.target.parentElement.children[0].innerHTML = `<input type="text" required value="${contentH3}">`
    e.target.parentElement.children[1].innerHTML = `<input type="text" required value="${contentRating}">`
    e.target.parentElement.children[2].innerHTML = `<textarea required value="${contentText}"></textarea>`
    // e.target.parentElement.children[2].children[0].textContent = contentText 
    console.log(e.target.parentElement.children[2].children[0])


}
module.exports = {init}
