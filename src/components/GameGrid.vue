<template>
  <transition-group class="gameboard" name="row" @after-leave="addRows" mode="out-in">
    <div class="row" v-for="(gameRow, row) in gameGrid" :key="`${gameRow.id}-row`">
      <game-cell v-for="column in columns" :key="`${column}-cell`" v-model="renderedGrid[row][column - 1]"></game-cell>
    </div>
  </transition-group>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState, MapperForState, mapGetters } from "vuex";
import { RootState } from "../store/types";
import { BoardState } from "../store/board/types";
import { Piece, State } from "@/store/board/types";

import GameCell from "@/components/GameCell.vue";

interface Cell {
  name: string;
}

type CellGrid = Cell[][];

export default Vue.extend({
  name: "GameGrid",
  computed: {
    renderedGrid(): CellGrid {
      const gameGrid: number[][] = this.gameGrid;
      const maskNameMap: string[] = this.maskNameMap;
      const grid: CellGrid = [];

      this.rows

      let bit = 1;
      // build current board without active piece overlay
      for (let rowIndex = 0; rowIndex < gameGrid.length; rowIndex++, bit = 1) {
        const row: Cell[] = [];
        // tslint:disable-next-line:no-bitwise
        for (let columnIndex = this.columns; columnIndex > 0; columnIndex--, bit <<= 1) {
          const cell = { name: "" };
          gameGrid[rowIndex].forEach((rowMask, index) => {
            // tslint:disable-next-line:no-bitwise
            if (bit & rowMask) {
              cell.name = maskNameMap[index];
            }
          });

          row.unshift(cell);
        }
        grid.push(row);
      }

      const piece: Piece = this.piece;
      if (piece === null) {
        return grid;
      }

      const mask = piece.shape.mask[piece.maskPosition];
      bit = 1;

      for (let row = piece.y + 4; row > piece.y; row--) {
        // tslint:disable-next-line:no-bitwise
        for (let column = piece.x + 4; column > piece.x; column--, bit <<= 1) {
          // tslint:disable-next-line:no-bitwise
          if (mask & bit) {
            grid[row - 1][column - 1].name = piece.shape.name;
          }
        }
      }

      return grid;
    },
    ...mapState({
      rows(state: RootState) { return state.boardStore.; },
      columns: ({ boardStore }) => boardStore.boardColumns,
      gameGrid: ({ boardStore }) => boardStore.gameBoard,
      maskNameMap: ({ boardStore }) => Object.keys(boardStore.shapes),
      piece: ({ boardStore }) => boardStore.activePiece,
    }),
  },
  methods: {
    ...mapActions(["addRows"]),
  },
  components: { GameCell },
});
</script>

<style scoped lang="scss">
.gameboard {
  // The content width you use on your website
  --content-width: 400px;
  --gutter: 0;
  // The amount of columns
  --columns: 10;
  --rows: 20;

  // This is the calculation for the row height.
  --row-size: calc(
     (var(--content-width) - (var(--gutter) * (var(--columns) - 1))) /
      var(--columns)
  );

  margin: 0 auto;
  width: 100%;
  max-width: var(--content-width);
  height: calc(var(--content-width) * var(--rows) / var(--columns));
  border: 1px solid black;

  // display: grid;
  // responsive layout, causes rows to strech
  // grid-auto-rows: repeat(var(--rows), minmax(30px, 1fr));
  // Static layout, causes bottom rows to jump up
  // grid-auto-rows: calc(var(--content-width) / var(--columns));
  // height: calc(var(--content-width) * var(--rows) / var(--columns));

  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-flow: column;

  overflow: hidden;
}
.row {
  // display: grid;
  // grid-template-columns: repeat(var(--columns), minmax(30px, 1fr));
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
