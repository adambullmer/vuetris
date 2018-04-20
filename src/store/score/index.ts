import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { ScoreState } from "./types";
import { RootState } from "@/store/types";
import { Module } from "vuex";

const state: ScoreState = {
    level: 1,
    score: 0,
    lines: 0,
    isStarted: false,
    isEnded: false,
};

const scoreStore: Module<ScoreState, RootState> = { state, getters, actions, mutations };

export default scoreStore;
