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
  name: "ExpenseCategoriesPage",
  components: { CategoriesPage },
  setup() {
    const balanceStore = useBalanceStore();
    balanceStore.setCurrentOperationType('expense');
    onMounted(async () => {
      
      //await balanceStore.setCategoriesItems();
    });
    return {};
  },
});
</script>
