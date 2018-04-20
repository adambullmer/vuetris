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
  // The content width you use on your website
  --content-width: 125px;

  // The amount of columns
  --columns: 4;
  --rows: 4;

  // This is the calculation for the row height.
  --row-size: calc(
     (var(--content-width) - (var(--gutter) * (var(--columns) - 1))) /
      var(--columns)
  );

  display: grid;

  margin: 0 auto;

  width: 100%;
  max-width: var(--content-width);

  grid-auto-rows: repeat(var(--rows), minmax(30px, 1fr));

  height: calc(var(--content-width) * var(--rows) / var(--columns));
  border: 1px solid black;
}
.row {
  display: grid;
  grid-template-columns: repeat(var(--columns), minmax(30px, 1fr));
}
</style>
