import {Grid} from "./grid.js";
import { Tile } from "./tile.js";

const board = document.querySelector("#board");

const grid = new Grid(board);
grid.getRandomEmptyCell().linkTile(new Tile(board));
grid.getRandomEmptyCell().linkTile(new Tile(board));

const setupInputOnce = () =>{
    window.addEventListener("keydown", handleInput, {once: true});
}

const moveUp = async () =>{
    await slide(grid.cellsGroupedByColumn);
}

const moveDown = async () =>{
    await slide(grid.cellsGroupedByReversedColumn);
}

const moveLeft = async () =>{
    await slide(grid.cellsGroupedByRaw);
}

const moveRight = async () =>{
    await slide(grid.cellsGroupedByReversedRaw);
}

const slideTilesInGroup = (group, promises) =>{
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

        promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

        if(targetCell.isEmpty()){
            targetCell.linkTile(cellWithTile.linkedTile);
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile);
        }

        cellWithTile.unlinkTile();
    }
}

const slide = async (groupedCellsByColumn) =>{
    const promises = [];

    console.log(groupedCellsByColumn);

    groupedCellsByColumn.forEach(group => {
        slideTilesInGroup(group, promises);
    });

    await Promise.all(promises);

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles();
    })
}

const handleInput = async (event) =>{
    console.log(event.key)
    switch (event.key){
        case "ArrowUp":
            await moveUp();
            break;
        case "ArrowDown":
            await moveDown();
            break;
        case "ArrowLeft":
            await moveLeft();
            break;
        case "ArrowRight":
            await moveRight();
            break;
        default:
            setupInputOnce();
            return;
    }

    const newTile = new Tile(board);
    grid.getRandomEmptyCell().linkTile(newTile)

    setupInputOnce();
}

setupInputOnce();