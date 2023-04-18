import {Grid} from "./grid.js";
import { Tile } from "./tile.js";

const board = document.querySelector("#board");

const grid = new Grid(board);
grid.getRandomEmptyCell().linkTile(new Tile(board));