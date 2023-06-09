<template>
  <el-row class="h-100">
    <el-col class="hidden-sm-and-down" :md="3" />

    <el-col :md="7">
      <div class="d-flex h-100">
        <div class="my-auto w-100">
          <template v-if="step === 1">
            <el-row justify="start">
              <h1>Setup your Project</h1>
            </el-row>

            <el-row>
              <el-col>
                <p>
                  Projects are used to collaborate with colleagues and manage
                  campaigns as a team.
                </p>
              </el-col>
            </el-row>

            <el-row>
              <h4>What's your project's name?</h4>
            </el-row>

            <el-row justify="center">
              <el-col>
                <el-form-item
                  :error="getVuelidateErrorMessage(vuelidate.formData.title)"
                >
                  <el-input
                    v-model="formData.title"
                    size="large"
                    type="text"
                    placeholder="Project name"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-button round type="primary" @click="nextStep">
                Continue
              </el-button>
              <!--el-button round type="default" @click="skipAll">
                Skip
              </el-button-->
            </el-row>
          </template>

          <template v-else-if="step === 2">
            <el-row justify="start">
              <h1>Setup your Project</h1>
            </el-row>

            <el-row>
              <el-col>
                <p>
                  Projects are used to collaborate with colleagues and manage
                  campaigns as a team.
                </p>
              </el-col>
            </el-row>

            <el-row>
              <h4>Choose your project’s avatar</h4>
            </el-row>

            <el-row>
              <avatar-select v-model="formData.image" />
            </el-row>

            <el-row>
              <h4>or upload your own</h4>
            </el-row>

            <el-row justify="center">
              <el-col>
                <el-form-item class="d-flex">
                  <avatar-input v-model="formData.image" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-button round type="primary" @click="nextStep">
                Continue
              </el-button>
              <!--el-button round type="default" @click="skipAll">
                Skip
              </el-button-->
            </el-row>
          </template>
        </div>
      </div>
    </el-col>

    <el-col class="hidden-sm-and-down" :md="3" />

    <el-col :md="9">
      <el-card v-if="step === 0" class="h-100" shadow="never">
        <div class="d-flex">
          <div class="mx-auto">Decorative Illustration</div>
        </div>
      </el-card>
      <div
        v-else-if="step > 0"
        class="d-flex flex-column justify-content-center align-items-center h-100"
      >
        <el-card shadow="never" class="new-project-card align-center">
          <el-avatar
            shape="square"
            size="large"
            :src="
              'data:' + formData.image.type + ';base64,' + formData.image.data
            "
          />
          <h3>{{ formData.title }}</h3>
          1 member
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { minLength, required } from "@vuelidate/validators";
import Toast from "@/mixins/Toast.js";
import Vuelidate from "@/mixins/Vuelidate.js";
import SvgAvatar1 from "@/assets/bblock/avatar1.svg?raw";
import AvatarInput from "@/components/AvatarInput.vue";
import AvatarSelect from "@/components/AvatarSelect.vue";

export default {
  components: {
    AvatarSelect,
    AvatarInput,
  },
  mixins: [Toast, Vuelidate],
  data() {
    return {
      step: 1,
      formData: {
        image: {
          data: window.btoa(SvgAvatar1),
          type: "image/svg+xml",
        },
        title: "",
      },
    };
  },
  created() {
    if (this.$store.getters["Project/getProject"]) {
      this.$router.push("/");
    } else {
      this.$store.state.hideMenus = true;
    }
  },
  methods: {
    nextStep() {
      this.step++;
      if (this.step === 2) {
        this.vuelidate.$touch();

        if (this.vuelidate.$errors.length > 0) {
          this.step = 1;
        }
      } else if (this.step === 3) {
        this.done();
      }
    },
    async done() {
      const response = await this.$store.dispatch(
        "Project/createProject",
        this.formData
      );

      if (!response.success) {
        this.Toast("Failed to create project", response.data, "error");

        return;
      }

      this.$store.state.hideMenus = false;
      this.$router.push("/");
    },
  },
  validations() {
    return {
      formData: {
        title: {
          minLength: minLength(6),
          required,
        },
      },
    };
  },
};
</script>

<style lang="scss">
@use "@/design/vars.scss" as v;

.new-project-card {
  padding: 3em 6em 3em 6em;
  background-color: v.$color-lighter;

  h3 {
    margin: 1.5em 0 0.5em;
  }
}
</style>
