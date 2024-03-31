const players = [
    {
        name: "Player1",
        age: 12,
        email: "test@email.com",
        title: "The humble",
        color: "#BE3B1F",
        symbol: "❌"
    },
    {
        name: "Player2",
        age: 33,
        email: "test@email.com",
        title: "The humble",
        color: "#2A54FB",
        symbol: "⭕"
    }
];

const playerButtons = document.querySelectorAll(".edit-player");
const squares = document.querySelectorAll(".square");
const startBtn = document.querySelector("#start-btn");
const resultText = document.querySelector("#result-text");
const boardContainer = document.querySelector("#board-container");
let game = null;

class Game {

    constructor(players) {
        this.status = "playing";
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.players = players;
        this.currentIndex = 0;
        this.winner = null;
    }

    play(index, event) {
        if (this.board[index] === '' && this.status === "playing") {
            this.board[index] = this.players[this.currentIndex].symbol;
            event.target.innerHTML = this.players[this.currentIndex].symbol;
            if (this.checkWinner()) {
                this.finish(this.players[this.currentIndex]);
            } else if (this.board.every(cell => cell !== '')) {
                this.finish(null);
            } else {
                this.currentIndex = this.currentIndex === 0 ? 1 : 0;
            }
        }
    }

    finish(winner) {
        game.status = "finished";

        startBtn.disabled = false;
        playerButtons.forEach(btn => {
            btn.disabled = false;
        });

        this.winner = winner;

        if (this.winner !== null) {
            resultText.innerHTML = `${this.winner.name} venceu!`
        } else {
            resultText.innerHTML = "Empate!!"
        }
        resultText.style.display = "block";
        boardContainer.className = "";
    }

    checkWinner() {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let combo of winningCombos) {
            if (this.board[combo[0]] !== '' && this.board[combo[0]] === this.board[combo[1]] && this.board[combo[1]] === this.board[combo[2]]) {
                squares[combo[0]].style.backgroundColor = "#58D68D";
                squares[combo[1]].style.backgroundColor = "#58D68D";
                squares[combo[2]].style.backgroundColor = "#58D68D";
                return true;
            }
        }
        return false;
    }
}


startBtn.addEventListener("click", () => {
    game = new Game(JSON.parse(JSON.stringify(players)));
    playerButtons.forEach(btn => {
        btn.disabled = true;
    });
    startBtn.disabled = true;
    squares.forEach(square => {
        square.style.backgroundColor = null;
        square.innerHTML = "";
    });
    resultText.style.display = "none";
    boardContainer.className = "playing";
});

squares.forEach(square => {
    square.addEventListener("click", event => {
        if (game !== null) {
            const index = event.target.getAttribute("data-index");
            game.play(index, event);
        }
    });
});

// EDIT CARDS ===============================================

const modal = new bootstrap.Modal('#editModal', {});
let currentPlayerIndex = 0;

playerButtons.forEach(button => {
    button.addEventListener("click", onEditButtonClick);
});

function onEditButtonClick(event) {
    currentPlayerIndex = event.target.getAttribute("data-player-index")
    const player = players[currentPlayerIndex];
    document.querySelector("#name").value = player.name;
    document.querySelector("#title").value = player.title;
    document.querySelector("#age").value = player.age;
    document.querySelector("#color").value = player.color;
    document.querySelector("#email").value = player.email;
    modal.show();
}

document.querySelector("#save-btn").addEventListener("click", event => {
    event.preventDefault();
    const player = players[currentPlayerIndex];
    player.name = document.querySelector("#name").value;
    player.title = document.querySelector("#title").value;
    player.age = document.querySelector("#age").value;
    player.color = document.querySelector("#color").value;
    player.email = document.querySelector("#email").value;
    updateCardsInfo();
    modal.hide();
});

function updateCardsInfo() {
    const cards = document.querySelectorAll(".player-card");
    let i = 0;
    for (let card of cards) {
        const nameDisplay = card.querySelector(".display-name");
        nameDisplay.innerHTML = `Nome: ${players[i].name}`;
        nameDisplay.style.color = players[i].color;
        card.querySelector(".display-age").innerHTML = `Nome: ${players[i].age}`;
        card.querySelector(".display-title").innerHTML = `Nome: ${players[i].title}`;
        card.querySelector(".display-email").innerHTML = `Nome: ${players[i].email}`;
        i++;
    }
}

updateCardsInfo();