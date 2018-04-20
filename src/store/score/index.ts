import * as actions from "./actions";
// import * as getters from "./getters";
import mutations from "./mutations";
import { State } from "./types";

const state: State = {
    level: 1,
    score: 0,
    lines: 0,
    isStarted: false,
    isEnded: false,
};

export default { state, actions, mutations };
// export default { state, getters, actions, mutations };
