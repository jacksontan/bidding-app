<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{ currentUser.username }}</strong> Profile
      </h3>
    </header>
    <p>
      <strong>Token:</strong>
      {{ currentUser.token.substring(0, 20) }} ...
      {{ currentUser.token.substr(currentUser.token.length - 20) }}
    </p>
    <p>
      <strong>Id:</strong>
      {{ currentUser.id }}
    </p>
    <p>
      <strong>Username:</strong>
      {{ currentUser.username }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
const Auth = namespace("Auth");

@Component
export default class Profile extends Vue {
  @Auth.State("user")
  private currentUser!: any;

  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  }
}
</script>
