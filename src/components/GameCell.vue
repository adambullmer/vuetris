<template>
    <div class="cell" v-bind:class="shapeClass"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, Store } from "vuex";
import { RootState } from "@/store/types";

export default Vue.extend({
    name: "GameCell",
    props: {
        value: Object,
        row: Number,
        column: Number,
    },
    computed: {
        ...mapState({
            layers: ({ boardStore }: RootState) => boardStore.layers,
            gameBoard: ({ boardStore }: RootState) => boardStore.gameBoard,
        }),
        columnBit(): number {
            // tslint:disable-next-line:no-bitwise
            return 1 << this.column;
        },
        shapeClass(): string {
            if (typeof this.value === "object") {
                if (this.value) {
                    return `shape${this.value.name}`;
                }

                return "";
            }

            // tslint:disable-next-line:no-bitwise
            const layerIndex = this.gameBoard[this.row - 1].findIndex((layer: number) => layer & this.columnBit)

            if (layerIndex === -1) {
                return "";
            }

            return `shape${this.layers[layerIndex]}`;
        },
    },
});
</script>

<style lang="scss" scoped>
.cell {
    border: 1px solid black;
    background-color: white;
    flex: 1 1 calc(100% / var(--columns));
}

.shapeTetromino {
    background-color: gray;
}
.shapeI {
    background-color: cyan;
}
.shapeJ{
    background-color: blue;
}
.shapeL{
    background-color: orange;
}
.shapeO{
    background-color: yellow;
}
.shapeS{
    background-color: green;
}
.shapeT{
    background-color: purple;
}
.shapeZ{
    background-color: red;
}
</style>
