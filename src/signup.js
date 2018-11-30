function init(){
    console.log('x')
    document.addEventListener('keydown', activateBtn)
}

function checkInputs(){
    const inputs = document.querySelectorAll('input')
    result = {}
    for (let input of inputs){
        if(!input.value) return false
        result[input.id] = input.value
    }
    if (result.retypePassword !== result.password) return false
    delete result.retypePassword
    return result
}

function activateBtn(){
    checkPasswords()
    let result = checkInputs()
    console.log(result)
    if(!result) return false
    document.querySelector('#submit').classList.remove('disabled') 
    document.querySelector('#signup').addEventListener('submit', function(e){submit(e, result)})
}

function submit(e, result){
    e.preventDefault()
    console.log('yup')
}

function checkPasswords(){
    const retypePassword = document.querySelector('#retypePassword')
    const password = document.querySelector('#password')
    retypePassword.onfocus = function(){
        while(retypePassword.value !== password.value)
        document.querySelector('.passwordWarning').classList.remove('hidden')
    }
}
module.exports = {init}

