const dice = document.querySelectorAll(".die");
const rollDice = document.querySelector("#roll-dice");
const scoreButtons = document.querySelectorAll(".score-btn");
const scoreDisplay = document.querySelector("#score");
const lowerScore = document.querySelectorAll(".lowerScore");
const playAgain = document.querySelector("#reset");

let rolledDice = [];
let rollsLeft = 3;
let currentPlayer = 1;

let scores = {
    1: 0,
    2: 0
};

let turnsPlayed = {
    1: 0,
    2: 0
};

function roll() {
    rolledDice = []
    if (rollsLeft <= 3) {
        for (let die of dice) {
            die.disabled = false;
            if (!die.classList.contains("clicked")) {
                die.innerHTML = Math.floor(Math.random() * 6) + 1
            }
        }
        rollsLeft--
        console.log(`rolls left: ${rollsLeft}`)
        checkValues()
    }

    if (rollsLeft === 0) {
        rollDice.disabled = true;
    }

    console.log(rolledDice)
}

for (let die of dice) {
    die.addEventListener("click", (e) => {
        die.classList.toggle("clicked")
    })
}

rollDice.addEventListener("click", roll)

function switchPlayer() {
    if (turnsPlayed[1] + turnsPlayed[2] >= 24) return; 
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.querySelector("#turn-text").innerText = `Player ${currentPlayer}'s Turn`;
}

function updateScoreDisplay() {
    document.querySelector("#score1").innerText = scores[1];
    document.querySelector("#score2").innerText = scores[2];
}

function checkValues() {
    for (let die of dice) {
        rolledDice.push(parseInt(die.innerHTML))
    }
    return rolledDice;
}

function reset() {
    rollsLeft = 3
    rollDice.disabled = false;

    for (let die of dice) {
        die.disabled = true;
        die.innerHTML = "x";
        die.classList.remove("clicked");
    }
}

function checkFinish() {
    let lowerScoreResult = 0;
    if (turnsPlayed[1] + turnsPlayed[2] === 24) {
        for (let score of lowerScore) {
            lowerScoreResult+=parseInt(score.querySelector("button").innerText);
            console.log(lowerScoreResult)
        }
        if (lowerScoreResult >= 63) {
            scores[1]+=35; // Bonus only for player 1, to match original logic
            scores[2]+=35;
            updateScoreDisplay();
        } else {
            updateScoreDisplay();
        }
        
        for (let die of dice) {
            die.disabled = true;
            die.classList.add("endGame")
        }
    }
}

function checkYahtzees() {
    
}

function addScore(value) {

    let count = 0;

    for (let die of dice) {
        const n = parseInt(die.innerHTML);
        if (n === value) {
            count += value;
        }
    }
    scores[currentPlayer]+=count;
    turnsPlayed[currentPlayer]++
    checkFinish()
    reset()
    updateScoreDisplay()
    switchPlayer()
    return count;
}

function ofAKind(n) {

    reset()

    const sorted = rolledDice.sort((a, b) => a - b);

    const reduced = sorted.reduce((a, b) => {
        if (!a[b]) {
            a[b] = 1;
            return a;
        } else {
            a[b]++;
            return a;
        }
    }, {})

    const values = Object.values(reduced)

    const sortedValues = values.sort((a, b) => b - a);

    let result = 0;

    if (sortedValues[0] >= n) {
        for (let value of rolledDice) {
            result+=value
        }
        turnsPlayed[currentPlayer]++
        scores[currentPlayer]+=result
        checkFinish()
        updateScoreDisplay()
        switchPlayer()
        return result;
    }
    turnsPlayed[currentPlayer]++
    updateScoreDisplay()
    switchPlayer()
    return 0;
}

