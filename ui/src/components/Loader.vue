<template>
  <div class="overlay d-flex">
    <div class="spinner-border">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Loader extends Vue {

}
</script>
<style scoped>
  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background-color: black;
    z-index: 99;
    left: 0;
    top: 0;
  }
  .spinner-border {
    margin: auto;
  }
</style>
