import { ActionContext } from "vuex";

export type Context = ActionContext<BoardState, {}>;
export type PieceQueue = Piece[];

export interface GameRow {
  id?: string;
  [layer: number]: number;
  readonly forEach: (
    callbackfn: (currentItem: number, currentIndex: number, array: number[]) => void,
  ) => void;
  readonly reduce: (
    callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => number,
    initialValue: number,
  ) => number;
}

export interface BoardState {
  pieceQueue: PieceQueue;
  activePiece: Piece | null;
  holdQueue: PieceQueue;
  hasHeld: boolean;
  boardColumns: number;
  boardRows: number;
  gameBoard: GameRow[];
  shapes: ShapeMap<number[]>;
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

export interface ShapeMap<T> {
  [index: string]: T;
  I: T;
  J: T;
  L: T;
  O: T;
  S: T;
  T: T;
  Z: T;
}
export interface KickMap {
  [index: string]: number[][];
  "0->1": number[][];
  "1->2": number[][];
  "2->3": number[][];
  "3->0": number[][];
  "0<-1": number[][];
  "1<-2": number[][];
  "2<-3": number[][];
  "3<-0": number[][];
}