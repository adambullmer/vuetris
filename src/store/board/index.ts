import * as actions from "./actions";
import * as getters from "./getters";
import mutations from "./mutations";
import { State, GameRow } from "./types";
import { guid } from "@/utils";

const shapes = {
  I: [0x0F00, 0x2222, 0x00F0, 0x4444],
  J: [0x8E00, 0x6440, 0x0E20, 0x44C0],
  L: [0x2E00, 0x4460, 0x0E80, 0xC440],
  O: [0x6600, 0x6600, 0x6600, 0x6600],
  S: [0x6C00, 0x4620, 0x06C0, 0x8C40],
  T: [0x4E00, 0x4640, 0x0E40, 0x4C40],
  Z: [0xC600, 0x2640, 0x0C60, 0x4C80],
};
const boardColumns = 10;
const boardRows = 20;
const gameBoard: GameRow[] = [];
for (let i = 0; i < boardRows; i++) {
  const row: GameRow = Object.keys(shapes).map(() => 0x0000000000);
  row.id = guid();
  gameBoard.push(row);
}

const piece = { x: 0, y: 0, softDrops: 0, hardDrops: 0, maskPosition: 0, shape: { name: "Tetromino", mask: [0x0000]} };

const state: State = {
  pieceQueue: [piece, piece, piece],
  activePiece: piece,
  boardColumns,
  boardRows,
  gameBoard,
  shapes,
  layers: Object.keys(shapes),
  isRemovingRows: false,
};

export default { state, getters, actions, mutations };