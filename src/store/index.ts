import Vue from "vue";
import Vuex from "vuex";
import boardStore from "@/store/board";
import scoreStore from "@/store/score";

Vue.use(Vuex);

const strict = process.env.NODE_ENV !== "production";
const modules = { boardStore, scoreStore };

export default new Vuex.Store({ strict, modules });
