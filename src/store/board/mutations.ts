import Vue from "vue";
import * as mutations from "./mutation_types";
import { State, Piece, GameRow, AdvancePieceType } from "./types";
import { guid } from "@/utils";

export default {
  // [mutations.SET_ACTIVE_PIECE]: (state: State, piece: Shape) => {
  //   Vue.set(state, "activePiece", piece);
  // },
  [mutations.DEQUEUE_PIECE]: (state: State, newPiece: Piece) => {
    state.pieceQueue.push(newPiece);
    const piece = state.pieceQueue.shift();
    Vue.set(state, "activePiece", piece);
  },
  // [mutations.ADD_PIECE]: ({ pieceQueue }: State, piece: Piece) => {
  //   pieceQueue.push(piece);
  // },
  [mutations.ROTATE_PIECE]: ({ activePiece }: State, newPosition: number) => {
    if (activePiece === null) {
      return;
    }

    activePiece.maskPosition = newPosition;
  },
  [mutations.TRANSLATE_PIECE]: ({ activePiece }: State, {x = 0, y = 0}) => {
    if (activePiece === null) {
      return;
    }

    activePiece.x += x;
    activePiece.y += y;
  },
  [mutations.SET_PIECE]: (state: State, gameBoardLayer: number[]) => {
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
  [mutations.REMOVE_ROWS]: ({ gameBoard, shapes, isRemovingRows }: State, rows: number[]) => {
    isRemovingRows = true;

    rows.forEach((row) => {
      gameBoard.splice(row, 1);
    });
  },
  [mutations.ADD_ROWS]: ({ gameBoard, shapes, isRemovingRows }: State, rows: number) => {
    for (let x = 0; x < rows; x++) {
      const row: GameRow = Object.keys(shapes).map(() => 0x0000000000);
      row.id = guid();
      gameBoard.unshift(row);
    }

    isRemovingRows = false;
  },
  [mutations.DROP_PIECE]: ({ activePiece }: State, { isSoft, isHard }: AdvancePieceType) => {
    if (activePiece === null) {
      return;
    }

    if (isHard) {
      activePiece.hardDrops++;
    } else if (isSoft) {
      activePiece.softDrops++;
    }
  },
};
