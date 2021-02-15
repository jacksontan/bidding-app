import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import AutobidService from "@/services/AutobidService";

@Module({ namespaced: true })
class AutobidConfig extends VuexModule {
  public maxAmount: string = "";

  @Mutation
  public setMaxAmount(maxAmount: string): void {
    this.maxAmount = maxAmount;
  }

  @Action({ rawError: true })
  getAutobidConfig(user: string): Promise<any> {
    return AutobidService.getAutobidConfig(user).then((res) => {
      if (res.data && res.data.max_amount) {
        this.context.commit("setMaxAmount", res.data.max_amount);
      } else {
        this.context.commit("setMaxAmount", 0);
      }
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
  upsertAutobidConfig(user: string): Promise<any> {
    return AutobidService.upsertAutobidConfig(user, this.maxAmount).then((res) => {
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

export default AutobidConfig;
