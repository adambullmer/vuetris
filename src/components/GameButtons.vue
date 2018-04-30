<template>
  <div id="game_buttons" class="game-buttons">
    <div class="direction-buttons">
      <button @click="upButton" style="grid-area: top; border-bottom: 0;"><font-awesome-icon :icon="['far', 'caret-up']"></font-awesome-icon></button>
      <button @click="leftButton" style="grid-area: left; border-right: 0;"><font-awesome-icon :icon="['far', 'caret-left']"></font-awesome-icon></button>
      <button @click="rightButton" style="grid-area: right; border-left: 0;"><font-awesome-icon :icon="['far', 'caret-right']"></font-awesome-icon></button>
      <button @click="downButton" style="grid-area: bottom; border-top: 0;"><font-awesome-icon :icon="['far', 'caret-down']"></font-awesome-icon></button>
    </div>
    <div class="rotation-buttons">
      <button @click="clockwiseButton"><font-awesome-icon :icon="['far', 'redo-alt']"></font-awesome-icon></button>
      <button @click="counterClockwiseButton"><font-awesome-icon :icon="['far', 'undo-alt']"></font-awesome-icon></button>
    </div>
    <div class="control-buttons">
      <button @click="selectButton">select</button>
      <button @click="startButton">start</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";

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
      function stopEvent() {
        event.stopPropagation();
        event.preventDefault();
      }

      switch (event.keyCode) {
        case keyLeft:
          this.leftButton();
          stopEvent();
          break;
        case keyRight:
          this.rightButton();
          stopEvent();
          break;
        case keyUp:
          this.upButton();
          stopEvent();
          break;
        case keyDown:
          this.downButton();
          stopEvent();
          break;
        case keyShift:
          this.clockwiseButton();
          stopEvent();
          break;
        case keyCtrl:
          this.counterClockwiseButton();
          stopEvent();
          break;
        case keySpace:
          this.pauseGame();
          stopEvent();
          break;
        case keyEscape:
          this.endGame();
          stopEvent();
          break;
      }
    },

    // Translations
    upButton() {
      const params = { isHard: true }
      this.advancePiece(params);
      this.$emit("advancePiece", params);
    },
    downButton() {
      const params = { isSoft: true }
      this.advancePiece(params);
      this.$emit("advancePiece", params);
    },
    leftButton() {
      this.translatePiece({ x: -1 });
    },
    rightButton() {
      this.translatePiece({ x: 1 });
    },

    // Rotations
    clockwiseButton() {
      this.rotatePiece(1);
    },
    counterClockwiseButton() {
      this.rotatePiece(-1);
    },

    // Game Controls
    startButton() {
      this.startGame();
    },
    selectButton() {
      this.endGame();
    },
    hardDropPiece() {
      this.advancePiece({ isHard: true });
    },
  },
  components: { FontAwesomeIcon },
});
</script>

<style lang="scss" scoped>
.game-buttons {
  --button-width: 4rem;
  --button-height: 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, calc(var(--button-height) + 2px));
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
.control-buttons {
  grid-area: 1 / 2 / 2 / 3;

  button {
    width: 6rem;
    border-radius: 2.2rem;
    font-size: 1rem;
  }
}
.rotation-buttons {
  grid-area: 3 / 2 / 4 / 3;

  button {
    border-radius: 50%;
    clip-path: circle(calc(50% + 5px) at center)
  }
}

.rotation-buttons, .control-buttons {
  button:focus {
    outline: none;
    box-shadow: 0 0 5px 2px rgb(59, 153, 252);
  }
}

.direction-buttons {
  grid-area: 1 / 1 / 4 / 2;
  margin: 0 auto;
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
