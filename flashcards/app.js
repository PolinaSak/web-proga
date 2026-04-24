let decks = {};
let currentDeckName = null;
let deckList = document.getElementById("deckList")
const addNewDeck = document.getElementById("add-deck")
const addDeckBtn = document.getElementById("add-deck");
const addCardButton = document.querySelector("#add-card-button");
const frontInput = document.getElementById("card-front");
const backInput = document.getElementById("card-back");
const errorMessage = document.getElementById("error-message");
const cardsList = document.getElementById("cards-list");
const newGame = document.getElementById("new-all-card-game")
const newUnlearnedGame = document.getElementById("new-nonlearned-game");
const hiMessage = document.getElementById("hi-message")

const rightButton = document.createElement("button")
const leftButton = document.createElement("button")
let currentIndex = 0;
let studyUnlearned = false

// function inputNewDeck(){
//     console.log("dfjb")
//     const input = document.createElement("input");
//     input.classList.add("input-deckname")
//     const save = document.createElement("button");
//     save.textContent = "OK";
    
//     save.onclick = () => {
//         const name = input.value.trim();
//         if (name && !decks[name]) {
//             decks[name] = [];
//             currentDeckName = name;
//             input.remove(); save.remove();
//             renderDeckMenu();
//             renderCards();
//         }
//     };
//     addDeckBtn.after(input, save);
// }

addNewDeck.addEventListener("click", function(){
    const existingInput = document.querySelector(".input-deckname");
    const existingSave = document.querySelector(".saveDeckBtn")

    if (existingInput) {
        existingInput.remove();
        existingSave.remove()
        return;
    }
        


    console.log("dfjb")
    const input = document.createElement("input");
    input.classList.add("input-deckname")
    const save = document.createElement("button");
    save.classList.add("saveDeckBtn")
    save.textContent = "OK";

    save.onclick = () => {
        
        const name = input.value.trim();
        if (name && !decks[name]) {
            decks[name] = [];
            currentDeckName = name;
            if (hiMessage) hiMessage.classList.add("hidden");
            input.remove(); save.remove();
            renderCards();
            renderDeckMenu()

            console.log(decks)
        }
        addDeckBtn.after(deleteBtn)
    };
    addDeckBtn.after(input, save);
    
})

function renderDeckMenu(){
    deckList.innerHTML = ""

//!!--------------------------forEach-------------------------------------------
    Object.keys(decks).forEach(deckName =>{
        const deckContainer = document.createElement("div")
        deckContainer.classList.add("deck-container")

        const btn = document.createElement("button")
        btn.textContent = deckName
        btn.classList.add("deck-button")

        if (deckName===currentDeckName){
            btn.classList.add("current-deck")
        }

        btn.onclick = () => {
            currentDeckName = deckName;
            renderDeckMenu();
            renderCards();
        };

        const deleteBtn = document.createElement("button")
        deleteBtn.classList.add("delete-deck")
        deleteBtn.textContent = "DEL 🗑"

        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            delete decks[deckName];
            if (currentDeckName === deckName) currentDeckName = null;
            renderDeckMenu()
            renderCards()
            if (!currentDeckName) {
                cardsList.innerHTML = "<h3>Create or choose deck for start</h3>";
                return;
            }
        }    
        deckContainer.append(btn, deleteBtn)
        deckList.appendChild(deckContainer);
    })

}


addCardButton.addEventListener("click", function() {
    if (!currentDeckName || !decks[currentDeckName]) {
        errorMessage.textContent = "Create or choose deck first!!";
        return;
    }

    const front = frontInput.value.trim();
    const back = backInput.value.trim();

    errorMessage.textContent = "";
    if(!front || !back){
        errorMessage.textContent = "Please fill in both fields";
        return;
    }

    const currentDeck = decks[currentDeckName];
    const newCard = {front, back, learnedStatus: false};
    currentDeck.push(newCard);
    console.log(currentDeck);
    
    frontInput.value = "";
    backInput.value = "";
    renderCards();
});

