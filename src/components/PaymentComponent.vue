<template>
  <el-row>
    <el-col>
      <el-button @click="payWithMetamask"> Deposit with Metamask </el-button>
    </el-col>

    <el-col>
      <el-button @click="payWithKeplr"> Deposit with Keplr </el-button>
    </el-col>

    <el-divider content-position="center">or</el-divider>

    <el-card>
      <el-row justify="space-between">
        <el-col :span="-1">Wallet:</el-col>
        <el-col :span="-1">{{ payment.wallet }}</el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="-1">Memo:</el-col>
        <el-col :span="-1">{{ payment.memo }}</el-col>
      </el-row>
    </el-card>

    <p>
      The payment must be submitted within 30 minutes. You have
      {{ minutesLeft }} minutes left.
    </p>

    <el-row justify="space-around">
      <el-col :span="-1"> Payment status check in 28 seconds </el-col>
      <el-col :span="-1"> loading </el-col>
    </el-row>

    <el-row justify="center">
      <el-col>
        <el-button>Cancel Payment</el-button>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import Payment from "@/state/models/Payment.js";
import moment from "moment";

export default {
  props: {
    paymentId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    payment() {
      return (
        this.$store.getters["Payment/getPayment"](this.paymentId) ||
        new Payment()
      );
    },
    minutesLeft() {
      return moment().diff(this.payment.deadline, "minutes", true);
    },
  },
  methods: {
    async cancelPayment() {
      this.loading = true;
      this.loading = false;
    },
    async payWithKeplr() {
      this.loading = true;
      this.loading = false;
    },
    async payWithMetamask() {
      this.loading = true;
      this.loading = false;
    },
  },
};
</script>