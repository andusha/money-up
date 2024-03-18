<template>
  <q-layout view="lhr lpR fFf" class="bg-dark inter">
    <q-header class="text-white primary-bg q-pt-sm">
      <q-toolbar class="flex justify-between">
        <q-btn dense flat @click="toggleLeftDrawer" class="drawer-btn">
          <q-img src="~assets/menu.svg" style="width: 25px" />
        </q-btn>
        <div class="flex items-center justify-between month-slider-container">
          <q-btn dense flat label="<" class="control-btn" @click="prevMonth" />
          <div class="secondary-text">апрель</div>
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
        <q-item-label header class="title q-mb-lg">
          Money<span class="title-elem">Up</span>
        </q-item-label>
        <NavLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          :toggleActive="toggleActive"
        />
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
import { defineComponent, ref } from "vue";
import NavLink from "../components/NavLink.vue";
import AddBalance from "../components/AddBalance.vue";
import { useRoute, useRouter } from 'vue-router'
import { useCategoriesStore } from "src/stores/categories";

const linksList = [
  {
    title: "Главная",
    link: "/",
    isActive: ref(true),
  },
  {
    title: "Доходы",
    link: "/income",
    isActive: ref(false),
  },
  {
    title: "Расходы",
    link: "/expense",
    isActive: ref(false),
  },
  {
    title: "Регистрация",
    link: "/signup",
    isActive: ref(false),
  },
];
export default defineComponent({
  components: { NavLink, AddBalance },
  name: "MainLayout",

  setup() {
    const route = useRoute()
    console.log(route.path)
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);

    const categoriesStore = useCategoriesStore();
    return {
      linksList,

      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },

      toggleActive(item) {
        for (let [key, value_] of Object.entries(linksList)) {
          if (value_.title === item) value_.isActive.value = true;
          else value_.isActive.value = false;
        }
      },
      nextMonth() {
        categoriesStore.setCurrentDate("2024-04");
      },
      prevMonth() {
        categoriesStore.setCurrentDate("2024-03");
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

.title {
  font-family: "Bevan", serif;
  font-weight: 400;
  font-style: normal;
  font-size: x-large;
  color: $primary-text;

  .title-elem {
    color: $primary-btn;
  }
}
</style>
