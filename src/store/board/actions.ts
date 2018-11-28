import * as mutations from "./mutation_types";
import { Piece, Shape, GameRow, AdvancePieceType, BoardState, KickMap, ShapeMap } from "./types";
import { ActionTree } from "vuex";
import { RootState } from "@/store/types";
import _ from "lodash";

const MAX_BIT = Math.pow(2, 10) - 1;
const PIECE_QUEUE_LENGTH = 3;
const pieceFactory: (shape: Shape, x: number, y: number) => Piece = (shape: Shape, x: number, y: number) =>
    ({ x, y, softDrops: 0, hardDrops: 0, maskPosition: 0, shape });
const clonePiece: (piece: Piece) => Piece =
    ({ x, y, softDrops, hardDrops, maskPosition, shape }) => ({ x, y, softDrops, hardDrops, maskPosition, shape });
const KickKey = (strings: TemplateStringsArray, start: number, direction: number, end: number) =>
    (direction < 0) ? `${end}<-${start}` : `${start}->${end}`;

const defaultKicks: KickMap = {
    "0->1": [[0, 0], [-1, 0], [-1, -1], [0,  2], [-1,  2]],
    "0<-1": [[0, 0], [ 1, 0], [ 1,  1], [0, -2], [ 1, -2]],
    "1->2": [[0, 0], [ 1, 0], [ 1,  1], [0, -2], [ 1, -2]],
    "1<-2": [[0, 0], [-1, 0], [-1, -1], [0,  2], [-1,  2]],
    "2->3": [[0, 0], [ 1, 0], [ 1, -1], [0,  2], [ 1,  2]],
    "2<-3": [[0, 0], [-1, 0], [-1,  1], [0, -2], [-1, -2]],
    "3->0": [[0, 0], [-1, 0], [-1,  1], [0, -2], [-1, -2]],
    "3<-0": [[0, 0], [ 1, 0], [ 1, -1], [0,  2], [ 1,  2]],
};
const shapeIKicks: KickMap = {
    "0->1": [[0, 0], [-2, 0], [ 1, 0], [-2,  1], [ 1, -2]],
    "0<-1": [[0, 0], [ 2, 0], [-1, 0], [ 2, -1], [-1,  2]],
    "1->2": [[0, 0], [-1, 0], [ 2, 0], [-1, -2], [ 2,  1]],
    "1<-2": [[0, 0], [ 1, 0], [-2, 0], [ 1,  2], [-2, -1]],
    "2->3": [[0, 0], [ 2, 0], [-1, 0], [ 2, -1], [-1, -2]],
    "2<-3": [[0, 0], [-2, 0], [ 1, 0], [-2,  1], [ 1,  2]],
    "3->0": [[0, 0], [ 1, 0], [-2, 0], [ 1,  2], [-2,  1]],
    "3<-0": [[0, 0], [-1, 0], [ 2, 0], [-2, -2], [ 2, -1]],
};
const shapeOKicks: KickMap = {
    "0->1": [[0, 0]],
    "1->2": [[0, 0]],
    "2->3": [[0, 0]],
    "3->0": [[0, 0]],
    "0<-1": [[0, 0]],
    "1<-2": [[0, 0]],
    "2<-3": [[0, 0]],
    "3<-0": [[0, 0]],
};
const kickMap: ShapeMap<KickMap> = {
    I: shapeIKicks,
    J: defaultKicks,
    L: defaultKicks,
    O: shapeOKicks,
    S: defaultKicks,
    T: defaultKicks,
    Z: defaultKicks,
};

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
            const positiveShifter = Math.abs(shifter);

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

export const actions: ActionTree<BoardState, RootState> = {
    /////////////////
    // Piece Queue //
    /////////////////
    shiftPieces({ commit, state }, nextPiece: Piece) {
        commit(mutations.DEQUEUE_PIECE, nextPiece);
    },
    fillPieceQueue({ commit, state, getters, dispatch }) {
        const x = (state.boardColumns - 4) / 2;
        const y = 0;
        const newQueue: Piece[] = [];
        for (let i = state.pieceQueue.length; i < PIECE_QUEUE_LENGTH; i++) {
            newQueue.push(pieceFactory(getters.randomShape(), x, y));
        }
        commit(mutations.FILL_PIECE_QUEUE, newQueue);
    },
    flushPieceQueue({ commit, state }) {
        commit(mutations.FLUSH_PIECE_QUEUE);
    },
    // FIXME: Debouncing feels like a bit of a hack for this being called too much
    // Maybe this can be improved some.
    addPiece: _.debounce(({ commit, dispatch, getters, state }) => {
        const x = (state.boardColumns - 4) / 2;
        const y = 0;

        const nextPiece = state.pieceQueue[0];
        if (nextPiece && !checkNextPosition(state.gameBoard, nextPiece)) {
            dispatch("endGame");
            commit(mutations.SET_PIECE, nextPiece);
            return;
        }

        dispatch("shiftPieces", pieceFactory(getters.randomShape(), x, y));
    }, 10),
    holdPiece({ commit, dispatch, state }) {
        if (state.activePiece === null) {
            return;
        }

        if (state.hasHeld) {
            return;
        }

        const heldPiece = state.holdQueue[0];
        const newHeldPiece = clonePiece(state.activePiece);

        newHeldPiece.x = (state.boardColumns - 4) / 2;
        newHeldPiece.y = 0;

        commit(mutations.HOLD_PIECE, newHeldPiece);

        if (heldPiece === undefined) {
            dispatch("addPiece");
        }
    },
    ////////////////////
    // Piece Movement //
    ////////////////////
    advancePiece({ commit, dispatch }, { isSoft, isHard }: AdvancePieceType = {}) {
        dispatch("translatePiece", { y: 1 });
        commit(mutations.DROP_PIECE, { isSoft, isHard });
    },

    rotatePiece({ commit, state }, direction: number ) {
        if (state.activePiece === null) {
            return;
        }

        let nextPosition = state.activePiece.maskPosition + direction;
        if (nextPosition < 0) {
            nextPosition = state.activePiece.shape.mask.length - 1;
        } else {
            nextPosition = nextPosition % state.activePiece.shape.mask.length;
        }

        const kickKey = KickKey`${state.activePiece.maskPosition}${direction}${nextPosition}`;
        const newPiece = clonePiece(state.activePiece);
        newPiece.maskPosition = nextPosition;

        const kickedPosition = kickMap[newPiece.shape.name][kickKey].find((value) => {
            if (state.activePiece === null) {
                return false;
            }

            newPiece.x = state.activePiece.x + value[0];
            newPiece.y = state.activePiece.y + value[0];
            return checkNextPosition(state.gameBoard, newPiece)
        });

        if (kickedPosition !== undefined) {
            commit(mutations.ROTATE_PIECE, newPiece);
        }
    },

    translatePiece({ dispatch, commit, state }, {x = 0, y = 0}) {
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
    },

    ////////////////////////
    // Board Modification //
    ////////////////////////
    clearBoard({ commit, dispatch, state }) {
        if (state.gameBoard.length === 0) {
            dispatch("fillBoard");

            return;
        }

        commit(mutations.CLEAR_BOARD);
    },

    fillBoard({ commit }) {
        commit(mutations.FILL_BOARD);
    },

    setPiece({ commit, state, dispatch }) {
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
    },

    clearRows({ commit, state, dispatch }) {
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
    },

    /**
     * Gets called for each line that is removed. In the event that multiple lines are
     * removed, this is called multiple times;
     * @param actionContext
     */
    addRows({ commit, state, dispatch }) {
        commit(mutations.ADD_ROWS, 1);
        dispatch("addPiece");
    },
};
