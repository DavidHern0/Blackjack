let dealerSum = 0;
let yourSum = 0;
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
            if (playerSum + 11 <= 21) {
                return 11;
            } else {
                return 1;
            }
        }
        return 10;
    }
    return parseInt(value);
}

/////////////////// BUTTON HIT

function hit() {
    dealCards();
}

/////////////////// BUTTON STAY

function stay() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    setTimeout(function () {
        document.getElementById("hidden").src = "./cards/" + hidden + ".png";
        document.getElementById("dealer-sum").innerText = dealerSum;

        let i = 0;
        let revealInterval = setInterval(function () {
            if (i < 1 || dealerSum < 17) {
                let cardImg = document.createElement("img");
                cardImg.src = "./cards/back.png";
                document.getElementById("dealer-cards").appendChild(cardImg);

                setTimeout(function () {
                    let card = deck.pop();
                    let cardImg = document.createElement("img");
                    cardImg.src = "./cards/" + card + ".png";
                    document.getElementById("dealer-cards").replaceChild(cardImg, document.getElementById("dealer-cards").lastChild);

                    dealerSum += getValue(card, dealerSum);

                    if (dealerSum > 21) {
                        let dealerCards = document.getElementById("dealer-cards").getElementsByTagName("img");
                        let dealerAceCount = countAces(dealerCards);
                        if (dealerAceCount >= 2) {
                            dealerSum -= 10;
                        }
                    }
                    document.getElementById("dealer-sum").innerText = dealerSum;
                }, 1000);
                i++;
            } else {
                clearInterval(revealInterval);

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
        }, 1500);
    }, 1000);
}

function dealCards() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    let playerCards = document.getElementById("your-cards");

    let cardImg = document.createElement("img");
    cardImg.src = "./cards/back.png";
    playerCards.appendChild(cardImg);

    setTimeout(function () {
        let card = deck.pop();
        let cardImg = document.createElement("img");
        cardImg.src = "./cards/" + card + ".png";
        playerCards.replaceChild(cardImg, playerCards.lastChild);

        yourSum += getValue(card, yourSum);

        if (yourSum > 21) {
            let yourCards = document.getElementById("your-cards").getElementsByTagName("img");
            let yourAceCount = countAces(yourCards);
            if (yourAceCount >= 2) {
                yourSum -= 10;
            }
        }
        document.getElementById("your-sum").innerText = yourSum;
        document.getElementById("stay").disabled = false;
        document.getElementById("hit").disabled = yourSum >= 21;
    }, 1000);
    document.getElementById("your-sum").innerText = yourSum;
}

function countAces(cards) {
    let aceCount = 0;
    for (let j = 0; j < cards.length; j++) {
        let cardSrc = cards[j].getAttribute("src");
        if (cardSrc.includes("A")) {
            aceCount++;
        }
    }
    return aceCount;
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

            let cardImg = document.createElement("img");
            cardImg.src = "./cards/back.png";
            playerCards.appendChild(cardImg);

            setTimeout(function () {
                let card = deck.pop();
                let cardImg = document.createElement("img");
                cardImg.src = "./cards/" + card + ".png";
                playerCards.replaceChild(cardImg, playerCards.lastChild);

                yourSum += getValue(card, yourSum);
                document.getElementById("your-sum").innerText = yourSum;
                if (i === 2) {
                    document.getElementById("hit").disabled = false;
                    document.getElementById("stay").disabled = false;
                }
                if (yourSum === 21) {
                    document.getElementById("hit").disabled = true;
                }
            }, 1000);
            i++;
        } else {
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
