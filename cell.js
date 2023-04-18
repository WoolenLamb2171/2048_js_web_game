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
        this.linkedTileForMerge = tile;
    }

    hasTileForMerge(){
        return !!this.linkedTileForMerge;
    }

    canAccept(newTile){
        return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
    }

    unlinkTileForMerge(){
        this.linkedTileForMerge = null;
    }

    mergeTiles(){
        console.log("я работаю")
        this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value);
        this.linkedTileForMerge.removeFromDOM();
        this.unlinkTileForMerge();
    }
}