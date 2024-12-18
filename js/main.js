'use strict'




const EMPTY = ''
const MINE = '🧨'


// The model 
const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gCell = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true

}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard = createGboard(gLevel.SIZE, gLevel.SIZE)
var board = createBoard(gLevel.SIZE, gLevel.SIZE)
var gNegs

// create a 4X4 matrix


function onInitGame() {

    gBoard[1][1].isMine = gBoard[2][0].isMine = true
    board[1][1] = board[2][0] = MINE

    //random Mines

    // randomMines(gLevel.MINES)
    renderBoard(board)

    findNegs()
    // findAndShowNegs()
    console.table(gBoard)
    console.table(board)
}


function onCellClicked(onBtn, i, j) {
    // console.log(i, j)


    const cell = board[i][j]
    onBtn.classList.remove('hide')
    findAndShowNegs(i, j)

    // renderCell({ i, j }, cell)


}

function findNegs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currNegsCount = countNegs(i, j, gBoard)
            // console.log(currNegsCount)
            if (currNegsCount === null) {
                gBoard[i][j].minesAroundCount = MINE
                board[i][j] = MINE

            } else if (currNegsCount === 0) {
                gBoard[i][j].minesAroundCount = currNegsCount
                board[i][j] = EMPTY

            } else {
                gBoard[i][j].minesAroundCount = currNegsCount
                board[i][j] = currNegsCount

            }
        }
    }
}

function findAndShowNegs(i, j) {
    var currNegsCount = countNegs(i, j, gBoard)
    if (currNegsCount === null) {
        renderCell({ i, j }, MINE)
    } else if (currNegsCount === 0) {
        renderCell({ i, j }, EMPTY)
        minesAroundCount()
    } else {
        renderCell({ i, j }, currNegsCount)
    }
    gBoard[i][j].isShown = true
}

function minesAroundCount() {

    for (var i = 0; i < gNegs.length; i++) {
        var elcell = document.querySelector(`.cell-${gNegs[i].i}-${gNegs[i].j}`)
        elcell.classList.remove('hide')
        renderCell(gNegs[i], board[gNegs[i].i][gNegs[i].j])
        gBoard[gNegs[i].i][gNegs[i].j].isShown = true
    }
}

function randomMines(amount) {

    var allEmptyCells = emptyCells()

    for (var i = 0; i < amount; i++) {
        var randIdx = getRandomInt(0, allEmptyCells.length)
        gBoard[allEmptyCells[randIdx].i][allEmptyCells[randIdx].j].isMine = true
        board[allEmptyCells[randIdx].i][allEmptyCells[randIdx].j] = MINE
        allEmptyCells.splice(randIdx, 1)
    }

}