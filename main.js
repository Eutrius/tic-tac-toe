const opponentBtns = document.getElementsByClassName("opponent");
const difficultyBtns = document.getElementsByClassName("difficulty");
const markBtns = document.getElementsByClassName("mark");
const modalBtns = document.getElementsByClassName("modal-btn");
const menuLabel = document.getElementById("menu-label");

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

function playAgain(e) {
    if(e.target.id == "play-again") {
        gameManager.resetGame();
        modal.hideModal();
    } else {
        gameManager.endGame();
        modal.hideModal();
        chooseOpponent();
    }
}

function chooseOpponent() {
    menuLabel.textContent = "Choose Your Opponent:";
    showBtns(opponentBtns);
}

function chooseBotDifficulty() {
    menuLabel.textContent = "Set Bot Difficulty:";
    showBtns(difficultyBtns);
}

function chooseMark() {
    menuLabel.textContent = "Choose Your Mark:";
    showBtns(markBtns);
}

function markChosen(e) {
    hideBtns(markBtns);
    let mark = e.target.id
    let player = player(mark);
    if (mark == 'X') {
        bot.setMark('O');
        gameManager.setPlayers(player,bot);
    } else {
        bot.setMark('X')
        gameManager.setPlayers(bot,player);
    }
    gameManager.startGame();
}


function setBotDifficulty(e) {
    hideBtns(difficultyBtns);
    bot.setDifficulty(e.target.id);
    chooseMark();
}

function opponentChosen(e) {
    hideBtns(opponentBtns);
    if (e.target.id == "player") {
        let playerX = player('X');
        let playerO = player('O');
        gameManager.setPlayers(playerX,playerO);
        gameManager.startGame();
        return;
    }
    chooseBotDifficulty();
}

const bot = (() => {

})();

const cell = (id) => {
    let _marked = false;
    let _element = document.createElement("div");
    _element.id = `${id}`;
    _element.className = "cell";

    const getElement = () => {
        return _element;
    }

    const setMarked = (mark) => {
        _marked = true;
        _element.textContent = mark;
    }

    const reset = () => {
        _marked = false;
        _element.textContent = '';
    }

    const isMarked = () => {
        return _marked;
    }
    return {getElement,setMarked,reset,isMarked};
};


const gameBoard = (() => {
    let _boardCells = [];
    let _element = document.getElementById("board");

    for (let i = 0; i < 9; i++) {
        let tempCell = cell(i);
        _boardCells.push(tempCell);
        _element.appendChild(tempCell.getElement());
    }

    const reset = () => {
        for (let cell of _boardCells) {
            cell.reset();
        }
    }

    const markCell = (index, mark) => {
        _boardCells[index].setMarked(mark);
    }

    const isMarkedAt = (index) => {
        return _boardCells[index].isMarked();
    }

    const isFullyMarked = () => {
        for (let cell of _boardCells) {
            if (!cell.isMarked()) return false;
        }
        return true;
    }

    return {reset,markCell,isMarkedAt,isFullyMarked};
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




const player = (mark) => {
    let _markedCells = [];
    let _element = document.getElementById(mark);

    const pushCell = (cellIndex) => {
        _markedCells.push(cellIndex);
    }

    const reset = () => {
        _markedCells = [];
        toWait();
    }

    const toPlay = () => {
        _element.classList.add("playing");
    }

    const toWait = () => {
        _element.classList.remove("playing");
    }

    const isWinner = (winConditions) => {
        for (let combination of winConditions) {
            let winnable = true;
            for (let index of combination) {
                if (!_markedCells.includes(index)) winnable = false;
            }
            if (!winnable) continue;
            return true;
        }
        return false;
    }

    return {mark,pushCell,reset,toPlay,toWait,isWinner};
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

const gameManager = ((gameBoard,modal) => {
    const _winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const _element = document.getElementById("game");
    let _playerX;
    let _playerO;
    let _currPlayer;

    const setPlayers = (x,o) => {
        _playerX = x;
        _playerO = o;
    }

    const startGame = () => {
        _element.style.zIndex = 1;
        _currPlayer = _playerX;
        _currPlayer.toPlay();
    }

    const resetGame = () => {
        gameBoard.reset();
        _playerX.reset();
        _playerO.reset();
        _currPlayer = _playerX;
        _currPlayer.toPlay();
    }

    const endGame = () => {
        resetGame();
        _element.style.zIndex = -1;
    }

    const play = (e) => {
        if (!e.target.classList.contains("cell")) return;

        let index = parseInt(e.target.id);
        if (gameBoard.isMarkedAt(index)) return;

        gameBoard.markCell(index,_currPlayer.mark);
        _currPlayer.pushCell(index);
        if(checkBoard()) return;
        playerChange();
    }

    const playerChange = () => {
        _currPlayer.toWait();
        _currPlayer = _currPlayer == _playerX ? _playerO : _playerX;
        _currPlayer.toPlay();
    }

    const checkBoard = () => {
        if (_currPlayer.isWinner(_winConditions)) {
            modal.showModal();
            modal.display(`Player ${_currPlayer.mark} Won!`);
            return true;
        };
        if (gameBoard.isFullyMarked()) {
            modal.showModal();
            modal.display("It's a Draw!");
            return true;
        }
        return false;
    }
    _element.addEventListener("click", play);
    return {setPlayers,startGame,resetGame,endGame}
})(gameBoard,modal);