<template>
  <div class="col-md-6 mt-5 mx-auto">
    <Loader v-if="loading"/>
    <div class="card card-container p-3">
      <form name="form" @submit.prevent="handleSubmit">
        <h2>Autobid config</h2>
        <div class="form-group">
          <label>User: </label>
          <span class="pl-2">{{ user.username }}</span>
        </div>
        <div class="form-group">
          <label for="password">Maximum Amount (shared in all items)</label>
          <span class="pl-2">
            <input
              v-model="inputAmount"
              v-validate="'required'"
              type="number"
              class="form-control"
              name="maxAmount"
            />
          </span>
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block">
            <span>Save</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
        </div>
      </form>
    </div>
    <div
      v-if="error"
      class="alert alert-danger"
      role="alert"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Loader from "@/components/Loader.vue";

const AutobidConfig = namespace("AutobidConfig");
const Auth = namespace("Auth");

@Component({
  components: {
    Loader
  }
})
export default class Login extends Vue {
  private loading: boolean = false;
  private error: string = "";

  @Auth.State("user")
  private user: string;

  @AutobidConfig.State("maxAmount")
  private maxAmount: string;

  get inputAmount() {
    return this.maxAmount;
  }

  set inputAmount(value) {
    this.$store.commit("AutobidConfig/setMaxAmount", value);
  }

  @AutobidConfig.Action
  private getAutobidConfig!: (user: string) => Promise<any>;

  @AutobidConfig.Action
  private upsertAutobidConfig!: (user: string) => Promise<any>;

  mounted() {
    this.loading = true;
    this.getAutobidConfig(this.$route.params.user)
    .finally(() => {
      this.loading = false;
    });
  }

  handleSubmit() {
    this.loading = true;
    this.$validator.validateAll().then((isValid) => {
      if (!isValid) {
        this.loading = false;
        return;
      }

      if (this.maxAmount) {
        this.upsertAutobidConfig(this.$route.params.user)
        .then(() => {
          alert("Successfully saved autobid config");
        })
        .catch((err) => {
          this.error = err;
        })
        .finally(() => {
          this.loading = false;
        });
      }
    });
  }
}
</script>

<style scoped>
</style>
