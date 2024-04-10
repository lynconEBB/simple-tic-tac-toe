const players = [
    {
        name: "Jogador 1",
        age: 12,
        email: "test@email.com",
        title: "O humilde",
        color: "#BE3B1F",
        symbol: "❌"
    },
    {
        name: "Jogador 2",
        age: 33,
        email: "test@email.com",
        title: "O humilde",
        color: "#2A54FB",
        symbol: "⭕"
    }
];

const playerButtons = document.querySelectorAll(".edit-player");
const squares = document.querySelectorAll(".square");
const startBtn = document.querySelector("#start-btn");
const resultText = document.querySelector("#result-text");
const boardContainer = document.querySelector("#board-container");
const resultAlert = document.querySelector("#result-alert");
const editForm = document.querySelector("#edit-form");

let game = null;

class Game {

    constructor(players) {
        this.status = "playing";
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.players = players;
        this.currentIndex = Math.round(Math.random());;
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
            resultAlert.classList.remove("alert-warning");
            resultAlert.classList.add("alert-success");
        } else {
            resultAlert.classList.remove("alert-success");
            resultAlert.classList.add("alert-warning");
            resultText.innerHTML = "Empate!!"
        }
        resultAlert.style.display = "block";
        boardContainer.classList.remove("playing");
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
    resultAlert.style.display = "none";
    boardContainer.classList.add("playing");
});

squares.forEach(square => {
    square.addEventListener("click", event => {
        if (game !== null) {
            const index = event.target.getAttribute("data-index");
            game.play(index, event);
        }
    });
    square.addEventListener("mouseover", event => {
        if (game !== null && game.status !== "finished") {
            event.target.style.backgroundColor = game.players[game.currentIndex].color;
        }
    });
    square.addEventListener("mouseout", event => {
        if (game !== null && game.status !== "finished") {
            event.target.style.backgroundColor = null;
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

editForm.addEventListener("submit", event => {
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

const updateCardsInfo = function() {
    const cards = document.querySelectorAll(".player-card");
    let i = 0;
    for (let card of cards) {
        const nameDisplay = card.querySelector(".display-name");
        nameDisplay.innerHTML = `Nome: ${players[i].name}`;
        nameDisplay.style.color = players[i].color;
        card.querySelector(".display-age").innerHTML = `Idade: ${players[i].age}`;
        card.querySelector(".display-title").innerHTML = `Título: ${players[i].title}`;
        card.querySelector(".display-email").innerHTML = `E-mail: ${players[i].email}`;
        i++;
    }
}

updateCardsInfo();