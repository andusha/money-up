<template>
  <q-layout view="hHh lpR fFf" class="inter primary-bg">
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :width="200"
      class="secondary-bg"
    >
      <nav-bar />
    </q-drawer>
    <q-btn dense flat @click="toggleLeftDrawer" class="drawer-btn q-ma-md">
      <q-img src="~assets/menu.svg" style="width: 25px"
    /></q-btn>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";

import NavBar from "../components/NavBar.vue";
import { useBalanceStore } from "src/stores/balance";

export default defineComponent({
  name: "CategoriesLayout",
  components: { NavBar },
  setup() {
    const balanceStore = useBalanceStore()
    const leftDrawerOpen = ref(false);

    onMounted(async () => {
      await balanceStore.setCategoriesItems()
    });
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
