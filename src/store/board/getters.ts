import { Shape, State } from "./types";

export const randomShape: (state: State) => () => Shape = (state: State) => () => {
    const keys = Object.keys(state.shapes);
    const randomNumber = Math.floor(Math.random() * Object.keys(keys).length);
    const name = keys[randomNumber];
    const mask = state.shapes[name];

    return { name, mask };
};
