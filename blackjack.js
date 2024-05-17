let dealerSum = 0,
    yourSum = 0,
    aceCount = 0,
    start = true,
    hidden,
    hidden2,
    deck,
    wins = parseInt(localStorage.getItem('wins')) || 0,
    losses = parseInt(localStorage.getItem('losses')) || 0,
    ties = parseInt(localStorage.getItem('ties')) || 0,
    blackjacks = parseInt(localStorage.getItem('blackjacks')) || 0;

function updateCounters() {
    document.getElementById("wins").innerText = wins;
    document.getElementById("losses").innerText = losses;
    document.getElementById("blackjacks").innerText = blackjacks;
    localStorage.setItem('wins', wins);
    localStorage.setItem('losses', losses);
    localStorage.setItem('ties', ties);
    localStorage.setItem('blackjacks', blackjacks);
}

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
    aceCount = 0;
    handleCardDealing(false);
}

function endGame() {
    let message;
    if (yourSum > 21) {
        message = "You lose!";
    } else if (dealerSum <= 21 && yourSum < dealerSum) {
        message = "You lose!";
        losses++;

    } else if (dealerSum > 21 || yourSum > dealerSum) {
        message = "You win!";
        wins++;
    } else {
        message = "Tie!";
        ties++;
    }
    updateCounters();
    document.getElementById("results").innerText = message;
    document.getElementById("restart").style.display = "inline";
}

function handleCardDealing(isPlayer) {
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    if (isPlayer) {
        const playerCards = document.getElementById("your-cards");
        dealCard(playerCards, yourSum, true);
    } else {
        if (start) {
            document.getElementById("hidden").src = `./cards/${hidden}.png`;
        } else {
            document.getElementById("hidden2").src = `./cards/${hidden2}.png`;
            dealerSum += getValue(hidden2);
            ///////////////////////////////////////////////////
            if (getValue(hidden2) === 11) {
                aceCount++;
            }

            while (dealerSum > 21 && aceCount > 0) {
                dealerSum -= 10;
                aceCount--;
            }
            ///////////////////////////////////////////////////
            setTimeout(() => {
                document.getElementById("dealer-sum").innerText = dealerSum;
                const revealInterval = setInterval(() => {
                    if (dealerSum < 17) {
                        const dealerCards = document.getElementById("dealer-cards");
                        dealCard(dealerCards, dealerSum, false);
                    } else {
                        clearInterval(revealInterval);
                        endGame();
                    }
                }, 1500);
            }, 1000);
        }
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
                if (yourSum > 21) {
                    losses++;
                    updateCounters();
                }
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
            if (yourSum === 21) {
                blackjacks++;
                updateCounters();
            }
        }
    }, 1500);
}

function startGame() {
    hidden = deck.pop();
    hidden2 = deck.pop();
    dealerSum += getValue(hidden);

    if (getValue(hidden) === 11) {
        aceCount++;
    }

    handleCardDealing(false);

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
    document.getElementById("restart").style.display = "none";
}

function restartGame() {
    dealerSum = 0;
    yourSum = 0;
    aceCount = 0;
    start = true;
    hidden = undefined;
    hidden2 = undefined;

    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("dealer-cards").innerHTML = "";

    const hiddenCard1 = document.createElement("img");
    hiddenCard1.id = "hidden";
    hiddenCard1.src = "./cards/back.png";
    hiddenCard1.draggable = false;
    document.getElementById("dealer-cards").appendChild(hiddenCard1);

    const hiddenCard2 = document.createElement("img");
    hiddenCard2.id = "hidden2";
    hiddenCard2.src = "./cards/back.png";
    hiddenCard2.draggable = false;
    document.getElementById("dealer-cards").appendChild(hiddenCard2);

    document.getElementById("dealer-sum").innerText = "???";
    document.getElementById("your-sum").innerText = "0";
    document.getElementById("results").innerText = "";
    document.getElementById("restart").style.display = "none";

    startGame();
}

window.onload = () => {
    const countersDiv = document.getElementById("counters");
    countersDiv.innerHTML = `
        <span>W: <span id="wins">${wins}</span></span>
        <span>/</span>
        <span>L: <span id="losses">${losses}</span></span>
        <br>
        <span>BlackJack: <span id="blackjacks">${blackjacks}</span></span>
    `;
    buildDeck();
    shuffleDeck();
    startGame();

};

document.addEventListener('DOMNodeInserted', function (event) {
    if (event.target.tagName && event.target.tagName.toLowerCase() === 'img') {
        event.target.setAttribute("draggable", "false");
    }
});
