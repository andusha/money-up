<template>
  <q-page padding class="primary-bg">
    <CategoriesPage />
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from "vue";

import { useBalanceStore } from "src/stores/balance";
import CategoriesPage from "src/components/CategoriesPage.vue";

export default defineComponent({
  name: "IncomeCategoriesPage",
  components: { CategoriesPage },
  setup() {
    const balanceStore = useBalanceStore();
    balanceStore.setCurrentOperationType("income");
    return {};
  },
});
</script>
