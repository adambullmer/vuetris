import * as mutations from "./mutation_types";
import { Context, Piece, Shape, GameRow, AdvancePieceType } from "./types";

const clonePiece: (piece: Piece) => Piece =
    ({ x, y, softDrops, hardDrops, maskPosition, shape }) => ({ x, y, softDrops, hardDrops, maskPosition, shape });

const newPiece = (shape: Shape, x: number, y: number) => ({ x, y, softDrops: 0, hardDrops: 0, maskPosition: 0, shape });

const MAX_BIT = Math.pow(2, 10) - 1;

/////////////////
// Piece Queue //
/////////////////
export const shiftPieces = ({ commit }: Context, nextPiece: Piece) => {
    commit(mutations.DEQUEUE_PIECE, nextPiece);
};

export const addPiece = ({ commit, dispatch, getters, state }: Context) => {
    const x = (state.boardColumns - 4) / 2;
    const y = 0;

    const nextPiece = clonePiece(state.pieceQueue[0]);
    nextPiece.x = x;
    nextPiece.y = y;

    if (!checkNextPosition(state.gameBoard, nextPiece)) {
        dispatch("endGame");
        commit(mutations.SET_PIECE, nextPiece);
        return;
    }

    dispatch("shiftPieces", newPiece(getters.randomShape(), x, y));
};

////////////////////
// Piece Movement //
////////////////////
export const advancePiece = ({ commit, dispatch }: Context, { isSoft, isHard }: AdvancePieceType = {}) => {
    dispatch("translatePiece", { y: 1 });
    commit(mutations.DROP_PIECE, { isSoft, isHard });
};

export const rotatePiece = ( { commit, state }: Context, direction: number ) => {
    if (state.activePiece === null) {
        return;
    }

    let nextPosition = state.activePiece.maskPosition + direction;

    if (nextPosition < 0) {
        nextPosition = state.activePiece.shape.mask.length - 1;
    } else {
        nextPosition = nextPosition % state.activePiece.shape.mask.length;
    }

    const newPiece = clonePiece(state.activePiece);
    newPiece.maskPosition = nextPosition;

    if (!checkNextPosition(state.gameBoard, newPiece)) {
        return;
    }

    commit(mutations.ROTATE_PIECE, nextPosition);
};

export const translatePiece = async ({ dispatch, commit, state }: Context, {x = 0, y = 0}) => {
    if (state.activePiece === null) {
        return;
    }

    const nextPiece = clonePiece(state.activePiece);
    nextPiece.x += x;
    nextPiece.y += y;

    if (checkNextPosition(state.gameBoard, nextPiece)) {
        commit(mutations.TRANSLATE_PIECE, { x, y });
        return;
    }

    if (y > 0) {
        dispatch("setPiece");
        dispatch("clearRows");
    }
};

////////////////////////
// Board Modification //
////////////////////////
const checkNextPosition: (gameBoard: GameRow[], piece: Piece) => boolean = (gameBoard, piece) => {
    const flatGameBoard: number[] = gameBoard.map(
        // tslint:disable-next-line:no-bitwise
        (row, index) => gameBoard[index].reduce((rowMask, layer) => rowMask | layer, 0),
    );

    let mask = piece.shape.mask[piece.maskPosition];
    // tslint:disable-next-line:no-bitwise
    for (let row = piece.y + 4, rowMask = mask & 15; row > piece.y && mask > 0; row--, mask >>= 4, rowMask = mask & 15) {
        // If there is not piece on this row
        if (rowMask === 0) {
            continue;
        }

        // If the next row does not exist
        if (flatGameBoard[row - 1] === undefined) {
            return false;
        }

        // Translate the piece on the x-axis. negative position requires unshifting bits
        const shifter = (10 - 4) - piece.x;
        if (shifter > 0) {
            // tslint:disable-next-line:no-bitwise
            rowMask <<= shifter;
        } else if (shifter < 0) {
            const originalMask = rowMask;
            const positiveShifter = Math.abs(shifter)

            // tslint:disable-next-line:no-bitwise
            rowMask >>= positiveShifter;

            // Shift bits back to test for bit loss.
            // This happens when trying to go too far to the right
            // tslint:disable-next-line:no-bitwise
            if (rowMask << positiveShifter < originalMask) {
                return false;
            }
        }

        // If there is a collision with the set pieces
        // tslint:disable-next-line:no-bitwise
        if (flatGameBoard[row - 1] & rowMask) {
            return false;
        }

        // If the piece is attempting to move too far to the left
        if (rowMask > MAX_BIT) {
            return false;
        }
    }

    return true;
};

export const setPiece = ({ commit, state, dispatch }: Context) => {
    const { gameBoard, activePiece, layers } = state;

    if (activePiece === null) {
        return;
    }

    const layer = layers.indexOf(activePiece.shape.name);

    const newGameBoard = gameBoard.map((row) => row[layer]);
    let mask = activePiece.shape.mask[activePiece.maskPosition];
    // tslint:disable-next-line:no-bitwise
    for (let row = activePiece.y + 4, rowMask = mask & 15; row > activePiece.y && mask > 0; row--, mask >>= 4, rowMask = mask & 15) {
        if (rowMask === 0) {
            continue;
        }

        if (newGameBoard[row - 1] === undefined) {
            continue;
        }

        // Shift the piece
        const shifter = (10 - 4) - activePiece.x;
        if (shifter > 0) {
            // tslint:disable-next-line:no-bitwise
            rowMask <<= shifter;
        } else if (shifter < 0) {
            // tslint:disable-next-line:no-bitwise
            rowMask >>= Math.abs(shifter);
        }

        // tslint:disable-next-line:no-bitwise
        newGameBoard[row - 1] = newGameBoard[row - 1] | rowMask;
    }

    const { softDrops, hardDrops } = activePiece;

    dispatch("addScore", { softDrops, hardDrops });
    commit(mutations.SET_PIECE, newGameBoard);
};

export const clearRows = ({ commit, state, dispatch }: Context) => {
    const { gameBoard } = state;

    const completedRows: number[] = [];
    for (let row = 0; row < gameBoard.length; row++) {
        // tslint:disable-next-line:no-bitwise
        const mask = gameBoard[row].reduce((rowMask, layer) => rowMask | layer, 0);

        if (mask === MAX_BIT) {
            completedRows.unshift(row);
        }
    }

    if (completedRows.length === 0) {
        dispatch("addPiece");
        return;
    }

    dispatch("completeLines", completedRows.length);
    commit(mutations.REMOVE_ROWS, completedRows);
};

export const addRows = ({ commit, state, dispatch }: Context) => {
    const { gameBoard, boardRows } = state;

    commit(mutations.ADD_ROWS, boardRows - gameBoard.length);
    dispatch("addPiece");
};
