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

const canMove = (groupedCells) => {
    return groupedCells.some(group => canMoveInGroup(group));
}

const canMoveUp =() =>{
    console.log("canMoveUp")
    return canMove(grid.cellsGroupedByColumn);
}

const canMoveDown = () => {
    console.log("canMoveDown")
    return canMove(grid.cellsGroupedByReversedColumn);
}

const canMoveRight = () => {
    console.log("canMoveRight")
    return canMove(grid.cellsGroupedByReversedRaw);
}
const canMoveLeft = () => {
    console.log("canMoveLeft")
    return canMove(grid.cellsGroupedByRaw);
}


const handleInput = async (event) =>{
    console.log(event.key)
    switch (event.key){
        case "ArrowUp":
            if(!canMoveUp()){
                setupInputOnce();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if(!canMoveDown()){
                setupInputOnce();
                return;
            }
            await moveDown();
            break;
        case "ArrowLeft":
            if(!canMoveLeft()){
                setupInputOnce();
                return;
            }
            await moveLeft();
            break;
        case "ArrowRight":
            if(!canMoveRight()){
                setupInputOnce();
                return;
            }
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

const canMoveInGroup = (group) =>{
    return group.some((cell, index) =>{
        if(index === 0){
            return false;
        }

        if(cell.isEmpty()){
            return false;
        }

        const targetCell = group[index - 1];
        return targetCell.canAccept(cell.linkedTile);
    });
}