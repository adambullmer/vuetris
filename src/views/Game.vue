<template>
    <div>
        <h1>Vuetris</h1>
        <div id="game_wrapper">
            <game-grid ref="mainGame"></game-grid>

            <aside id="side_panel">
                <section id="piece_preview_section">
                    <div>Next Up:</div>
                    <figure v-for="(piece, index) in pieceQueue" :key="index">
                        <tetromino-preview :piece="piece"></tetromino-preview>
                    </figure>
                </section>
                <section id="score_section">
                    <button @click="addPiece">+ Piece</button>
                    <button @click="startGame">Start</button>
                    <div id="lines">lines: {{ lines }}</div>
                    <div id="level">level: {{ level }}</div>
                    <div id="score">score: {{ score }}</div>
                </section>
            </aside>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";

import GameGrid from "@/components/GameGrid.vue";
import TetrominoPreview from "@/components/TetrominoPreview.vue";
import { ADD_ROWS } from "@/store/board/mutation_types";

const keyLeft = 37;
const keyUp = 38;
const keyRight = 39;
const keyDown = 40;
const keyCtrl = 17;
const keyShift = 16;

export default Vue.extend({
    name: "Game",
    data(): { advanceTimer: number, storeSubscription: any } {
        return {
            advanceTimer: 0,
            storeSubscription: null,
        };
    },
    mounted() {
        window.addEventListener("keyup", this.keypressHandler);
    },
    destroyed() {
        window.removeEventListener("keyup", this.keypressHandler);
        window.clearInterval(this.advanceTimer);
    },
    watch: {
        activePiece(newValue) {
            window.clearInterval(this.advanceTimer);
            if (newValue !== null) {
                this.advanceTimer = window.setInterval(this.advancePiece, this.gameTick);
            }
        },
        isStarted(newValue) {
            if (newValue === false) {
                window.clearInterval(this.advanceTimer);
            // } else {
                // this.advanceTimer = window.setInterval(this.advancePiece, this.gameTick);
            }
        },
        isEnded(newValue) {
            if (newValue === true) {
                window.clearInterval(this.advanceTimer);
            }
            alert(`Game Over! Final Score: ${this.score}`);
        },
    },
    methods: {
        ...mapActions(["addPiece", "rotatePiece", "advancePiece", "translatePiece", "startGame"]),
        keypressHandler(event: KeyboardEvent) {
            switch (event.keyCode) {
                case keyLeft:
                    this.translatePiece({ x: -1 });
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case keyRight:
                    this.translatePiece({ x: 1 });
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case keyUp:
                    window.clearInterval(this.advanceTimer);
                    this.advanceTimer = window.setInterval(this.hardDropPiece, 1);
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case keyDown:
                    window.clearInterval(this.advanceTimer);
                    this.advancePiece({ isSoft: true });
                    this.advanceTimer = window.setInterval(this.advancePiece, this.gameTick);
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case keyShift:
                    this.rotatePiece(1);
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case keyCtrl:
                    this.rotatePiece(-1);
                    event.preventDefault();
                    event.stopPropagation();
                    break;
            }
        },
        hardDropPiece() {
            this.advancePiece({ isHard: true });
        },
    },
    computed: {
        ...mapState({
            level: (state: any) => state.scoreStore.level,
            lines: (state: any) => state.scoreStore.lines,
            score: (state: any) => state.scoreStore.score,
            pieceQueue: (state: any) => state.boardStore.pieceQueue,
            activePiece: (state: any) => state.boardStore.activePiece,
            isRemovingRows: (state: any) => state.boardStore.isRemovingRows,
            isStarted: (state: any) => state.scoreStore.isStarted,
            isEnded: (state: any) => state.scoreStore.isEnded,
        }),
        gameTick(): number {
            return Math.pow(0.8 - ((this.level - 1) * 0.007), this.level - 1) * 1000;
        },
    },
    components: { GameGrid, TetrominoPreview },
});
</script>

<style scoped lang="scss">
#game_wrapper {
    width: 100vw;
    max-width: 660px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 500px 160px;
}
#side_panel {
    padding: 20px;
    text-align: left;
}
#piece_preview_section figure {
    margin-left: 0;
    margin-right: 0;
}
</style>
