<template>
  <div class="d-flex flex-column">
    <div class="container d-flex mt-4 col-sm-12 row">
      <Loader v-if="loading"/>
      <ItemCard v-for="item in itemList" :key="item.id" :item="item" @bidNow="bidNow(item)"/>
      <div
        v-if="error"
        class="alert alert-danger"
        role="alert"
      >
        {{ error }}
      </div>
    </div>
    <div class="m-3">
      <paginate
        v-model="page"
        :page-count="pageCount"
        :margin-pages="2"
        :page-range="5"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-class="'page-item'"
        :next-link-class="'page-link'"
        :break-view-class="'break-view'"
        :break-view-link-class="'break-view-link'"
        :first-last-button="true"
      ></paginate>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import ItemCard from "@/components/ItemCard.vue";
import Loader from "@/components/Loader.vue";
import Paginate from "vuejs-paginate"

const Items = namespace("Items");

@Component({
  components: {
    ItemCard,
    Loader,
    Paginate
  }
})
export default class ItemList extends Vue {
  private itemsPerPage: number = 10;
  private page: number = 1;
  private loading: boolean = false;
  private error: string = "";

  @Items.State("itemList")
  private itemList!: any;

  @Items.State("itemMaxCount")
  private itemMaxCount!: any;

  @Items.Action
  private getItemList!: (params: any) => Promise<any>;

  mounted() {
    this.loadItems();
  }

  get pageCount() {
    return Math.floor(this.itemMaxCount / this.itemsPerPage) + 1;
  }

  @Watch("page")
  loadItems() {
    this.loading = true;
    this.getItemList({ page: this.page, limit: this.itemsPerPage}).catch((err) => {
      this.error = err;
    }).finally(() => {
      this.loading = false;
    });
  }

  bidNow(item) {
    this.$router.push(`/item-details/${item.id}`);
  }
}
</script>

<style scoped>
.page-item {
  padding: 5px !important;
}
</style>
