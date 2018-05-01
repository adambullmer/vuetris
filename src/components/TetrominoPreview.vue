<template>
  <div class="gameboard">
    <div class="row" v-for="row in rows" v-bind:key="`${row}-row`">
      <game-cell v-for="column in columns" v-bind:key="`${column}-cell`" v-model="gameGrid[row-1][column-1]"></game-cell>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Piece } from "@/store/board/types";

import GameCell from "@/components/GameCell.vue";

interface Cell {
  name: string;
}

type CellGrid = Cell[][];

export default Vue.extend({
  name: "TetrominoPreview",
  props: {
    rows: { type: Number, default: 4 },
    columns: { type: Number, default: 4 },
    piece: Object,
  },
  data(): { gameGrid: CellGrid } {
    const gameGrid: CellGrid = [];
    for (let i = 0; i < this.rows; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < this.columns; j++) {
        row.push({ name: "" });
      }
      gameGrid.push(row);
    }
    return { gameGrid };
  },
  watch: {
    piece(piece: Piece, oldPiece: Piece) {
      if (piece.shape.name === oldPiece.shape.name) {
        return;
      }

      const mask: number = piece.shape.mask[piece.maskPosition];
      let bit: number = 1;
      for (let i = this.rows; i > 0; i--) {
        for (let j = this.columns; j > 0; j--) {
          // tslint:disable-next-line:no-bitwise
          const name = mask & bit ? piece.shape.name : "";
          this.gameGrid[i - 1][j - 1].name = name;
          // tslint:disable-next-line:no-bitwise
          bit = bit << 1;
        }
      }
    },
  },
  components: { GameCell },
});
</script>

<style scoped lang="scss">
.gameboard {
  // The amount of columns
  --columns: 4;
  --rows: 4;

  margin: 0 auto;
  height: 15vw;
  max-height: calc(15vw * var(--rows) / var(--columns));
  width: calc(15vw * var(--columns) / var(--rows));
  max-width: 15vw;
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
</style>
