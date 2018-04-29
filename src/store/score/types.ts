import { ActionContext } from "vuex";

export type Context = ActionContext<ScoreState, {}>;
export interface ScoreState {
    lines: number;
    level: number;
    score: number;
    isStarted: boolean;
    isEnded: boolean;
}

export interface ScoreReasons {
    lines?: number;
    softDrops?: number;
    hardDrops?: number;
}
