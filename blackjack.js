let dealerSum = 0,
    yourSum = 0,
    aceCount = 0,
    start = true,
    hidden,
    hidden2,
    hiddenPlayer,
    deck,
    wins = parseInt(localStorage.getItem('wins')) || 0,
    losses = parseInt(localStorage.getItem('losses')) || 0,
    ties = parseInt(localStorage.getItem('ties')) || 0,
    blackjacks = parseInt(localStorage.getItem('blackjacks')) || 0,
    maxWinStreak = parseInt(localStorage.getItem('maxWinStreak')) || 0,
    winStreak = parseInt(localStorage.getItem('winStreak')) || 0;

function updateCounters() {
    document.getElementById("wins").innerText = wins;
    document.getElementById("losses").innerText = losses;

    showCounter("blackjacks", blackjacks);
    showCounter("maxWinStreak", maxWinStreak, maxWinStreak > 1);
    showCounter("winStreak", winStreak, winStreak > 1);

    localStorage.setItem('wins', wins);
    localStorage.setItem('losses', losses);
    localStorage.setItem('ties', ties);
    localStorage.setItem('blackjacks', blackjacks);
    localStorage.setItem('maxWinStreak', maxWinStreak);
    localStorage.setItem('winStreak', winStreak);
}

function showCounter(counterId, value, condition = true) {
    const counterElement = document.getElementById(counterId);
    const containerElement = document.getElementById(`${counterId}-container`);

    if (condition && value > 0) {
        containerElement.style.display = 'inline';
        counterElement.innerText = value;
    } else {
        containerElement.style.display = 'none';
    }
}

function adjustMargin() {
    if (window.matchMedia('(max-width: 600px)').matches) {
        const yourCards = document.getElementById('your-cards');
        const dealerCards = document.getElementById('dealer-cards');

        const yourCardImgs = yourCards.querySelectorAll('img');
        const dealerCardImgs = dealerCards.querySelectorAll('img');
        if (yourCardImgs.length > 4) {
            yourCardImgs.forEach(function (img) {
                img.style.marginRight = '-75px';
            });
        }

        if (dealerCardImgs.length > 4) {
            dealerCardImgs.forEach(function (img) {
                img.style.marginRight = '-75px';
            });
        }
    } else {
        yourCardImgs.forEach(function (img) {
            img.style.marginRight = '-50px';
        });

        dealerCardImgs.forEach(function (img) {
            img.style.marginRight = '-50px';
        });
    }
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
        winStreak = 0;
    } else if (dealerSum > 21 || yourSum > dealerSum) {
        message = "You win!";
        wins++;
        winStreak++;
        if (winStreak > maxWinStreak) {
            maxWinStreak = winStreak;
        }
    } else {
        message = "Tie!";
        ties++;
    }
    updateCounters();
    document.getElementById("results").innerText = message;
    document.getElementById("restart").style.visibility = "visible";
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
            if (getValue(hidden) === 11 || getValue(hidden2) === 11) {
                aceCount++;
            }

            while (dealerSum > 21 && aceCount > 0) {
                dealerSum -= 10;
                aceCount--;
            }

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
                }, 1250);
            }, 750);
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
                    winStreak = 0;
                    updateCounters();
                }
            }
        } else {
            adjustMargin();
            dealerSum = sum;
            document.getElementById("dealer-sum").innerText = dealerSum;
        }
    }, 750);
}

function blackjack_action() {
    adjustMargin();
    if (yourSum >= 21) {
        document.getElementById("hit").disabled = true;
    }
    document.getElementById("your-sum").innerText = yourSum;
}

function revealPlayerCards() {
    const playerCards = document.getElementById("your-cards");
    let i = 0;
    const revealInterval = setInterval(() => {
        if (i === 0) {
            document.getElementById("hiddenPlayer").src = `./cards/${hiddenPlayer}.png`;
            const cardValue = getValue(hiddenPlayer);
            yourSum += cardValue;
        } else if (i === 1) {
            dealCard(playerCards, yourSum, true);
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
        blackjack_action();
        i++;
    }, 1250);
}

function startGame() {
    hidden = deck.pop();
    hidden2 = deck.pop();
    hiddenPlayer = deck.pop();
    dealerSum += getValue(hidden);

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
    document.getElementById("restart").style.visibility = "hidden";
}

function restartGame() {
    dealerSum = 0;
    yourSum = 0;
    aceCount = 0;
    start = true;
    hidden = undefined;
    hidden2 = undefined;
    hiddenPlayer = undefined;

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

    const hiddenPlayerCard = document.createElement("img");
    hiddenPlayerCard.id = "hiddenPlayer";
    hiddenPlayerCard.src = "./cards/back.png";
    hiddenPlayerCard.draggable = false;
    document.getElementById("your-cards").appendChild(hiddenPlayerCard);

    document.getElementById("dealer-sum").innerText = "???";
    document.getElementById("your-sum").innerText = "0";
    document.getElementById("results").innerText = "";
    document.getElementById("restart").style.visibility = "hidden";

    startGame();
}

window.onload = () => {
    updateCounters();
    buildDeck();
    shuffleDeck();
    startGame();
};

document.addEventListener('DOMNodeInserted', function (event) {
    if (event.target.tagName && event.target.tagName.toLowerCase() === 'img') {
        event.target.setAttribute("draggable", "false");
    }
});
window.addEventListener('resize', adjustMargin);