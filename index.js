import {Grid} from "./grid.js";
import { Tile } from "./tile.js";

const board = document.querySelector("#board");

const grid = new Grid(board);
grid.getRandomEmptyCell().linkTile(new Tile(board));
grid.getRandomEmptyCell().linkTile(new Tile(board));

const setupInputOnce = () =>{
    window.addEventListener("keydown", handleInput, {once: true});
}

const moveUp = () =>{
    slide(grid.cellsGroupedByColumn);
}

const moveDown = () =>{
    slide(grid.cellsGroupedByReversedColumn);
}

const moveLeft = () =>{
    slide(grid.cellsGroupedByRaw);
}

const moveRight = () =>{
    slide(grid.cellsGroupedByReversedRaw);
}

const slideTilesInGroup = group =>{
    for(let i =1; i < group.length; i++){
        if(group[i].isEmpty()){
            continue;
        }

        const cellWithTile = group[i];

        let targetCell;
        let j = i - 1;
        while(j >= 0 && group[j].canAccept(cellWithTile.linkedTile)){
            targetCell = group[j];
            j--;
        }

        if(!targetCell){
            continue;
        }

        if(targetCell.isEmpty()){
            targetCell.linkTile(cellWithTile.linkedTile);
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile);
        }

        cellWithTile.unlinkTile();
    }
}

const slide = (groupedCellsByColumn) =>{
    console.log(groupedCellsByColumn);
    groupedCellsByColumn.forEach(group => {
        slideTilesInGroup(group);
    });
    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles();
    })
}

const handleInput = (event) =>{
    console.log(event.key)
    switch (event.key){
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
        default:
            setupInputOnce();
            return;
    }
    setupInputOnce();
}

setupInputOnce();