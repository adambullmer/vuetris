import * as mutations from "./mutation_types";
import { State } from "./types";

export default {
    [mutations.LEVEL_UP]: (state: State) => {
        state.level++;
    },
    [mutations.ADD_LINES]: (state: State, lines: number) => {
        state.lines += lines;
    },
    [mutations.ADD_SCORE]: (state: State, points: number) => {
        state.score += points;
    },
    [mutations.START_GAME]: (state: State) => {
        state.isStarted = true;
    },
    [mutations.END_GAME]: (state: State) => {
        state.isEnded = true;
        state.isStarted = false;
    },
    [mutations.PAUSE_GAME]: (state: State) => {
        state.isStarted = false;
    },
};
