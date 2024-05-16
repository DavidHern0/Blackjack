let dealerSum = 0,
    yourSum = 0,
    aceCount = 0,
    start = true,
    hidden,
    deck;

function buildDeck() {
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const types = ["C", "D", "H", "S"];
    deck = [];

    for (let type of types) {
        for (let value of values) {
            deck.push(`${value}-${type}`);
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getValue(card) {
    const value = parseInt(card) || (card[0] === "A" ? 11 : 10);
    return value;
}

function hit() {
    handleCardDealing(true);
}

function stay() {
    handleCardDealing(false);
}

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

function handleCardDealing(isPlayer) {
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    if (isPlayer) {
        const playerCards = document.getElementById("your-cards");
        dealCard(playerCards, yourSum, true);
    } else {
        setTimeout(() => {
            document.getElementById("hidden").src = `./cards/${hidden}.png`;
            document.getElementById("dealer-sum").innerText = dealerSum;
            let i = 0;
            const revealInterval = setInterval(() => {
                if (i < 1 || dealerSum < 17) {
                    const dealerCards = document.getElementById("dealer-cards");
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
    const cardImg = document.createElement("img");
    cardImg.src = "./cards/back.png";
    cardsContainer.appendChild(cardImg);

    setTimeout(() => {
        const card = deck.pop();
        const cardImg = document.createElement("img");
        cardImg.src = `./cards/${card}.png`;
        cardsContainer.replaceChild(cardImg, cardsContainer.lastChild);

        const cardValue = getValue(card);
        sum += cardValue;

        console.log("cardValue"+cardValue)
        console.log("sum"+sum)
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
    const playerCards = document.getElementById("your-cards");
    let i = 0;
    const revealInterval = setInterval(() => {
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
    dealerSum += getValue(hidden);

    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    revealPlayerCards();

    document.getElementById("dealer-sum").innerText = "???";
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    const buttons = document.getElementsByClassName("blackjack_button");
    for (let button of buttons) {
        button.addEventListener("click", blackjack_action);
    }
}

window.onload = () => {
    buildDeck();
    shuffleDeck();
    startGame();
};

document.addEventListener('DOMNodeInserted', function (event) {
    if (event.target.tagName && event.target.tagName.toLowerCase() === 'img') {
        event.target.setAttribute("draggable", "false");
    }
});
