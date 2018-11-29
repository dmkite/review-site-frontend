const axios = require('axios')

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
}

function minimize(){
    document.querySelector('')
}

module.exports = {init}