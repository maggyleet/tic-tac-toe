
document.addEventListener("DOMContentLoaded", () => {

    //Gameboard Module (IIFE)
    //Holds the 3x3 board as an array
    // Provides functions to update and reset the board

    const GameBoard = (() => {
        let board = ["", "", "", "", "", "", "", "", ""];

        const getBoard = () => board;
        const resetBoard = () => board.fill("");

        const placeMarker = (index, marker) => {
            if (board[index] === "") {
                board[index] = marker;
                return true;
            }
            return false;
        }
        return { getBoard, placeMarker, resetBoard };
    })();

    //Player Factory Function
    //Creates player objects with a name and marker (X or O)

    const Player = (name, marker) => {
        return { name, marker };
    };

    //Game Controller Module (IIFE)
    //Manages turn-taking, checking for a winner, and restarting

    const GameController = (() => {
        let players = [];
        let currentPlayer;
        let gameOver = false;

        const startGame = (player1Name = "Player 1", player2Name = "Player 2") => {
            players = [Player(player1Name, "X"), Player(player2Name, "O")];
            currentPlayer = players[0];
            gameOver = false;
            GameBoard.resetBoard();
            DisplayController.updateBoard();
        }

        const switchTurn = () => {
            currentPlayer = currentPlayer == players[0] ? players[1] : players[0];
        };

        const checkWinner = () => {
            const board = GameBoard.getBoard();
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];

            for (const pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return currentPlayer.name;
                }
            }

            if (!board.includes("")) return "Tie";
            return null;
        };

        //yet to
        const playRound = (index) => {
            if (gameOver || !GameBoard.placeMarker(index, currentPlayer.marker)) return;

            DisplayController.updateBoard();
            let winner = checkWinner();
            if (winner) {
                gameOver = true;
                DisplayController.displayResult(winner);
            }
            else {
                switchTurn();
            }
        };

        return { startGame, playRound };
    })();


    //Display Controller Module (IIFE)
    const DisplayController = (() => {
        const cells = document.querySelectorAll(".cell");
        const resultDisplay = document.querySelector("#result");
        const restartButton = document.querySelector("#restart");

        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => GameController.playRound(index));
        });

        restartButton.addEventListener("click", () => {
            GameController.startGame();
            resultDisplay.textContent = "";
        });

        const updateBoard = () => {
            const board = GameBoard.getBoard();
            cells.forEach((cell, index) => {
                cell.textContent = board[index];
            });
        };

        const displayResult = (winner) => {
            resultDisplay.textContent = winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`;
        };

        return { updateBoard, displayResult };
    })();

    // Start the game when the page loads
    GameController.startGame();
});