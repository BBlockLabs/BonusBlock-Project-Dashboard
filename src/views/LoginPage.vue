<template>
  <el-row class="h-100" justify="center">
    <el-col :md="11" class="hidden-sm-and-down">
      <el-card class="h-100 img-home" shadow="never"></el-card>
    </el-col>

    <el-col class="hidden-sm-and-down" :md="1" />

    <el-col :md="11" class="d-flex flex-column justify-content-between">
      <el-row justify="space-between">
        <el-col :span="12" class="align-left">
          <!--h4 class="m-0">
            Not a project?
            <br />
            <router-link to="/register"> Register as user</router-link>
          </h4-->
        </el-col>
        <el-col :span="12" class="align-right bblock-logo">
          <b-block-logo />
        </el-col>
      </el-row>

      <el-row v-loading="loading">
        <div class="m-auto w-50">
          <el-row justify="center">
            <el-col :span="-1">
              <h1 class="my-0">Sign In</h1>
            </el-col>
          </el-row>

          <el-row justify="center" class="mt-2">
            <el-col :span="-1">
              Not registered yet?
              <router-link to="/register"> Sign up</router-link>
            </el-col>
          </el-row>

          <el-row justify="center" class="mt-3">
            <el-col :span="-1">
              <sso-login-button
                :type="User.LOGIN_METHOD_KEPLR"
                @login-success="loggedIn"
                @login-loading="loadingState"
              />
              <sso-login-button
                :type="User.LOGIN_METHOD_METAMASK"
                @login-success="loggedIn"
                @login-loading="loadingState"
              />
              <!--              <sso-login-button
                :type="User.LOGIN_METHOD_GITHUB"
                @login-success="loggedIn"
              />-->
            </el-col>
          </el-row>

          <el-row justify="center" class="mt-5 mb-5">
            <el-col>
              <div class="d-flex">
                <div class="bt-solid my-auto w-100" />
                <div class="mx-2 w-auto">or</div>
                <div class="bt-solid my-auto w-100" />
              </div>
            </el-col>
          </el-row>

          <el-row justify="center" class="mt-2">
            <el-col>
              <login-form
                @login-success="loggedIn"
                @login-loading="loadingState"
              />
            </el-col>
          </el-row>
        </div>
      </el-row>
      <login-footer />
    </el-col>
  </el-row>
</template>

<script>
import SsoLoginButton from "@/components/SsoLoginButton.vue";
import LoginForm from "@/components/LoginForm.vue";
import User from "@/state/models/User";
import BBlockLogo from "@/assets/bblock/logo.svg";
import LoginFooter from "@/components/LoginFooter.vue";

export default {
  components: {
    SsoLoginButton,
    LoginForm,
    BBlockLogo,
    LoginFooter,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    User: () => User,
  },
  methods: {
    loadingState(state) {
      this.loading = state;
    },
    loggedIn() {
      if (this.$route.query?.from) {
        this.$router.push(this.$route.query.from);
        return;
      }

      if (this.$store.getters["Project/getProject"]) {
        this.$router.push("/");
      } else {
        this.$router.push("/create-project");
      }
    },
  },
};
</script>
