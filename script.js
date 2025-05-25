const Gameboard = (function () {
    let board = [
                '','','',
                '','','',
                '','','',
                ];
    const getBoard = () => board;
    const updateCell = (pos, mark) => {
        if (pos >= 0 && pos < board.length) {
            if (board[pos] === '') {
                board[pos] = mark;
            } else {
                console.log('cell has been marked already');
                return false;
            }
        } else {
            console.log('Invalid index');
            return false;
        }
        return true;
    };
    
    const resetBoard = () => board = Array(board.length).fill('');

    return { getBoard, updateCell, resetBoard };
}) ();

function createPlayer(name, mark) {
    return {
        name: name,
        mark: mark
    }
}

const Controller = (function () {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;

    const startGame = (name1, name2) => {
        player1 = createPlayer(name1 || 'Player 1', 'X');
        player2 = createPlayer(name2 || 'Player 2', 'O');
        currentPlayer = player1;
        gameOver = false;
        Draw.drawBoard(); // optional: draw empty board at game start
    };

    const switchTurns = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        const board = Gameboard.getBoard();

        for (let combination of winConditions) {
            const [a,b,c] = combination;
            if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]){
                return board[a];
            }
        }
        return null;
    };

    const checkTie = () => {
        if (checkWinner()) return false;
        return Gameboard.getBoard().every(cell => cell !== '');
    };

    const playRound = (pos) => { 
        if (gameOver || !player1 || !player2) return;

        const success = Gameboard.updateCell(pos, currentPlayer.mark);
        if (!success) return;

        const winner = checkWinner();
        if (winner) {
            gameOver = true;
            Draw.drawWinner();
            return;
        }

        if (checkTie()) {
            gameOver = true;
            console.log(`It's a tie!`);
            return;
        }

        switchTurns();
    };

    const restartGame = () => { 
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
        Draw.drawBoard();
    };

    return { playRound, restartGame, getCurrentPlayer: () => currentPlayer, startGame };
})();



function listen(tile) {
    Controller.playRound(tile);
    console.log(Gameboard.getBoard())
    console.log(Controller.getCurrentPlayer());
    Draw.drawBoard();
}

const Draw = (function () {
    const drawBoard = () => {
        const grid = document.getElementById("grid");
        board = Gameboard.getBoard();
        for (tile of grid.children){
            if (board[tile.id] === "X"){
                tile.style.color = "#779ECB";
            }else{
                tile.style.color = "#FFDE21"
            }
            tile.innerHTML = board[tile.id];
        }
    }

    const drawStart = (callback) => {
        const grid = document.getElementById('grid');
        grid.style.display = 'none';
        const form = document.createElement('form');
        const div1 = document.createElement('div1');
        const div2 = document.createElement('div2');
        div1.style.display = 'flex';
        div1.style.gap = '10px';
        div1.style.fontWeight = 'bold'; 
        div2.style.display = 'flex';
        div2.style.gap = '10px';
        div2.style.fontWeight = 'bold'; 
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '20px';
        form.style.justifyContent = 'center';
        form.style.alignItems = 'center';
        const input1 = document.createElement('input');
        const label1 = document.createElement('label');
        const input2 = document.createElement('input');
        const label2 = document.createElement('label');
        const button = document.createElement('button');
        button.style.fontWeight = 'bold';
        button.classList.add('start_button');
        button.textContent = 'Start';
        label1.textContent = "Player1: ";
        input1.type = 'text';
        input1.placeholder = 'Enter player 1 name';
        label2.textContent = "Player2: ";
        input2.type = 'text';
        input2.placeholder = 'Enter player 2 name';
        form.appendChild(div1);
        form.appendChild(div2);
        div1.appendChild(label1);
        div1.appendChild(input1);
        div2.appendChild(label2);
        div2.appendChild(input2);
        form.appendChild(button);
        document.getElementsByTagName('section')[0].appendChild(form);

        button.onclick = (e) => {
            e.preventDefault();
            grid.style.display = 'grid';

            form.remove()

            callback(input1.value, input2.value);
        }
    }

    const drawWinner = () => {
        const currentPlayer = Controller.getCurrentPlayer();
        winMessage = document.createElement('p');
        resetButton = document.createElement('button');
        resetButton.textContent = "Reset game";
        resetButton.classList.add('resetButton');
        winMessage.classList.add('winMessage');
        winMessage.textContent = currentPlayer.name + " wins!";
        resetButton.onclick = () => {
            Controller.restartGame();
            Draw.drawBoard(); 
            winMessage.remove();
            resetButton.remove();
        };
        document.getElementsByTagName('section')[0].appendChild(winMessage);
        document.getElementsByTagName('section')[0].appendChild(resetButton);
    }
    return { drawBoard, drawStart, drawWinner }
}) ();

window.onload = () => {
    Draw.drawStart((name1, name2) => {
        Controller.startGame(name1, name2);
    });
};


