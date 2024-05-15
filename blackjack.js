let dealerSum = 0;
let yourSum = 0;
let aceCount = 0;
let start = true;
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

function getValue(card, playerSum) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value === "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

/////////////////// BUTTON HIT

function hit() {
    handleCardDealing(true);
}

/////////////////// BUTTON STAY

function stay() {
    handleCardDealing(false);
}

/////////////////// ENDGAME HANDLE

function endGame() {
    let message = "";
    if (yourSum > 21 || dealerSum > 21) {
        message = yourSum > 21 ? "You lose!" : "You win!";
    } else if (yourSum === dealerSum) {
        message = "Tie!";
    } else {
        message = yourSum > dealerSum ? "You win!" : "You lose!";
    }
    document.getElementById("results").innerText = message;
}


/////////////////// INGAME HANDLE

function handleCardDealing(isPlayer) {
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    if (isPlayer) {
        let playerCards = document.getElementById("your-cards");
        dealCard(playerCards, yourSum, true);
    } else {
        setTimeout(function () {
            document.getElementById("hidden").src = "./cards/" + hidden + ".png";
            document.getElementById("dealer-sum").innerText = dealerSum;

            let i = 0;
            let revealInterval = setInterval(function () {
                if (i < 1 || dealerSum < 17) {
                    let dealerCards = document.getElementById("dealer-cards");
                    dealCard(dealerCards, dealerSum, false);
                    i++;
                } else {
                    clearInterval(revealInterval);
                    endGame();
                }
            }, 1500);
        }, 1000);
    }
}

function dealCard(cardsContainer, sum, isPlayer) {
    let cardImg = document.createElement("img");
    cardImg.src = "./cards/back.png";
    cardsContainer.appendChild(cardImg);

    setTimeout(function () {
        let card = deck.pop();
        let cardImg = document.createElement("img");
        cardImg.src = "./cards/" + card + ".png";
        cardsContainer.replaceChild(cardImg, cardsContainer.lastChild);

        let cardValue = getValue(card, sum);

        sum += cardValue;

        if (cardValue === 11) {
            aceCount++;
        }

        while (sum > 21 && aceCount > 0) {
            sum -= 10;
            aceCount--;
        }

        if (isPlayer) {
            yourSum = sum;
            document.getElementById("your-sum").innerText = yourSum;
            if (start) {
                document.getElementById("hit").disabled = true;
                document.getElementById("stay").disabled = true;
            } else {
                document.getElementById("stay").disabled = false;
                document.getElementById("hit").disabled = yourSum >= 21;
            }
        } else {
            dealerSum = sum;
            document.getElementById("dealer-sum").innerText = dealerSum;
        }
    }, 1000);
}

function blackjack_action() {
    if (yourSum >= 21) {
        document.getElementById("hit").disabled = true;
    }
    document.getElementById("your-sum").innerText = yourSum;
}

function revealPlayerCards() {
    let playerCards = document.getElementById("your-cards");
    let i = 0;
    let revealInterval = setInterval(function () {
        if (i < 2) {
            dealCard(playerCards, yourSum, true);
            i++;
        } else {
            start = false;
            document.getElementById("stay").disabled = false;
            document.getElementById("hit").disabled = yourSum >= 21;
            clearInterval(revealInterval);
        }
    }, 1500);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden, dealerSum);

    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    revealPlayerCards();

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
};

document.addEventListener('DOMNodeInserted', function (event) {
    if (event.target.tagName && event.target.tagName.toLowerCase() === 'img') {
        event.target.setAttribute("draggable", "false");
    }
});
