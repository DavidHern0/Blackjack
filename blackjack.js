let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck;

/////////////////// DECK BUILDING

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

/////////////////// CARD VALUES

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

/////////////////// BUTTON HIT

function hit() {
    dealCards("PLAYER");
    if (reduceAce(yourSum, yourAceCount) > 21) {
        document.getElementById("hit").disabled = true;
    }
    document.getElementById("your-sum").innerText = yourSum;
}

/////////////////// BUTTON STAY

function stay() {
    
    while (dealerSum < 17) {
        dealCards("IA");
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    document.getElementById("hidden").src = "./cards/" + hidden + ".png"

    let message = "";
    if (yourSum > 21 || dealerSum > 21) {
        message = yourSum > 21 ? "You lose!" : "You win!";
    } else if (yourSum === dealerSum) {
        message = "Tie!";
    } else {
        message = yourSum > dealerSum ? "You win!" : "You lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("results").innerText = message;

    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
}

/////////////////// DEAL CARDS

function dealCards(player) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    if (player === "IA") {
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    } else {
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
}

function blackjack_action() {
    if (yourSum >= 21) {
        stay();
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    for (let i = 0; i < 2; i++) {
        dealCards("PLAYER");
    }

    
    document.getElementById("dealer-sum").innerText = "???";
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    let buttons = document.getElementsByClassName("blackjack_button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", blackjack_action);
    }
}

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
    if (yourSum === 21) {
        stay();
    }
};