function createGameCard(){
    cardsList.innerHTML = "";
    let currentGame = document.createElement("div");
    currentGame.classList.add("current-game")

    rightButton.textContent = '▶'
    leftButton.textContent = '◀'
    
    const cards = studyUnlearned
    ? decks[currentDeckName].filter(card => !card.learnedStatus)
    : decks[currentDeckName];

    if (cards.length === 0) {
        cardsList.innerHTML = "<h3>No cards in this mode</h3>";
        return;
    }

    const gameCard = createCard(cards[currentIndex], currentIndex, false);

    leftButton.disabled = currentIndex <= 0;
    rightButton.disabled = currentIndex >= cards.length - 1;

    cardsList.appendChild(currentGame)
    currentGame.appendChild(leftButton)
    currentGame.appendChild(gameCard)
    currentGame.appendChild(rightButton)
}

newGame.addEventListener("click", function(){
    studyUnlearned = false;
    currentIndex = 0;
    createGameCard()
})

newUnlearnedGame.addEventListener("click", function(){
    studyUnlearned = true;
    currentIndex = 0;
    createGameCard();
});

rightButton.addEventListener("click", function(){
    cardsList.innerHTML = "";
    currentIndex +=1

    createGameCard()

})

leftButton.addEventListener("click", function(){
    cardsList.innerHTML = "";
    currentIndex -=1
    
    createGameCard()

})


function renderCards(){
    cardsList.innerHTML = "";

    if (!currentDeckName) {
        cardsList.innerHTML = "<h3>Create or choose deck for start</h3>";
        return;
    }

    const currentDeck = decks[currentDeckName];
    currentDeck.forEach((item, index) =>{
        const cardEl = createCard(item, index, true);
        cardsList.appendChild(cardEl)
    })
}

function createCard(cardData, index, showDelete){

    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    const textEl = document.createElement("div");
    textEl.classList.add("card-text");
    let isFrontSide = true;
    textEl.textContent = cardData.front;

    cardEl.addEventListener("click", function() {
        isFrontSide = !isFrontSide;
        textEl.textContent = isFrontSide ? cardData.front : cardData.back;
    });

    cardEl.appendChild(textEl);

    if (showDelete) {
        cardEl.classList.add("edit-mode");

        const controls = document.createElement("div")
        controls.classList.add("card-controls");
        controls.onclick = (e) => e.stopPropagation();

        const label = document.createElement("label");
        label.textContent = "Learned: ";
        const learnedCheckbox = document.createElement("input")
        learnedCheckbox.type = 'checkbox'
        learnedCheckbox.checked = cardData.learnedStatus;
        learnedCheckbox.onchange = () => {
            cardData.learnedStatus = learnedCheckbox.checked;
        };
        label.appendChild(learnedCheckbox);


        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete 🗑";
        
        deleteBtn.addEventListener("click", function() {
                decks[currentDeckName].splice(index, 1);
                renderCards();  
        });

        const editBtn = document.createElement("button")
        editBtn.textContent = "Edit ✏️"

        editBtn.addEventListener("click", function(){
            cardEl.innerHTML = "";
            const inputFront = document.createElement("input");
            inputFront.value = cardData.front;

            const inputBack = document.createElement("input");
            inputBack.value = cardData.back;

            const saveBtn = document.createElement("button");
            saveBtn.textContent = "✅";

            saveBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                decks[currentDeckName][index].front = inputFront.value.trim();
                decks[currentDeckName][index].back = inputBack.value.trim();
            
                renderCards();
            });

            cardEl.append(inputFront, inputBack, saveBtn);
        })
        
        controls.append(label, editBtn, deleteBtn);
        cardEl.appendChild(controls);
    }
    else{
        cardEl.classList.add("game-mode");
    }
    
    return (cardEl)
}