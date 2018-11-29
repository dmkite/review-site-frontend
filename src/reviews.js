const axios = require('axios')
const baseURL = 'http://localhost:3000'

function init(){
    const cards = document.querySelectorAll('.card')
    for(let card of cards){
        card.addEventListener('click', function(e){modal(e)})
    }
}

function modal(e){
    e.stopPropagation()
    const id = e.currentTarget.getAttribute('data-id')
    console.log(id)
    return axios.get(baseURL+`/api/snacks/${id}`)
    .then(result => {
        console.log(result)
        document.querySelector('body').innerHTML += modalHTML(result.data[0])
        $('.ui.modal')
            .modal('show')
            ;
    })

}


function modalHTML(card){
    console.log(card)
   return  `
   <div class="ui modal" >
        <i class="close icon"></i>
        <div class="image content">
            <div class="ui medium image">
                <img src="${card.img}" alt="Image of ${card.name}">
            </div>
            <div class="description">
                <div class="ui header">${card.name}</div>
                <p>${card.description}</p>
                
                <div class="ui vertical animated button" tabindex="0">
                    <div class="visible content">$${card.price}</div>
                    <div class="hidden content">
                        <i class="shop icon"></i>
                    </div>
                </div>

            </div>
        </div>

            <div class="actions">
                <div class="ui positive right labeled icon button">
                    add a review
                    <i class="checkmark icon"></i>
                </div>
            </div>
        </div>`
}
module.exports = {init}