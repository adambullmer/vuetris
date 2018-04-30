import * as mutations from "./mutation_types";
import { ScoreReasons, ScoreState } from "./types";
import { ActionTree } from "vuex";
import { RootState } from "@/store/types";

export const actions: ActionTree<ScoreState, RootState> = {
    addScore({ commit, state }, modifier: ScoreReasons) {
        const { level } = state;
        let points = 0;

        if (modifier.lines) {
            points += 100 * modifier.lines * level;
        }

        if (modifier.softDrops) {
            points += 1 * modifier.softDrops;
        } else if (modifier.hardDrops) {
            points += 2 * modifier.hardDrops;
        }

        commit(mutations.ADD_SCORE, points);
    },

    completeLines({ commit, state, dispatch }, lines: number) {
        let total = 1;
        switch (lines) {
            case 4:
                total += 3;
                // falls-through
            case 3:
                total += 2;
                // falls-through
            case 2:
                total += 2;
        }

        commit(mutations.ADD_LINES, total);

        // Check if the user has leveled up
        if (Math.floor(state.lines / 10) + 1 > state.level) {
            commit(mutations.LEVEL_UP);
        }

        dispatch("addScore", { lines: total });
    },

    async startGame({ dispatch, commit, state }) {
        await dispatch("clearBoard");
        await dispatch("fillPieceQueue");
        await dispatch("addPiece");

        commit(mutations.START_GAME);
    },

    async restartGame({ dispatch, commit, state }) {
        await dispatch("clearBoard");
        await dispatch("fillPieceQueue");

        commit(mutations.START_GAME);
    },

    endGame({ commit, dispatch }) {
        dispatch("flushPieceQueue");
        commit(mutations.END_GAME);
    },

    pauseGame({ commit }) {
        commit(mutations.PAUSE_GAME);
    },
};
