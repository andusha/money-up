<template>
  <q-item dense>
    <q-item-section>{{ category.name }}</q-item-section>
    <q-item-section :class="['items-center', itemClass]">
      {{ sum }} ₽</q-item-section
    >
    <div class="flex items-center q-gutter-sm">
      <q-btn @click="toggleModal" unelevated round dense>
        <q-icon name="chevron_right" size="2rem" :class="itemClass"
      /></q-btn>
      <q-btn
        @click="removeItemOnClick(position)"
        unelevated
        text-color="red"
        round
        dense
        ><q-icon name="close"
      /></q-btn>
    </div>
  </q-item>
</template>

<script>
import { computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";

import { useModalStore } from "src/stores/modal";
import { useBalanceStore } from "src/stores/balance";

export default defineComponent({
  name: "DateCard",
  props: {
    operation: {
      type: String,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
    },
    category: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const balanceStore = useBalanceStore();
    const { currentOperationType } = storeToRefs(balanceStore);

    const modalStore = useModalStore();
    const { isAddModal } = storeToRefs(modalStore);
    const removeItemOnClick = (itemId) => {
      balanceStore.removeBalanceItem(itemId);
      balanceStore.setChartItems()
    };

    const toggleModal = () => {
      modalStore.toggleModal();
      modalStore.setAddModalFalse();
      modalStore.setSelectedItem(props);
    };

    const itemClass = computed(() => {
      return currentOperationType.value === "income"
        ? "income-text"
        : "expense-text";
    });
    return {
      currentOperationType,
      isAddModal,
      removeItemOnClick,
      toggleModal,

      itemClass,
    };
  },
});
</script>

<style lang="scss" scoped>
.expense-text {
  color: $primary;
}
.income-text {
  color: $positive;
}
</style>
