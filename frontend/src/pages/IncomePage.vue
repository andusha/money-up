<template>
  <q-page class="flex flex-center primary-bg">
    <BalanceDonut :data="chartItems" :operationType="currentOperationType" />
    <q-btn
      to="/categories/income"
      label="Изменить категории"
      push
      class="absolute-top-right q-mr-md q-mt-md"
    />
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from "vue";

import BalanceDonut from "components/charts/BalanceDonut.vue";
import { useBalanceStore } from "src/stores/balance";
import { storeToRefs } from "pinia";

import { api } from "../boot/axios";
export default defineComponent({
  name: "IncomePage",
  components: { BalanceDonut },
  setup() {
    const balanceStore = useBalanceStore();
    balanceStore.setCurrentOperationType("income");
    const { chartItems, currentOperationType, token } = storeToRefs(balanceStore);
    onMounted(async () => {
      await balanceStore.setBalanceItems();
      balanceStore.setChartItems()
    })
    return {
      chartItems,
      currentOperationType,
    };
  },
});
</script>
