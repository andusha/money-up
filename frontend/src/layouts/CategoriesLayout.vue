<template>
  <q-layout view="hHh lpR fFf" class="inter">
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :width="200"
      class="secondary-bg"
    >
      <nav-bar />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

import NavBar from "../components/NavBar.vue";

export default defineComponent({
  name: "CategoriesLayout",
  components: { NavBar },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
