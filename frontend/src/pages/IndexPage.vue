<template>
  <q-page class="q-pt-md">
    <div class=""></div>
    <q-card class="card" flat round>
      <q-card-section class="">
        <div class="text-h4 text-weight-bold">{{ diff }} ₽</div>
        <div class="secondary-text q-mb-sm">баланс на сегодня</div>
      </q-card-section>
      <q-card-section class="row q-pa-none"
        ><div class="balance q-pa-sm q-pl-md expense">
          <div class="secondary-text">расходы</div>
          <div class="">{{ balanceStats.expense }} ₽</div>
        </div>
        <div class="balance q-pa-sm q-pl-md">
          <div class="secondary-text">доходы</div>
          <div class="">{{ balanceStats.income }} ₽</div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";

import { useBalanceStore } from "src/stores/balance";
import { api } from "src/boot/axios";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const balanceStore = useBalanceStore();
    balanceStore.setCurrentOperationType("expense");

    const { balanceStats } = storeToRefs(balanceStore);

    const diff = computed(() => {
      return balanceStats.value.income - balanceStats.value.expense;
    });
    onMounted(async () => {
      await balanceStore.setBalanceItems();
      await balanceStore.setBalanceStats();
    });
    return {
      diff,
      balanceStats
    };
  },
});
</script>

<style lang="scss" scoped>
.balance {
  width: 50%;
}
.card {
  width: 70%;
  background-color: rgba(217, 217, 217, 0.12);
  margin-left: auto;
  margin-right: auto;
  border-radius: 1rem;
}
.expense {
  background-color: rgba(217, 217, 217, 0.08);
  border-radius: 0px 0px 0px 1rem;
}
</style>
