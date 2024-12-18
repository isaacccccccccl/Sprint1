'use strict'




const EMPTY = ''
const MINE = '🧨'
const FLAG = '🚩'


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

var gBoard
var board
var gNegs
var gCountFlagedMines = 0
var gEmptyCell = (gLevel.SIZE ** 2) -gLevel.MINES


// create a 4X4 matrix


function onInitGame() {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
    gEmptyCell = (gLevel.SIZE ** 2) -gLevel.MINES
    console.log(gEmptyCell)
    buildBoard()
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

function buildBoard() {
    gBoard = createGboard(gLevel.SIZE, gLevel.SIZE)
    board = createBoard(gLevel.SIZE, gLevel.SIZE)
}


function onCellClicked(ev, onBtn, i, j) {
    // console.log('ev', ev.button)

    if (ev.button === 2 && board[i][j] !== FLAG && gBoard[i][j].isShown !== true) {
        gBoard[i][j].isShown = true
        board[i][j] = FLAG
        renderCell({ i, j }, FLAG)
        checkGame(i, j)
    } else if (ev.button === 2 && board[i][j] === FLAG) {
        gBoard[i][j].isShown = false
        board[i][j] = gBoard[i][j].minesAroundCount
        renderCell({ i, j }, EMPTY)
        gCountFlagedMines--
    }
    else if (ev.button === 0 && gBoard[i][j].isShown !== true) {
        const cell = board[i][j]
        onBtn.classList.remove('hide')
        findAndShowNegs(i, j)
        checkGame(i, j)
    }

    
    // console.log(gBoard)


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
    console.log(gNegs)
    if (currNegsCount === null) {
        renderCell({ i, j }, MINE)
    } else if (currNegsCount === 0) {
        renderCell({ i, j }, EMPTY)
        minesAroundCount()
    } else {
        renderCell({ i, j }, currNegsCount)
        gEmptyCell--
    }
    gBoard[i][j].isShown = true
}

function minesAroundCount() {

    for (var i = 0; i < gNegs.length; i++) {
        var elcell = document.querySelector(`.cell-${gNegs[i].i}-${gNegs[i].j}`)
        elcell.classList.remove('hide')
        renderCell(gNegs[i], board[gNegs[i].i][gNegs[i].j])
        gBoard[gNegs[i].i][gNegs[i].j].isShown = true
        gEmptyCell--
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


function setGameSize(elBtn) {
    if (elBtn.innerText === 'Expert') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    } else if (elBtn.innerText === 'Medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    }
    onInitGame()
}


function checkGame(i, j) {
    // win all of the flags are mines
    if (board[i][j] === FLAG && gBoard[i][j].isMine === true) {
        // console.log(gCountFlagedMines)
        gCountFlagedMines++
    } 

    console.log('empty' ,gEmptyCell)
    console.log('mine' ,gCountFlagedMines)

    if (gCountFlagedMines === gLevel.MINES && gEmptyCell === gCountFlagedMines++) {
        console.log('victory')
    }


    if (gBoard[i][j].isMine === true && board[i][j] !== FLAG ) {

        console.log('you lose')
    }
}

