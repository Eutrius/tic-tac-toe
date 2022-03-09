let container = document.getElementById("container");
const chooseOpponent = document.getElementsByClassName("enemies");

chooseOpponent.forEach(element => {
    element.addEventListener("click",OpponentChosen);
});
container.addEventListener("click", clicked);


function clicked(e) {
    console.log(e.target.className);
}

function OpponentChosen(e) {
    let opponent = e.target.id;
    if (opponent == "player") {
        gameManager.startGame()
    } 
}

const gameManager = (() => {


})();


const gameBoard = (() => {
    let boardCells = [];
    let gameBoardDiv = document.getElementById("board");

    const init = () => {
        for (let i = 0; i < 9; i++) {
            cell = generateCell(i);
            boardCells.push(cell);
            gameBoardDiv.appendChild(cell);
        }
    }

    const reset = () => {
        for (let cell of boardCells) {
            cell.textContent = '';
        }
    }
    

    const generateCell = (id) => {
        let tempDiv = document.createElement("div");
        tempDiv.id = `${id}`;
        tempDiv.className = "cell";
        return tempDiv;
    }

    return {boardCells, init, reset};
})();



const player = (mark) => {
    let markedCell = [];
}


gameBoard.init();