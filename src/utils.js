function alert(type, message){
    const alertHTML = `<div class="${type} alert">${message}</div>`
    document.querySelector('body').innerHTML += alertHTML
}

function addListenerToMany(eleArr, fn) {
    eleArr.forEach(ele => ele.addEventListener('click', fn))
}

function addButtonListeners(fn1, fn2) {
    document.querySelector('#button1').addEventListener('click', fn1)
    document.querySelector('#button2').addEventListener('click', fn2)
}

module.exports = {alert, addListenerToMany, addButtonListeners}