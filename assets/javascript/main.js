const gameGrid = document.querySelector('#gameGrid')
const countContainer = document.querySelector('#count')
const start = document.querySelector("#start")
const reset = document.querySelector("#reset")

let compteur = 0
const gridSize = 20
let interval

function createGrid(size) {
    const grid = []
    for (let i = 0; i < size; i++) {
        grid[i] = []
        for (let j = 0; j < size; j++) {
            grid[i][j] = 0   // initialiser ttes les cell a 0 (mortes)
        }
    }
    return grid
}

function gridDom(grid) {
    gameGrid.innerHTML = '';
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellContainer = document.createElement('div');
            cellContainer.classList.add('cell');
            if (cell === 1) {
                cellContainer.classList.add('alive');
            }
            gameGrid.appendChild(cellContainer);
        });
    });
}

function updateGrid(grid) {
    compteur++
    countContainer.textContent = compteur
    let newGrid = createGrid(gridSize) //nvelle grille vide pour stocker l'etat suivant
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const neighbors = countNeighbors(grid, i, j) //pr chaque cell on compte ses voisins
            //si la cellule est vivante et si voisins < 2 ou > 3
            if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = 0  // la cell meurt
            } else if (cell === 0 && neighbors === 3) {
                newGrid[i][j] = 1 // la cellule nait
            } else {
                newGrid[i][j] = cell // la cellule garde son état
            }
        })
    })
    return newGrid
}

function addPatterns(grid, pattern, x, y) {
    for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
            if (x + i < gridSize && y + j < gridSize) { // on verifie que la pos est bien dans la limite de la grille
                grid[x + i][y + j] = pattern[i][j] //on copie la valeur du pattern dedans
            }
        }
    }
    gridDom(grid) //MAJ l'affichage
}

function countNeighbors(grid, x, y) {

    let count = 0
    for (let i = -1; i <= 1; i++) { //double boucle de -1 a 1 car seulement cell voisines
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) { //on ne fait rien sur la cell du centre
                continue
            } 
            let line = x + i //calcul de la ligne de la cell voisine en ajoutant le décalage i à la ligne x de la cell actuelle
            let col = y + j 
            if (line >= 0 && line < gridSize && col >= 0 && col < gridSize) [ //si line et col sont dans les limites de la grille
                count += grid[line][col] //ajoute sa val (0 ou 1) au compteur
            ]
        }
    }
    return count
}

const glider = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1]
];

const blinker = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
];

start.addEventListener('click', () => {
    if (!interval) {
        interval = setInterval(() => {
            grid = updateGrid(grid) // MAJ la grille
            gridDom(grid) //afficher la nouvelle grille
        }, 100)
    }
})

reset.addEventListener('click', () => {
    clearInterval(interval) // arrêter la simu
    interval = null
    grid = createGrid(gridSize) // reinitialiser la grille
    addPatterns(grid, glider, 1, 1)
    addPatterns(grid, blinker, 10, 10)
    gridDom(grid)
    compteur = 0
    countContainer.textContent = compteur
})

// Init
let grid = createGrid(gridSize)
addPatterns(grid, glider, 1, 1)
addPatterns(grid, blinker, 10, 10)
gridDom(grid)
