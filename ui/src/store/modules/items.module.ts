import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import ItemService from "@/services/ItemService";
import AutobidService from "@/services/AutobidService";

@Module({ namespaced: true })
class Items extends VuexModule {
  public itemMaxCount = 0;
  public itemList = [];
  public selectedItem: any;
  public bids = [];

  @Mutation
  public setItemList(items: any): void {
    this.itemList = items;
  }

  @Mutation
  public setItemMaxCount(count: number): void {
    this.itemMaxCount = count;
  }

  @Mutation
  public setSelectedItem(item: any): void {
    this.selectedItem = item;
  }

  @Mutation
  public setBids(bids: any): void {
    this.bids = bids;
  }

  @Action({ rawError: true })
  async getItemList({page, limit}): Promise<any> {
    try {
      const itemCountRes = await ItemService.getItemCount();
      let result = [];
      if (itemCountRes.data && itemCountRes.data[0] && itemCountRes.data[0].item_count) {
        this.context.commit("setItemMaxCount", itemCountRes.data[0].item_count);
        const res = await ItemService.getItemList(page, limit);
        this.context.commit("setItemList", res.data);
        result = res.data;
      }
      return Promise.resolve(result);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      throw message;
    }
  }

  @Action({ rawError: true })
  getItemDetails(id: string): Promise<any> {
    return ItemService.getItemDetails(id).then((res) => {
      this.context.commit("setSelectedItem", res.data[0]);
      return Promise.resolve(res);
    }).catch((error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return Promise.reject(message);
    });
  }

  @Action({ rawError: true })
  async bidItem(bidInfo: any): Promise<any> {
    try {
      const bidRes = await ItemService.bid(bidInfo)
      if (bidInfo.isAutobid) {
        await AutobidService.createAutobid({item_id: bidInfo.item_id, user: bidInfo.user});
      } else if (bidInfo.autobidId) {
        await AutobidService.deleteAutobid(bidInfo.autobidId);
      }
      return bidRes;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      throw message;
    }
  }

  @Action({ rawError: true })
  getBids(itemId: string): Promise<any> {
    return ItemService.getBids(itemId).then((res) => {
      this.context.commit("setBids", res.data);
      return Promise.resolve(res);
    }).catch((error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return Promise.reject(message);
    });
  }
}

export default Items;
