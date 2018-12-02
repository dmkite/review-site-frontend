function confirmHTML(type1, type2, text1, text2) {
    let box = document.querySelectorAll('.confirmBox')
    if(box.length > 0) return ''
    return `
    <div class="confirmBox" >
        Are you sure about that?
        <div id="button1" class="ui ${type1} button">${text1}</div>
        <div id="button2" class="ui ${type2} button">${text2}</div>
    </div >`
}

function reviewTemplate() {
    return `
    <div class="newReview">
        <form class="reviewForm">
            <label for="title">Title:</label>
            <input id="Title" required maxlength="50">
            <label for="rating">Rating:</label>
            <div id="rating" class="ui rating" data-max-rating="5"></div>
            <label for="text">What's the scoop?</label>
            <textarea id="text" required maxlength="255"></textarea>
            <div id="submit" class="ui positive button">submit</div>
        </form>
    </div>`
}

function modalHTML(card) {
    
    return `
   <div class="ui modal" data-id="${card.id}" >
        <i class="close icon"></i>
        <div class="header">${card.name}</div>
        <div class="container">
        <main>
            <div class="image content">
                <div class="ui medium image">
                    <img src="${card.img}" alt="Image of ${card.name}">
                </div>
                <div class="description">
                    <p>${card.description}</p>
                    
                    <div class="ui vertical animated button" tabindex="0">
                        <div class="visible content">$${card.price}</div>
                        <div class="hidden content">
                            <i class="shop icon"></i>
                        </div>
                    </div>

                </div>
            </div>
        </main>
        <aside>
        <h3>Comments</h3>
        <div class="commentsContainer">Be the first to review ${card.name}!</div>
        </aside>
    </div>
        
            <div class="bottom">
                   
                    <div id="create" class="ui positive right labeled icon button">
                        add a review
                        <i class="plus circle icon"></i>
                    </div>
                
            </div>
        </div>`
}

function customizeReview(review) {
    let deleteEdit = ''
    const userId = document.querySelector('body').getAttribute('data-id')
    if (review.user_id == userId) deleteEdit = '<i class="edit icon"></i> <i class="trash alternate icon"></i>'
    let img = review.img
    if (!review.img) img = `<p>${review.first_name[0]}</p>`
    return { deleteEdit, img }
}

function reviewHTML(review) {
    const { deleteEdit, img } = customizeReview(review)
    const stars = createStars(review.rating)
    console.log(review.rating)
    return `
    
    <div class="review" data-id="${review.id}">
        <div class="profPic">${img}</div>

        <div class="reviewContent">
            <h3>${review.title}</h3>
            <div class="ui rating" data-rating="${review.rating}" data-max-rating="5"></div>
            <p>${review.text}</p>
            ${deleteEdit}
        </div>
    </div>`
}

function createStars(num){
    const stars = []
    for (let i = 0; i < num; i++) {
        stars.push('<i class="star icon"></i>')
    }
    while (stars.length < 5) {
        stars.push('<i class="star outline icon"></i>')
    }
    return stars.join('')
}

function snackTemplate(snack) {
    let colorClass = false
    if (snack.reviewed) colorClass = 'olive'
    let reviews = '0 reviews'
    if (snack.reviews == 1) reviews = `${snack.reviews} review`
    else if (snack.reviews > 1) reviews = `${snack.reviews} reviews`

    return `
    <div class="${colorClass || ''} fluid card" data-id="${snack.id}">
        <div class="image" style="background-image:url('${snack.img}')">
        </div>

        <div class="content">
            <div class="header">${snack.name}</div>
        </div>

        <div class="extra content">
            <span>
                <i class="comments outline icon"></i>
                ${reviews}
            </span>
        </div>

    </div>`
}

module.exports = {confirmHTML, reviewTemplate, modalHTML, reviewHTML, snackTemplate}