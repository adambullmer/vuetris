import { BoardState } from "@/store/board/types";
import { State } from "@/store/score/types";

export interface RootState {
    boardStore: BoardState;
    scoreStore: State;
}
