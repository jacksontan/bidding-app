<template>
  <div class="card m-3 py-4 col-md-2">
    <img class="card-img-top" :src="'/img/'+item.name+'.png'" alt="Item image" onerror="this.onerror=null;this.src='/img/no_img.png';">
    <div class="card-body">
      <h4 class="card-title">{{ item.name }}</h4>
      <p class="card-text">
        {{ item.description }}
      </p>
      <div class="mb-2"><b>Last Bid Price: $ {{ item.amount }}</b></div>
    </div>
    <div class="card-footer">
      <a href="javascript:void(0)" class="btn btn-primary" :data-id="item.id" @click="bidNow(item)">Bid Now</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ItemCard extends Vue {
  @Prop({ type: Object }) item: any;

  bidNow(item) {
    this.$emit("bidNow", item);
  }
}
</script>
