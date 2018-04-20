import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import boardStore from "@/store/board";
import scoreStore from "@/store/score";
import { RootState } from "@/store/types";

Vue.use(Vuex);

const strict = process.env.NODE_ENV !== "production";
const modules = { boardStore, scoreStore };
const store: StoreOptions<RootState> = {
    strict,
    modules,
};

export default new Vuex.Store<RootState>(store);
