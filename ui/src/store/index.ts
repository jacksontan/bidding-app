import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import Auth from "./modules/auth.module";
import Items from "./modules/items.module";

import AutobidConfig from "./modules/autobids.module";
Vue.use(Vuex);

const storage = new VuexPersist({
  key: "client.bidding.app",
  storage: window.localStorage,
  modules: ["Auth", "Items", "AutobidConfig"],
});

export default new Vuex.Store({
  modules: {
    Auth,
    Items,
    AutobidConfig
  },
  plugins: [storage.plugin],
});
