import { ActionContext } from "vuex";

export type Context = ActionContext<State, {}>;
export type PieceQueue = Piece[];

export interface GameRow {
  id?: string;
  [layer: number]: number;
  readonly reduce: (
    callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => number,
    initialValue: number,
  ) => number;
}

export interface State {
  pieceQueue: PieceQueue;
  activePiece: Piece | null;
  boardColumns: number;
  boardRows: number;
  gameBoard: GameRow[];
  shapes: { [key: string]: number[]};
  layers: string[];
  isRemovingRows: boolean;
}
export interface Shape {
  name: string;
  mask: number[];
}
export interface Piece {
  x: number;
  y: number;
  softDrops: number;
  hardDrops: number;
  maskPosition: number;
  shape: Shape;
}

export interface AdvancePieceType {
  isSoft?: boolean;
  isHard?: boolean;
}