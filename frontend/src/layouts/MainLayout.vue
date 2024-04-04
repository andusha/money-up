<template>
  <q-layout view="lhr lpR fFf" class="bg-dark inter">
    <q-header class="text-white primary-bg q-pt-sm">
      <q-toolbar class="flex justify-between">
        <q-btn dense flat @click="toggleLeftDrawer" class="drawer-btn">
          <q-img src="~assets/menu.svg" style="width: 25px" />
        </q-btn>
        <div class="flex items-center justify-between month-slider-container">
          <q-btn dense flat label="<" class="control-btn" @click="prevMonth" />
          <div class="secondary-text">{{ month }}</div>
          <q-btn dense flat label=">" class="control-btn" @click="nextMonth" />
        </div>
        <q-btn dense flat @click="toggleRightDrawer" class="drawer-btn">
          <q-img src="~assets/menu-2.svg" style="width: 25px" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      class="secondary-bg"
      dark
      :width="200"
    >
      <q-list>
        <nav-bar />
      </q-list>
    </q-drawer>

    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      class="primary-bg"
      dark
      :width="400"
    >
      <AddBalance />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";

import { date } from "quasar";

import NavBar from "../components/NavBar.vue";
import AddBalance from "../components/AddBalance.vue";

import { useBalanceStore } from "src/stores/balance";

export default defineComponent({
  components: { NavBar, AddBalance },
  name: "MainLayout",

  setup() {
    const balanceStore = useBalanceStore();

    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);

    balanceStore.setCurrentDate();
    const fullCurrentDate = ref(balanceStore.getFullCurrentDate);
    let formatCurrentDate = date.formatDate(fullCurrentDate.value, "MMMM");
    const month = ref(formatCurrentDate);

    watch(
      () => balanceStore.currentDate,
      () => {
        fullCurrentDate.value = balanceStore.getFullCurrentDate;
        formatCurrentDate = date.formatDate(fullCurrentDate.value, "MMMM");
        month.value = formatCurrentDate;
      }
    );
    async function DateFunc(newDate) {
      const formatedNewDate = date
        .formatDate(newDate, "YYYY-MM-DD")
        .slice(0, 7);
      balanceStore.setCurrentDate(formatedNewDate);
      await balanceStore.setBalanceItems();
      await balanceStore.setBalanceStats();
      balanceStore.setChartItems();
    }

    onMounted(async () => {
      await balanceStore.setCategoriesItems()
    });
    return {
      month,

      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },

      nextMonth() {
        const newDate = date.addToDate(fullCurrentDate.value, { months: 1 });
        DateFunc(newDate);
      },
      prevMonth() {
        const newDate = date.subtractFromDate(fullCurrentDate.value, {
          months: 1,
        });
        DateFunc(newDate);
      },
    };
  },
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Bevan&display=swap");

.drawer-btn {
  @media (min-width: $breakpoint-sm-max) {
    display: none;
  }
}
.control-btn {
  font-size: 1.5rem;
  color: $secondary-text;
  padding-top: 0;
  padding-bottom: 0;
}
.month-slider-container {
  min-width: 30%;

  @media (min-width: $breakpoint-sm-max) {
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 5rem;
  }
}
</style>