function fullHouse() {

    reset()

    const sorted = rolledDice.sort((a, b) => a - b);

    const reduced = sorted.reduce((a, b) => {
        if (!a[b]) {
            a[b] = 1;
            return a;
        } else {
            a[b]++;
            return a;
        }
    }, {})

    const length = Object.keys(reduced).length;
    turnsPlayed[currentPlayer]++
    let result = length === 2 ? 25 : 0;
    scores[currentPlayer]+=result
    checkFinish()
    updateScoreDisplay()
    switchPlayer()
    return result;
}

function smallStraight() {

    reset()

    const valid = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];

    const sorted = rolledDice.sort((a, b) => a - b);

    for (let array of valid) {
        if (sorted.toString().includes(array.toString())) {
            scores[currentPlayer]+=30
            turnsPlayed[currentPlayer]++
            checkFinish()
            updateScoreDisplay()
            switchPlayer()
            return 30;
        }
    }
    turnsPlayed[currentPlayer]++
    checkFinish()
    updateScoreDisplay()
    switchPlayer()
    return 0;
}

function largeStraight() {

    reset()

    const valid = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];

    const sorted = rolledDice.sort((a, b) => a - b);

    for (let array of valid) {
        if (sorted.toString() === array.toString()) {
            scores[currentPlayer]+=40
            turnsPlayed[currentPlayer]++
            checkFinish()
            updateScoreDisplay()
            switchPlayer()
            return 40;
        }
    }
    turnsPlayed[currentPlayer]++
    checkFinish()
    updateScoreDisplay()
    switchPlayer()
    return 0;
}

function yahtzee() {
    
    reset()

    if (rolledDice.every(x => x === rolledDice[0])) {
        turnsPlayed[currentPlayer]++
        scores[currentPlayer]+=50;
        updateScoreDisplay()
        switchPlayer()
        return 50
    }
    turnsPlayed[currentPlayer]++
    checkFinish()
    updateScoreDisplay()
    switchPlayer()
    return 0;
}

function chance() {

    reset()

    let result = 0;

    for (let value of rolledDice) {
        result += value;
    }
    scores[currentPlayer]+=result;
    turnsPlayed[currentPlayer]++
    checkFinish()
    updateScoreDisplay()
    switchPlayer()
    return result;
}

function turn() {
    if (rollsLeft === 3) {
        for (let die of dice) {
            die.disabled = true;
        }
    }
        for (let button of scoreButtons) {
            button.addEventListener("click", (e) => {
                const value = button.parentElement.previousElementSibling.innerHTML
                console.log(value)
                if (dice[0].innerHTML !== "x") {
                    switch(value) {
                        case "Ones":
                            button.innerHTML = addScore(1)
                            button.disabled = true;
                            break;
                        case "Twos":
                            button.innerHTML = addScore(2)
                            button.disabled = true;
                            break;
                        case "Threes":
                            button.innerHTML = addScore(3)
                            button.disabled = true;
                            break;
                        case "Fours":
                            button.innerHTML = addScore(4)
                            button.disabled = true;
                            break;
                        case "Fives":
                            button.innerHTML = addScore(5)
                            button.disabled = true;
                            break;
                        case "Sixes":
                            button.innerHTML = addScore(6)
                            button.disabled = true;
                            break;
                        case "Three of a kind":
                            button.innerHTML = ofAKind(3)
                            button.disabled = true;
                            break;
                        case "Four of a kind":
                            button.innerHTML = ofAKind(4)
                            button.disabled = true;
                            break;
                        case "Full house":
                            button.innerHTML = fullHouse()
                            button.disabled = true;
                            break;
                        case "Small straight":
                            button.innerHTML = smallStraight()
                            button.disabled = true;
                            break;
                        case "Large straight":
                            button.innerHTML = largeStraight()
                            button.disabled = true;
                            break;
                        case "Yahtzee":
                            button.innerHTML = yahtzee()
                            button.disabled = true;
                            break;
                        case "Chance":
                            button.innerHTML = chance()
                            button.disabled = true;
                            break;
                    }
                }
            })
        }  
    }

playAgain.addEventListener("click", () => {
    location.reload();
});

turn()
