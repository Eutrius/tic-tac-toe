const opponentBtns = document.getElementsByClassName("opponent");
const difficultyBtns = document.getElementsByClassName("difficulty");
const markBtns = document.getElementsByClassName("mark");
const modalBtns = document.getElementsByClassName("modal-btn");
const menuLabel = document.getElementById("menu-label");

{// Buttons Events
    for (let btn of opponentBtns) {
        btn.addEventListener("click", opponentChosen);
    }

    for (let btn of difficultyBtns) {
        btn.addEventListener("click", setBotDifficulty);
    }

    for (let btn of markBtns) {
        btn.addEventListener("click", markChosen);
    }

    for (let btn of modalBtns) { 
        btn.addEventListener("click", playAgain);
    }
}

function playAgain(e) {
    if(e.target.id == "play-again") {
        gameManager.resetGame();
        gameManager.startGame();
        modal.hideModal();
    } else {
        gameManager.endGame();
        modal.hideModal();
        chooseOpponent();
    }
}

function opponentChosen(e) {
    hideBtns(opponentBtns);
    if (e.target.id == "player") {
        let playerX = player();
        playerX.setMark('X');
        let playerO = player();
        playerO.setMark('O');
        gameManager.setPlayers(playerX,playerO);
        gameManager.vsBot(false);
        gameManager.startGame();
        return;
    }
    gameManager.vsBot(true);
    chooseBotDifficulty();
}

function setBotDifficulty(e) {
    hideBtns(difficultyBtns);
    bot.setDifficulty(e.target.id);
    chooseMark();
}

function markChosen(e) {
    hideBtns(markBtns);
    let mark = e.target.textContent;
    let newPlayer = player();
    newPlayer.setMark(mark);
    if (mark == 'X') {
        bot.setMark('O');
        gameManager.setPlayers(newPlayer,bot);
    } else {
        bot.setMark('X');
        gameManager.setPlayers(bot,newPlayer);
    }
    
    gameManager.startGame();
}

function chooseOpponent() {
    menuLabel.textContent = "Choose Your Opponent:";
    showBtns(opponentBtns);
}

function chooseBotDifficulty() {
    menuLabel.textContent = "Set AI Difficulty:";
    showBtns(difficultyBtns);
}

function chooseMark() {
    menuLabel.textContent = "Choose Your Mark:";
    showBtns(markBtns);
}

function showBtns(arrayOfBtns) {
    for (let btn of arrayOfBtns) {
        btn.classList.remove("hidden");
    }
}

function hideBtns(arrayOfBtns) {
    for (let btn of arrayOfBtns) {
        btn.classList.add("hidden");
    }
}

const gameBoard = (() => {
    let _boardCells = [];
    let _boardState = [];
    let _element = document.getElementById("board");

    for (let i = 0; i < 9; i++) {
        let tempCell = cell(i);
        _boardState.push('');
        _boardCells.push(tempCell);
        _element.appendChild(tempCell.getElement());
    }

    const reset = () => {
        for (let i = 0; i <= _boardState.length -1; i++){
            _boardCells[i].reset();
            _boardState[i] = '';
        }
    }

    const getBoardCells = () => {
        return _boardCells;
    }

    const getBoardState = () => {
        return _boardState;
    }

    const getFreeCells = () => {
        let freeCells = [];
        for (let i = 0; i < _boardState.length; i++){
            if(_boardState[i] == '') {
                freeCells.push(i);
            }
        }
        return freeCells;
    }

    const markCellAt = (index, mark) => {
        _boardState[index] = mark;
        targetCell = _boardCells[index];
        targetCell.updateDisplay(mark);
        
    }

    const isMarkedAt = (index) => {
        if(_boardState[index] != '') return true;
        return false;
    }

    const playerWon = (player,winConditions) => {
        for (let combination of winConditions) {
            let winnable = true;
            for (let index of combination) {
                if (!player.includes(index)) winnable = false;
            }
            if (!winnable) continue;
            return true;
        }
        return false;
    }

    const isGameSet = (winConditions,boardState = _boardState) => {
        let moves = 0;
        let players = {};
        for (let i = 0; i <= 8; i++) {
            if (boardState[i] != '') {
                if(players[boardState[i]]) {
                    players[boardState[i]].push(i);
                } else {
                    players[boardState[i]] = [i];   
                }
                moves++;
            }
        }
        for (let player of Object.entries(players)) {
            if (playerWon(player[1],winConditions)) return player[0];
        }
        return false;
    }

    const isFullyMarked = (boardState = _boardState) => {
        for (let cell of boardState) {
            if (cell == '') return false;
        }
        return true;
    }




    return {
        reset,
        getBoardCells,
        getBoardState,
        getFreeCells,
        markCellAt,
        isGameSet,
        isMarkedAt,
        isFullyMarked};
})();

const modal = (() => {
    _element = document.getElementById("modal");

    const showModal = () => {
        _element.style.display = "grid";
    }

    const hideModal = () => {
        display('');
        _element.style.display = "none";
    }

    const display = (string) => {
        _element.firstElementChild.textContent = string;
    }

    return{showModal,hideModal,display}

})();

