import { GetterTree } from "vuex";
import { RootState } from "@/store/types";
import { ScoreState } from "@/store/score/types";

export const getters: GetterTree<ScoreState, RootState> = {
    score(state) {
        return state.score;
    },
    level(state) {
        return state.level;
    },
    lines(state) {
        return state.lines;
    },
    isStarted(state) {
        return state.isStarted;
    },
    isEnded(state) {
        return state.isEnded;
    },
};
