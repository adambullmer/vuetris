import { Shape, BoardState } from "./types";
import { GetterTree } from "vuex";
import { RootState } from "@/store/types";

export const getters: GetterTree<BoardState, RootState> = {
    randomShape(state): () => Shape {
        return () => {
            const keys = Object.keys(state.shapes);
            const randomNumber = Math.floor(Math.random() * Object.keys(keys).length);
            const name = keys[randomNumber];
            const mask = state.shapes[name];

            return { name, mask };
        };
    },
};
