<template>
  <el-container v-cloak>
    <component
      :is="$mq.sm ? 'el-drawer' : 'el-aside'"
      v-if="$store.getters['Auth/isLoggedIn'] && !$store.state.hideMenus"
      v-model="$store.state.menuOpened"
      :direction="'ltr'"
      class="br-solid d-flex flex-column smaller-body-top-padding"
      style="background: #FFF"
      width="auto"
      size="200"
    >
      <navigation />
    </component>

    <el-container vertical>
      <el-header
        v-if="$store.getters['Auth/isLoggedIn']"
        class="bb-solid"
      >
        <page-head />
      </el-header>

      <el-main class="d-flex main-container">
        <div class="w-100" :style="{ padding: $route.meta.pagePadding }">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import PageHead from "@/components/PageHead.vue";
import Navigation from "@/components/NavigationMenu.vue";

export default {
  components: {
    PageHead,
    Navigation,
  },
  async mounted() {
    this.removeLoader();

    Document.debugToggle = () => this.$store.commit("toggleDebug");
  },
  methods: {
    removeLoader() {
      this.$nextTick(() => {
        document.getElementById("loader").classList.add("fadeOut");
        setTimeout(() => {
          document.getElementById("loader").style.display = "none";
        }, 400);
      });
    },
  },
};
</script>
