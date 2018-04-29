<template>
    <div>
        <h1>Vuetris</h1>
        <div id="game_wrapper">
            <game-grid ref="mainGame"></game-grid>

            <aside id="side_panel">
                <section id="piece_preview_section">
                    <div>Next Up:</div>
                    <figure v-for="(piece, index) in pieceQueue" :key="index">
                        <tetromino-preview :piece="piece" v-show="isStarted"></tetromino-preview>
                    </figure>
                </section>
                <section id="score_section">
                    <div id="lines">lines: {{ lines }}</div>
                    <div id="level">level: {{ level }}</div>
                    <div id="score">score: {{ score }}</div>
                </section>
            </aside>
            <game-buttons></game-buttons>
        </div>
        <div class="modal" v-if="isEnded">
            <div class="modal-content">
                <p>Game Over! Final Score: {{ score }}.</p>
                <button @click="restartGame">Retry</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { Piece } from "@/store/board/types";
import GameGrid from "@/components/GameGrid.vue";
import GameButtons from "@/components/GameButtons.vue";
import TetrominoPreview from "@/components/TetrominoPreview.vue";



interface LocalState {
    advanceTimer: number;
}

export default Vue.extend({
    name: "Game",
    data(): LocalState {
        return {
            advanceTimer: 0,
        };
    },
    destroyed() {
        window.clearInterval(this.advanceTimer);
    },
    watch: {
        activePiece(newValue) {
            window.clearInterval(this.advanceTimer);
            if (newValue !== null && this.isEnded === false) {
                this.advanceTimer = window.setInterval(this.advancePiece, this.gameTick);
            }
        },
        isStarted(newValue) {
            if (newValue === false) {
                window.clearInterval(this.advanceTimer);
            // } else {
            //     this.advanceTimer = window.setInterval(this.advancePiece, this.gameTick);
            }
        },
        isEnded(newValue) {
            if (newValue === true) {
                window.clearInterval(this.advanceTimer);
            }
        },
    },
    methods: {
        ...mapActions(["advancePiece", "restartGame"]),
    },
    computed: {
        level(): number { return this.$store.state.scoreStore.level; },
        lines(): number { return this.$store.state.scoreStore.lines; },
        score(): number { return this.$store.state.scoreStore.score; },
        pieceQueue(): Piece[] { return this.$store.state.boardStore.pieceQueue; },
        activePiece(): Piece { return this.$store.state.boardStore.activePiece; },
        isStarted(): boolean { return this.$store.state.scoreStore.isStarted; },
        isEnded(): boolean { return this.$store.state.scoreStore.isEnded; },
        gameTick(): number {
            return Math.pow(0.8 - ((this.level - 1) * 0.007), this.level - 1) * 1000;
        },
    },
    components: { GameGrid, TetrominoPreview, GameButtons },
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
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3);
}
.modal-content {
    position: relative;
    top: calc(50% - 50px);
    margin: 0 auto;
    width: 400px;
    padding: 20px;
    text-align: center;
    background-color:#ffffff;
}
</style>
