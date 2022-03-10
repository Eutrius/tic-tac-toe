

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
        console.log(boardCells[index])
    }

    const isMarked = (index) => {
        return boardCells[index].isMarked();
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
    



    return {element, init, reset,markCell,isMarked};
})();




const player = (mark) => {
    let markedCell = [];

    const pushCell = (cellIndex) => {
        markedCell.push(cellIndex);
    }

    return {markedCell,mark,pushCell};
}



const gameManager = (() => {
    gameBoard.init();
    const playerX = player("X");
    const playerO = player("O");

    let currPlayer = playerX;


    const play = (e) => {
        if (!e.target.classList.contains("cell")) return;
        let index = parseInt(e.target.id);
        if (gameBoard.isMarked(index)) return;
        gameBoard.markCell(index,currPlayer.mark);
        currPlayer.pushCell(index);
        console.log(currPlayer.markedCell);
        playerChange();
    }

    const playerChange = () => {
        currPlayer = currPlayer == playerX ? playerO : playerX;
    }


    gameBoard.element.addEventListener("click", play);
})();
