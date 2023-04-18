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
        this.likedTile = tile;
    }

    isEmpty(){
        return !this.linkedTile;
    }
}