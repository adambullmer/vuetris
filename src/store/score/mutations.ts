import * as mutation from "./mutation_types";
import { ScoreState } from "./types";
import { MutationTree } from "vuex";

export const mutations: MutationTree<ScoreState> = {
    [mutation.LEVEL_UP](state) {
        state.level++;
    },
    [mutation.ADD_LINES](state, lines: number) {
        state.lines += lines;
    },
    [mutation.ADD_SCORE](state, points: number) {
        state.score += points;
    },
    [mutation.START_GAME](state) {
        state.isStarted = true;
        state.isEnded = false;
        state.score = 0;
        state.level = 1;
        state.lines = 0;
    },
    [mutation.END_GAME](state) {
        state.isEnded = true;
        state.isStarted = false;
    },
    [mutation.PAUSE_GAME](state) {
        state.isStarted = !state.isStarted;
    },
};
