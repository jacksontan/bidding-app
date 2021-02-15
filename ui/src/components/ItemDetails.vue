<template>
  <div class="container mt-4 flex mx-auto col-sm-6 border p-3">
    <Loader v-if="loading"/>
    <form @submit.prevent="handleBid">
      <div class="form-group">
        <h4>Bidding ends in... {{ endTime.days }} days {{ endTime.hours }} hours {{ endTime.minutes }} minutes {{ endTime.seconds }} seconds</h4>
      </div>
      <div class="form-group">
        <label>Name: </label>
        <div class="pl-2">{{ item.name }}</div>
      </div>
      <div class="form-group">
        <label>Description: </label>
        <div class="pl-2">{{ item.description }}</div>
      </div>
      <div class="form-group">
        <label>Amount to bid: </label>
        <div class="pl-2">$ {{ item.amount + 1 }}</div>
      </div>
      <div class="d-flex">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitDisabled">Submit Bid</button>
        <span class="mx-2">
          <input id="autobid" type="checkbox" v-model="isAutobid" style="cursor:pointer;"/>
          <label for="autobid" class="mx-2" style="cursor:pointer;">Autobid</label>
        </span>
      </div>
      <div
        v-if="error"
        class="alert alert-danger"
        role="alert"
      >
        {{ error }}
      </div>
    </form>
    <h4 class="mt-4">Bid History</h4>
    <table class="table">
      <th>User</th>
      <th>Amount</th>
      <th>Date</th>
      <th>Autobid</th>
      <tr v-for="bid in bidsHistory" :key="bid.id">
        <td>{{ bid.user }}
        <td>$ {{ bid.amount }}</td>
        <td>{{ bid.date }}</td>
        <td>{{ bid.is_autobid ? "Yes" : "No" }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Loader from "@/components/Loader.vue";
const Items = namespace("Items");
const Auth = namespace("Auth");

@Component({
  components: {
    Loader
  }
})
export default class ItemDetails extends Vue {
  private isAutobid:boolean = false;
  private loading: boolean = false;
  private error: string = "";

  @Items.State("selectedItem")
  private item!: any;

  @Items.State("bids")
  private bidsHistory!: any;

  @Auth.State("user")
  private user!: any;

  private endTime: any = {
    "days": 0,
    "hours": 0,
    "minutes": 0,
    "seconds": 0
  };

  mounted() {
    this.loading = true;
    this.getItemDetails(this.$route.params.id)
    .then(() => {
      this.startTimer();
      this.isAutobid = !!this.item.autobid_id;
    })
    .finally(() => {
      this.loading = false;
    });
    this.getBids(this.$route.params.id);
  }

  @Items.Action
  private getItemDetails!: (id: string) => Promise<any>;

  @Items.Action
  private bidItem!: (bidInfo: any) => Promise<any>;

  @Items.Action
  private getBids!: (itemId: string) => Promise<any>;

  startTimer() {
    const timer = setInterval(() => {
      if (!this.item) {
        return clearInterval(timer);
      }
      const endDate = new Date(this.item.bid_end_date);
      const now = new Date();
      let timeDiff = (endDate.getTime() - now.getTime()) / 1000;
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / 86400);
        timeDiff -= days * 86400;
        const hours = Math.floor(timeDiff / 3600) % 24;
        timeDiff -= hours * 3600;
        const minutes = Math.floor(timeDiff / 60) % 60;
        timeDiff -= minutes * 60;
        this.endTime.days = days;
        this.endTime.hours = hours;
        this.endTime.minutes = minutes;
        this.endTime.seconds = Math.floor(timeDiff);
      } else {
        clearInterval(timer);
      }
    }, 1000)
  }

  handleBid() {
    this.loading = true;
    this.bidItem({
      item_id: this.item.id,
      user: this.user.username,
      amount: this.item.amount + 1,
      autobidId: this.item.autobid_id,
      isAutobid: this.isAutobid
    })
    .then(() => {
      alert("Successfully bid on item");
      location.reload();
    }).catch((err) => {
      this.error = err
    }).finally(() => {
      this.loading = false;
    });
  }

  get isSubmitDisabled(): boolean {
    const isExpired = this.endTime.days === 0 && this.endTime.hours === 0 && this.endTime.minutes === 0 && this.endTime.seconds === 0;
    const isLastBidder = this.bidsHistory[0] && this.bidsHistory[0].user === this.user.username;
    return isExpired || isLastBidder;
  }
}
</script>
