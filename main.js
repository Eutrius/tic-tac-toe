

function clicked(e) {
    console.log(e.target.className);
}

function OpponentChosen(e) {
    let opponent = e.target.id;
    if (opponent == "player") {
        gameManager.startGame()
    } 
}

const gameBoard = (() => {
    let boardCells = [];
    let element = document.getElementById("board");

    const init = () => {
        for (let i = 0; i < 9; i++) {
            let tempCell = cell(i);
            boardCells.push(tempCell);
            element.appendChild(tempCell.element);
        }
    }

    const reset = () => {
        for (let cell of boardCells) {
            cell.reset();
        }
    }

    const markCell = (index, mark) => {
        boardCells[index].getMark(mark);
    }

    const isMarked = (index) => {
        return boardCells[index].isMarked();
    }

    const isFull = () => {
        for (let cell of boardCells) {
            if (!cell.isMarked()) return false;
        }
        return true;
    }

    const cell = (id) => {
        let marked = false;
        let element = document.createElement("div");
        element.id = `${id}`;
        element.className = "cell";

        const getMark = (mark) => {
            marked = true;
            element.textContent = mark;
        }

        const reset = () => {
            marked = false;
            element.textContent = '';
        }

        const isMarked = () => {
            return marked;
        }
        return {id,element,getMark,reset,isMarked};
    } 
    



    return {element, init, reset,markCell,isMarked,isFull};
})();




const player = (mark) => {
    let markedCell = [];
    let element = document.getElementById(mark);

    const pushCell = (cellIndex) => {
        markedCell.push(cellIndex);
    }

    const toPlay = () => {
        element.classList.add("playing");
    }

    const toWait = () => {
        element.classList.remove("playing");
    }

    const win = (winCondition) => {
        for (let combination of winCondition) {
            let winnable = true;
            for (let index of combination) {
                if (!markedCell.includes(index)) winnable = false;
            }
            if (!winnable) continue;
            return true;
        }
        return false;
    }

    return {mark,pushCell,toPlay,toWait,win};
}



const gameManager = (() => {
    gameBoard.init();
    const winCondition = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const playerX = player("X");
    const playerO = player("O");

    let currPlayer = playerX;
    playerX.toPlay();

    const play = (e) => {
        if (!e.target.classList.contains("cell")) return;
        let index = parseInt(e.target.id);
        if (gameBoard.isMarked(index)) return;
        gameBoard.markCell(index,currPlayer.mark);
        currPlayer.pushCell(index);
        checkBoard();
        playerChange();
    }

    const playerChange = () => {
        
        if(currPlayer == playerX) {
            currPlayer = playerO;
            playerX.toWait();
            playerO.toPlay();
        } else {
            currPlayer = playerX;
            playerO.toWait();
            playerX.toPlay();
        }
    }

    const checkBoard = () => {
        if (currPlayer.win(winCondition)) {
            playerWon(currPlayer);
        };
        if (gameBoard.isFull()) {
            gameDraw();
        }

    }


    gameBoard.element.addEventListener("click", play);
})();
