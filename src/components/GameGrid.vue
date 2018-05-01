<template>
  <transition-group class="gameboard" name="row" @after-leave="addRows" mode="out-in">
    <div class="row" v-for="(gameRow, row) in gameGrid" :key="`${gameRow.id}-row`">
      <game-cell v-for="column in columns" :key="`${column}-cell`" v-model="renderedGrid[row][column - 1]"></game-cell>
    </div>
  </transition-group>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, Store } from "vuex";
import { GameRow } from "../store/board/types";
import { Piece } from "@/store/board/types";

import GameCell from "@/components/GameCell.vue";
import { RootState } from "@/store/types";

interface Cell {
  name: string;
}

type CellGrid = Cell[][];

export default Vue.extend({
  name: "GameGrid",
  computed: {
    renderedGrid(): CellGrid {
      const grid: CellGrid = [];
      let bit = 1;

      // build current board without active piece overlay
      for (let rowIndex = 0; rowIndex < this.gameGrid.length; rowIndex++, bit = 1) {
        const row: Cell[] = [];
        // tslint:disable-next-line:no-bitwise
        for (let columnIndex = this.columns; columnIndex > 0; columnIndex--, bit <<= 1) {
          const cell = { name: "" };

          if (this.isEnded === true) {
            cell.name = "Tetromino";
          } else {
            this.gameGrid[rowIndex].forEach((rowMask, index) => {
                // tslint:disable-next-line:no-bitwise
              if (bit & rowMask) {
                cell.name = this.maskNameMap[index];
              }
            });
          }

          row.unshift(cell);
        }
        grid.push(row);
      }

      if (this.piece === null) {
        return grid;
      }

      const mask = this.piece.shape.mask[this.piece.maskPosition];
      bit = 1;

      for (let row = this.piece.y + 4; row > this.piece.y; row--) {
        // tslint:disable-next-line:no-bitwise
        for (let column = this.piece.x + 4; column > this.piece.x; column--, bit <<= 1) {
          // tslint:disable-next-line:no-bitwise
          if (mask & bit) {
            grid[row - 1][column - 1].name = this.piece.shape.name;
          }
        }
      }

      return grid;
    },
    store(): Store<RootState> { return this.$store; },
    rows(): number { return this.store.state.boardStore.boardRows; },
    columns(): number { return this.store.state.boardStore.boardColumns; },
    gameGrid(): GameRow[] { return this.store.state.boardStore.gameBoard; },
    maskNameMap(): string[] { return Object.keys(this.store.state.boardStore.shapes); },
    piece(): Piece | null { return this.store.state.boardStore.activePiece; },
    isEnded(): boolean { return this.store.state.scoreStore.isEnded; },
  },
  methods: {
    ...mapActions(["addRows"]),
  },
  components: { GameCell },
});
</script>

<style scoped lang="scss">
.gameboard {
  // The amount of columns
  --columns: 10;
  --rows: 20;

  margin: 0 auto;
  height: calc(100vh - 160px);
  max-height: calc(70vw * var(--rows) / var(--columns));
  width: calc((100vh - 160px) * var(--columns) / var(--rows));
  max-width: 70vw;
  border: 1px solid black;

  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-flow: column;

  overflow: hidden;
}
.row {
  display: flex;
  flex: 0 1 calc(100% / var(--rows));
}

.row-appear-active {

}
.row-appear {

}
.row-appear-to {

}

.row-enter-active {

}
.row-enter {

}
.row-enter-to {

}

@keyframes newRowAppear {
  0% {
    display: none;
  }
  100% {
    display: grid;
  }
}

.row-leave-active {
  transition: opacity 1s ease-out;
}
.row-leave {
  opacity: 1;
}
.row-leave-to {
  opacity: 0;
}
</style>
