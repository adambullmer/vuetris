import { BoardState } from "@/store/board/types";
import { ScoreState } from "@/store/score/types";

export interface RootState {
    boardStore: BoardState;
    scoreStore: ScoreState;
}
