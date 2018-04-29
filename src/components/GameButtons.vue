<template>
  <div id="game_buttons" class="game-buttons">
    <div class="direction-buttons">
      <button @click="" style="grid-area: top; border-bottom: 0;">^</button>
      <button @click="" style="grid-area: left; border-right: 0;">&lt;</button>
      <button @click="" style="grid-area: right; border-left: 0;">&gt;</button>
      <button @click="" style="grid-area: bottom; border-top: 0;">v</button>
    </div>
    <div class="control-buttons">
      <button @click="selectButton">select</button>
      <button @click="startButton">start</button>
    </div>
    <div class="rotation-buttons">
      <button @click="">A</button>
      <button @click="">B</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

const keyLeft = 37;
const keyUp = 38;
const keyRight = 39;
const keyDown = 40;
const keyCtrl = 17;
const keyShift = 16;
const keyEscape = 27;
const keySpace = 32;
const keyEnter = 13;

export default Vue.extend({
  name: "GameButtons",
  mounted() {
    window.addEventListener("keydown", this.keypressHandler);
  },
  destroyed() {
    window.removeEventListener("keydown", this.keypressHandler);
  },
  methods: {
    ...mapActions(["translatePiece", "advancePiece", "rotatePiece", "startGame", "pauseGame", "endGame"]),
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
          event.preventDefault();
          event.stopPropagation();
          break;
        case keyDown:
          this.advancePiece({ isSoft: true });
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
        case keySpace:
          this.pauseGame();
          event.preventDefault();
          event.stopPropagation();
          break;
        case keyEscape:
          this.endGame();
          event.preventDefault();
          event.stopPropagation();
          break;
      }
    },
    startButton() {
      this.startGame();
    },
    selectButton() {
      this.endGame();
    },
    hardDropPiece() {
      this.advancePiece({ isHard: true });
    },
  }
});
</script>

<style lang="scss" scoped>
.game-buttons {
  --button-width: 4rem;
  --button-height: 4rem;
}
button {
  border: 1px solid black;
  background: white;
  border-radius: 0;
  padding: 0;
  line-height: var(--button-height);
  width: var(--button-width);
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;
  font-size: 2rem;
  cursor: pointer;
}
.control-buttons button {
  width: 10rem;
  border-radius: 2.2rem;
}
.rotation-buttons button {
  border-radius: 50%;
  clip-path: circle(calc(50% + 5px) at center)
}

.rotation-buttons, .control-buttons {
  button:focus {
    outline: none;
    box-shadow: 0 0 5px 2px rgb(59, 153, 252);
  }
}

.direction-buttons {
  display: grid;
  grid-auto-columns: repeat(3, var(--button-width));
  grid-auto-rows: repeat(3, var(--button-height));;
  width: calc(var(--button-width) * 3);
  height: calc(var(--button-height) * 3);
  grid-template-areas:
    '.    top    .    '
    'left .      right'
    '.    bottom .    ';
}
.direction-buttons button {
  margin: 0;
}
</style>
