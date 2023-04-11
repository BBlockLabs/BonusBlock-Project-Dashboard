<template>
  <el-button class="h-auto w-auto" @click="login">
    <component :is="icon" />
  </el-button>
</template>

<script>
import SvgGithub from "@/assets/icons/github.svg";
import SvgKeplr from "@/assets/icons/keplr.svg";
import SvgMetamask from "@/assets/icons/metamask.svg";
import Toast from "@/mixins/Toast";
import User from "@/state/models/User";

export default {
  mixins: [Toast],
  props: {
    type: {
      type: Number,
      required: true,
    },
  },
  emits: ["loginSuccess", "loginFailed", "loginError"],
  computed: {
    icon() {
      switch (this.type) {
        case User.LOGIN_METHOD_GITHUB:
          return SvgGithub;
        case User.LOGIN_METHOD_KEPLR:
          return SvgKeplr;
        case User.LOGIN_METHOD_METAMASK:
          return SvgMetamask;
      }

      return SvgKeplr;
    },
  },
  methods: {
    async login() {
      try {
        const response = await this.$store.dispatch("Auth/ssoLogin", this.type);

        if (!response.success) {
          this.Toast("Failed to login", "", "error");

          this.$emit("loginFailed", response.errors);

          return;
        }

        this.Toast("Logged in successfully", "", "success", 1500);

        this.$emit("loginSuccess", response.data);
      } catch (e) {
        this.$emit("loginError", e);
        this.ToastError(e, "login");
        console.error(e);
      }
    },
  },
};
</script>

<style scoped lang="scss">
button {
  width: auto;
  height: auto;
  padding: 8px;
}
svg {
  height: 32px;
  width: 32px;
}
</style>