import Vue from "vue";
import * as mutation from "./mutation_types";
import { BoardState, Piece, GameRow, AdvancePieceType } from "./types";
import { guid } from "@/utils";
import { MutationTree } from "vuex";

export const mutations: MutationTree<BoardState> = {
  // [mutations.SET_ACTIVE_PIECE](state: State, piece: Shape) {
  //   Vue.set(state, "activePiece", piece);
  // },
  [mutation.DEQUEUE_PIECE](state: BoardState, newPiece: Piece) {
    state.pieceQueue.push(newPiece);
    const piece = state.pieceQueue.shift();
    Vue.set(state, "activePiece", piece);
  },
  [mutation.ADD_PIECE]({ pieceQueue }: BoardState, piece: Piece) {
    pieceQueue.push(piece);
  },
  [mutation.ROTATE_PIECE]({ activePiece }: BoardState, newPosition: number) {
    if (activePiece === null) {
      return;
    }

    activePiece.maskPosition = newPosition;
  },
  [mutation.TRANSLATE_PIECE]({ activePiece }: BoardState, {x = 0, y = 0}) {
    if (activePiece === null) {
      return;
    }

    activePiece.x += x;
    activePiece.y += y;
  },
  [mutation.SET_PIECE](state: BoardState, gameBoardLayer: number[]) {
    const { gameBoard, activePiece, shapes } = state;
    if (activePiece === null) {
      return;
    }

    const layerIndex = Object.keys(shapes).indexOf(activePiece.shape.name);

    for (let row = 0; row < gameBoard.length; row++) {
      gameBoard[row][layerIndex] = gameBoardLayer[row];
    }

    Vue.set(state, "activePiece", null);
  },
  [mutation.REMOVE_ROWS]({ gameBoard, shapes, isRemovingRows }: BoardState, rows: number[]) {
    isRemovingRows = true;

    rows.forEach((row) => {
      gameBoard.splice(row, 1);
    });
  },
  [mutation.ADD_ROWS]({ gameBoard, shapes, isRemovingRows }: BoardState, rows: number) {
    for (let x = 0; x < rows; x++) {
      const row: GameRow = Object.keys(shapes).map(() => 0x0000000000);
      row.id = guid();
      gameBoard.unshift(row);
    }

    isRemovingRows = false;
  },
  [mutation.DROP_PIECE]({ activePiece }: BoardState, { isSoft, isHard }: AdvancePieceType) {
    if (activePiece === null) {
      return;
    }

    if (isHard) {
      activePiece.hardDrops++;
    } else if (isSoft) {
      activePiece.softDrops++;
    }
  },
  [mutation.CLEAR_BOARD]({ gameBoard }: BoardState) {
    gameBoard.splice(0, gameBoard.length);
  },
  [mutation.FILL_BOARD]({ boardColumns, boardRows, gameBoard, shapes }: BoardState) {
    for (let i = 0; i < boardRows; i++) {
      const row: GameRow = Object.keys(shapes).map(() => 0x0000000000);
      row.id = guid();
      gameBoard.push(row);
    }
  }
};
