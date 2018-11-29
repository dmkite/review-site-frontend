function alert(type, message){
    const alertHTML = `<div class="${type} alert">${message}</div>`
    document.querySelector('body').innerHTML += alertHTML
}

module.exports = alert