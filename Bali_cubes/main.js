let selectedCards = [];

let totalPlayers = 0;
let winnerIndex = null;

let currentPlayerIndex = 0;
let moveMade = false;

const errorMessage = document.getElementById("error-message");
let rollDiceEl = document.createElement("button");
rollDiceEl.classList.add("rollDice")
rollDiceEl.textContent = "Бросить кубик"
let resultDiceEl = document.querySelector("#resultDice");
let choiseOneEl = document.querySelector("#choiseOne");
let choiseTwoEl = document.querySelector("#choiseTwo");
let cardsEl = document.querySelector("#cards");

function startGame() {
  let count = parseInt(document.getElementById("playerCount").value);

  if (count < 2 || count > 4) {
    errorMessage.textContent = "Можно от 2 до 4 игроков";
    return;
  }
  errorMessage.textContent = ""

  totalPlayers = count;
  players = [];

  for (let i = 0; i < count; i++) {
    players.push({
      name: "Игрок " + (i + 1),
      cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      used: [],
    });
  }

  currentPlayerIndex = 0;
  winnerIndex = null;

  buildLayout();
  renderAllPlayers();
}

function buildLayout() {

  let board = document.getElementById("gameBoard");

  board.innerHTML = `
    <div id="topPlayer" class="player-area horizontal"></div>
    <div class="middle-row">
    <div id="leftPlayer" class="player-area vertical"></div>
    <div id="centerArea"></div>
    <div id="rightPlayer" class="player-area vertical"></div>
    </div>
    <div id="bottomPlayer" class="player-area horizontal"></div>
  `;

  document.getElementById("centerArea").appendChild(resultDiceEl);
  document.getElementById("centerArea").appendChild(rollDiceEl);
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

let firstDice;
let secondDice;

function roll() {
  firstDice = rollDice();
  secondDice = rollDice();
  return [firstDice, secondDice];
}

rollDiceEl.addEventListener("click", onRollDiceClick);

function onRollDiceClick() {
  moveMade = false;
  rollDiceEl.disabled = true;

  const [a, b] = roll();
  let sum = a + b;

  let player = players[currentPlayerIndex];

  let pairPossible = !player.used.includes(a) && !player.used.includes(b);
  let sumPossible = !player.used.includes(sum);

  resultDiceEl.innerHTML = `
    <span class="dice">${a}</span>
    <span class="dice">${b}</span>

    <p>Что вычеркиваем?</p>

    <button id="pairBtn" onclick="removePair(${a}, ${b})" ${
    pairPossible ? "" : "disabled"
  }>
      ${a}, ${b}
    </button>

    <button id="sumBtn" onclick="removeSum(${sum})" ${
    sumPossible ? "" : "disabled"
  }>
      ${sum}
    </button>

    <button onclick="skipTurn()" ${
      pairPossible || sumPossible ? "disabled" : ""
    }>
      Skip
    </button>
  `;
}

// function renderCards() {
//   cardsEl.innerHTML = "";

//   cards.forEach((card) => {
//     const cardEl = document.createElement("div");
//     cardEl.textContent = card;
//     cardEl.classList.add("card");

//     if (selectedCards.includes(card)) {
//       cardEl.classList.add("selected");
//     }

//     cardEl.addEventListener("click", () => choiseCards(card));

//     cardsEl.appendChild(cardEl);
//   });
// }

// function renderCards() {
//   cardsEl.innerHTML = "";

//   let player = players[currentPlayerIndex];

//   for (let i = 0; i < player.cards.length; i++) {
//     let number = player.cards[i];

//     let cardEl = document.createElement("div");
//     cardEl.textContent = number;
//     cardEl.classList.add("card");

//     if (player.used.includes(number)) {
//       cardEl.classList.add("used");
//     }

//     cardsEl.appendChild(cardEl);
//   }
// }

function renderAllPlayers() {

  cardsEl.innerHTML = "";

  for (let i = 0; i < players.length; i++) {

    let block = document.createElement("div");
    block.classList.add("player-block");

    let title = document.createElement("div");
    title.textContent = players[i].name + (i === currentPlayerIndex ? " (ход)" : "");
    title.classList.add("player-title");

    block.appendChild(title);

    let cardsRow = document.createElement("div");
    cardsRow.classList.add("player-cards");

    for (let num of players[i].cards) {
      let card = document.createElement("div");
      card.textContent = num;
      card.classList.add("card");

      if (players[i].used.includes(num)) {
        card.classList.add("used");
      }

      cardsRow.appendChild(card);
    }

    block.appendChild(cardsRow);
    cardsEl.appendChild(block);
  }
}

function renderCards() {
  renderAllPlayers();
}

function removePair(a, b) {
  if (moveMade) return;

  let player = players[currentPlayerIndex];

  if (!player.used.includes(a)) {
    player.used.push(a);
  }

  if (!player.used.includes(b)) {
    player.used.push(b);
  }

  moveMade = true;

  renderCards();
  disableChoiceButtons();
  endTurn();
}

function removeSum(sum) {
  if (moveMade) return;

  let player = players[currentPlayerIndex];

  if (!player.used.includes(sum)) {
    player.used.push(sum);
  }

  moveMade = true;

  renderCards();
  disableChoiceButtons();
  endTurn();
}

function disableChoiceButtons() {
  let buttons = resultDiceEl.querySelectorAll("button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
}

function skipTurn() {
  if (moveMade) return;

  moveMade = true;

  endTurn();
}

function endTurn() {

  if (players[currentPlayerIndex].used.length === 12) {
    errorMessage.textContent = players[currentPlayerIndex].name + " победил!";
    newGame = document.createElement("button")
    newGame.textContent = "Новая игра"
    newGame.addEventListener("click", function(){
      console.log("oo da detka")
      location.reload();
      
    })
    return;
  }

  currentPlayerIndex++;

  if (currentPlayerIndex >= players.length) {
    currentPlayerIndex = 0;
  }

  resultDiceEl.innerHTML = "";
  renderAllPlayers();
  rollDiceEl.disabled = false;
}

function showRestartButton() {
  let container = document.getElementById("restartContainer");

  container.innerHTML = `
    <button onclick="restartGame()">
      Сыграть ещё раз
    </button>
  `;
}

function restartGame() {
  players = [
    {
      name: "Игрок 1",
      cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      used: [],
    },
    {
      name: "Игрок 2",
      cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      used: [],
    },
  ];

  currentPlayerIndex = 0;
  moveMade = false;

  document.getElementById("restartContainer").innerHTML = "";
  resultDiceEl.innerHTML = "";

  renderCards();
}

renderCards();
