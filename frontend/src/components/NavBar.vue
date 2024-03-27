<template>
  <q-item-label header class="title q-mb-lg">
    Money<span class="title-elem">Up</span>
  </q-item-label>
  <NavLink
    v-for="link in linksList"
    :key="link.title"
    v-bind="link"
    :toggleActive="toggleActive"
  />
</template>

<script>
import { defineComponent, ref } from "vue";

import NavLink from "./NavLink.vue";

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
  name: "NavBar",
  components: { NavLink },
  setup() {
    return {
      linksList,
      toggleActive(item) {
        for (let [key, value_] of Object.entries(linksList)) {
          if (value_.title === item) value_.isActive.value = true;
          else value_.isActive.value = false;
        }
      },
    };
  },
});
</script>

<style lang="scss" scoped>
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
