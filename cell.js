export class Cell {
    constructor(gridElement, x, y){
        //Создаём див элемент
        const cell = document.createElement("div");
        //Присваеваем ему класс "cell"
        cell.classList.add("cell");
        //Добавляем наш див элемент с классом "cell" в основной layout
        gridElement.append(cell);
        this.x = x;
        this.y = y;
    }

    linkTile(tile){
        tile.setXY(this.x, this.y);
        this.linkedTile = tile;
    }

    isEmpty(){
        return !this.linkedTile;
    }

    unlinkTile(){
        this.linkedTile = null;
    }

    linkTileForMerge(tile){
        tile.setXY(this.x, this.y);
        this.linkTileForMerge = tile;
    }

    hasTiledForMerge(){
        return !!this.linkedTileForMerge;
    }

    canAccept(newTile){
        return this.isEmpty() || (!this.hasTiledForMerge() && this.linkedTile.value === newTile.value);
    }

    
}