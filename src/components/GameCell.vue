<template>
    <div class="cell" :class="shapeClass"></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "GameCell",
    props: {
        value: Object,
    },
    computed: {
        shapeClass(): string {
            if (this.value) {
                return `shape${this.value.name}`;
            }

            return "";
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
