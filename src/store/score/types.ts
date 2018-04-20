import { ActionContext } from "vuex";

export type Context = ActionContext<State, {}>;
export interface State {
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
