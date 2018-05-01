<template>
    <div>
        <h1>Vuetris</h1>
        <div id="game_wrapper">
            <aside id="hold_panel">
                <section>
                    <div>Hold:</div>
                    <figure>
                        <tetromino-preview :piece="holdQueue[0]" v-show="isStarted"></tetromino-preview>
                    </figure>
                </section>
            </aside>
            <aside id="score_panel">
                <section id="score_section">
                    <div id="lines">lines: {{ lines }}</div>
                    <div id="level">level: {{ level }}</div>
                    <div id="score">score: {{ score }}</div>
                </section>
            </aside>
            <game-grid ref="mainGame"></game-grid>
            <aside id="queue_panel">
                <section id="piece_preview_section">
                    <div>Next:</div>
                    <figure v-for="(piece, index) in pieceQueue" :key="index">
                        <tetromino-preview :piece="piece" v-show="isStarted"></tetromino-preview>
                    </figure>
                </section>
            </aside>

            <game-buttons @advancePiece="advancePieceHandler" ref="gameButtons"></game-buttons>
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

const isSoft = true;
const isHard = true;

export default Vue.extend({
    name: "Game",
    data(): LocalState {
        return {
            advanceTimer: 0,
        };
    },
    destroyed() {
        this.resetTimer();
    },
    watch: {
        activePiece(newValue) {
            this.resetTimer();
            if (newValue !== null && this.isEnded === false) {
                this.defaultTimer();
            }
        },
        isStarted(newValue) {
            if (newValue === false) {
                this.resetTimer();
            // } else {
            //     this.advanceTimer = window.setInterval(this.advancePiece, this.gameTick);
            }
        },
        isEnded(newValue) {
            if (newValue === true) {
                this.resetTimer();
            }
        },
    },
    methods: {
        ...mapActions(["advancePiece", "restartGame"]),
        resetTimer() {
            window.clearInterval(this.advanceTimer);
        },
        defaultTimer() {
            this.advanceTimer = window.setInterval(this.advancePiece, this.gameTick);
        },
        dropTimer() {
            this.advanceTimer = window.setInterval(this.advancePiece.bind(null, { isHard }), 1000 / 60);
        },
        advancePieceHandler(payload: { isSoft: boolean, isHard: boolean }) {
            this.resetTimer();
            if (payload.isSoft) {
                this.defaultTimer();
            } else if (payload.isHard) {
                this.dropTimer();
            }
        },
    },
    computed: {
        level(): number { return this.$store.state.scoreStore.level; },
        lines(): number { return this.$store.state.scoreStore.lines; },
        score(): number { return this.$store.state.scoreStore.score; },
        pieceQueue(): Piece[] { return this.$store.state.boardStore.pieceQueue; },
        activePiece(): Piece { return this.$store.state.boardStore.activePiece; },
        holdQueue(): Piece[] { return this.$store.state.boardStore.holdQueue; },
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
    --preview-width: 15vw;
    --gameboard-width: 70vw;

    max-width: 100vw;
    margin: 0 auto;
    display: grid;
    grid-template-areas:
        'left1  center right'
        'left2  center right'
        'bottom bottom bottom';
    grid-template-columns: 15vw 70vw 15vw;
}
#hold_panel {
    grid-area: left1;
}
#score_panel {
    grid-area: left2;
}
#queue_panel {
    grid-area: right;
}
#piece_preview_section figure {
    margin: 0;
}

#game_wrapper {
    >>> .game-buttons {
        grid-column-start: 1;
        grid-column-end: 4;
    }
    >>> .gameboard {
        grid-area: center;
    }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
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