const gameManager = (() => {
    const _winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const _element = document.getElementById("game");
    let _playerX;
    let _playerO;
    let _currPlayer;
    let _vsBot = false;

    const setPlayers = (x,o) => {
        _playerX = x;
        _playerO = o;
    }

    const vsBot = (bool) => {
        _vsBot = bool;
    } 

    const startGame = () => {
        _element.style.zIndex = 1;
        _element.addEventListener("click", play);
        _currPlayer = _playerX;
        if (_currPlayer.isBot()) {
            _currPlayer.toPlay(_winConditions);
            return;
        }
        _currPlayer.toPlay();
    }

    const resetGame = () => {
        gameBoard.reset();
        _playerX.reset();
        _playerO.reset();
    }

    const endGame = () => {
        resetGame();
        _playerX = null;
        _playerO = null;
        _currPlayer = null;
        _element.style.zIndex = -1;
    }

    const play = (e) => {
        if (!e.target.classList.contains("cell")) return;
        let index = parseInt(e.target.id);
        if (gameBoard.isMarkedAt(index)) return;

        gameBoard.markCellAt(index,_currPlayer.getMark());
        if(checkBoard()) {
            _element.removeEventListener("click",play);
            return;   
        }
        playerChange();
    }

    const playerChange = () => {
        _currPlayer.toWait();
        _currPlayer = _currPlayer == _playerX ? _playerO : _playerX;
        if(_vsBot && _currPlayer.isBot()) {
            _currPlayer.toPlay(_winConditions);
            return;
        }
        _currPlayer.toPlay();
    }

    const checkBoard = () => {
        let winner = gameBoard.isGameSet(_winConditions);
        if (winner && !_vsBot) {
            modal.showModal();
            modal.display(`Player ${winner} Won!`);
            return true;
        } else if(winner && _vsBot) {
            modal.showModal();
            if (_currPlayer.isBot()) {
                modal.display("You Lost!");
                return true;
            } else {
                modal.display("You Won!");
                return true;
            }
        }
        if (gameBoard.isFullyMarked()) {
            modal.showModal();
            modal.display("It's a Draw!");
            return true;
        }
        return false;
    }

    return {
        setPlayers,
        vsBot,
        play,
        startGame,
        resetGame,
        endGame
    }

})();

const bot = (() => {
    let _difficulty = '';

    const _luck = {
        'easy': 50,
        'normal': 80,
        'hard': 95,
    }

    const proto = player();

    const setDifficulty = (string) => {
        _difficulty = string;
    }

    const toPlay = (winConditions) => {
        proto.toPlay();
        let move;
        if (generateRandom(100) < _luck[_difficulty]) {
            if (gameBoard.getFreeCells().length == 9) {
                move = preMove();
            } else {
            move = bestMove(winConditions);
            }
        }
        if(move == undefined) move = randomMove();
        play(move);
    }

    const isBot = () => {
        return true;
    }

    const play = (index) => {
        gameBoard.getBoardCells()[index].getElement().click();
    }

    const preMove = () => {
        let corners = [0,2,6,8];
        let move = corners[generateRandom(3)];
        return move;
    }

    const generateRandom = (max) => {
        return Math.floor(Math.random() * max + 1);
    }

    const randomMove = () => {
        let freeCells = gameBoard.getFreeCells();
        let move = freeCells[generateRandom(freeCells.length -1)];
        return move;
    }

    const bestMove = (winConditions) => {
        let bestScore = -Infinity;
        let move;
        let mark = proto.getMark();
        let enemyMark = proto.getMark() == 'X' ? 'O' : 'X';
        let board = gameBoard.getBoardState();
        for (let i = 0; i <= board.length - 1; i++) {
            if (board[i] == '') {
                board[i] = mark;
                let score = miniMax(mark,enemyMark,0,false,winConditions,board);
                board[i] = '';
                if(score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;        
    }

    const miniMax = (mark,enemyMark,depth,isMaximizing,winConditions,board) => {
        let winner = gameBoard.isGameSet(winConditions,board);
        if (winner) {
            if(winner == mark) {
                return 1;
            } else {
                return -1;
            }
        }
        if(gameBoard.isFullyMarked(board)) return 0;

        if(isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i <= board.length - 1; i++) {
                if (board[i] == '') {
                    board[i] = mark;
                    let score = miniMax(mark,enemyMark,depth + 1,false,winConditions,board);
                    board[i] = '';
                    bestScore = Math.max(score,bestScore);
                    }
                }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i <= board.length - 1; i++) {
                if (board[i] == '') {
                    board[i] = enemyMark;
                    let score = miniMax(mark,enemyMark,depth + 1,true,winConditions,board);
                    board[i] = '';
                    bestScore = Math.min(score,bestScore);
                    }
                }
            return bestScore;
        }
    }


    return Object.assign({},proto,{setDifficulty,toPlay,isBot});
})();

function player(){
    let _mark = '';
    let _element;

    const reset = () => {
        toWait();
    }

    const setMark = (char) => {
        _mark = char;
        _element = document.getElementById(_mark);
    }

    const getMark = () => {
        return _mark;
    }

    const toPlay = () => {
        _element.classList.add("playing");
    }

    const toWait = () => {
        _element.classList.remove("playing");
    }

    const isBot = () => {
        return false;
    }

    return {
        setMark,
        getMark,
        reset,
        toPlay,
        toWait,
        isBot,
    };

}

function cell(id){
    let _element = document.createElement("div");
    _element.id = `${id}`;
    _element.className = "cell";

    const getElement = () => {
        return _element;
    }
    const updateDisplay = (mark) => {
        _element.textContent = mark;
    }

    const reset = () => {
        _element.textContent = '';
    }

    return {
        getElement,
        updateDisplay,
        reset
    };
}
