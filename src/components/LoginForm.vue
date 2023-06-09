<template>
  <el-form @submit.prevent="login">
    <el-row justify="center">
      <el-col>
        <el-form-item
          :error="getVuelidateErrorMessage(vuelidate.formData.username)"
        >
          <el-input
            v-model="formData.username"
            size="large"
            type="text"
            placeholder="Email"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><mail /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row justify="center">
      <el-col>
        <el-form-item
          :error="getVuelidateErrorMessage(vuelidate.formData.password)"
        >
          <el-input
            v-model="formData.password"
            size="large"
            type="password"
            placeholder="Password"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <!--el-row justify="center">
      <router-link to="/register"> Forgot your password? </router-link>
    </el-row-->

    <el-row justify="center" class="mt-4">
      <el-col :md="-1">
        <el-button round class="w-100" type="primary" @click="login">
          Log in <el-icon class="ml-2"><right /></el-icon>
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Toast from "@/mixins/Toast";
import Vuelidate from "@/mixins/Vuelidate";
import { required, minLength } from "@vuelidate/validators";
import Mail from "@/assets/icons/mail.svg";

export default {
  components: {
    Mail,
  },
  mixins: [Toast, Vuelidate],
  emits: ["loginSuccess", "loginFailed", "loginError", "loginLoading"],
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      this.vuelidate.$touch();

      if (this.vuelidate.$errors.length > 0) {
        return;
      }

      const passwordHash = await crypto.subtle
        .digest(
          "SHA-512",
          new TextEncoder("utf-8").encode(
            this.formData.username + this.formData.password
          )
        )
        .then((buf) => {
          return Array.prototype.map
            .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
            .join("");
        });

      const loginData = {
        username: this.formData.username,
        password: passwordHash,
      };

      this.$emit("loginLoading", true);

      try {
        const response = await this.$store.dispatch("Auth/login", loginData);

        if (!response.success) {
          this.Toast("Failed to login", response.data, "error", 0, "login-failed");
          this.$emit("loginFailed", response.errors);
          return;
        }

        Toast.methods.dismissToast("session-expired");
        Toast.methods.dismissToast("login-failed");

        this.$emit("loginSuccess", response.data);
      } catch (e) {
        this.$emit("loginError", e);
        this.ToastError(e, "login");
        console.error("login failed", e);
      } finally {
        this.$emit("loginLoading", false);
      }
    },
  },
  validations() {
    return {
      formData: {
        username: {
          minLength: minLength(4),
          required,
        },
        password: {
          minLength: minLength(4),
          required,
        },
      },
    };
  },
};
</script>
