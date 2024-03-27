<template>
  <div class="q-pt-xl q-px-lg template items-center">
    <q-tabs
      v-model="tab"
      active-color="primary"
      class="secondary-text bg-accent tabs"
      no-caps
    >
      <q-tab name="date" label="по дате" />
      <q-tab name="category" label="по категории" />
    </q-tabs>
    <div v-if="tab === 'date'">
      <ListByDate
        v-for="(itemsObject, date, index) in balanceItems"
        :key="index"
        :itemsObject="itemsObject"
        :date="date"
        class="q-mt-md"
      />
    </div>
    <div v-else>
      <q-list class="q-mt-sm">
        <CategoryCard
          v-for="(sum, category, index) in categories"
          :key="index"
          :category="category"
          :sum="sum"
          class="q-mt-md"
        />
      </q-list>
    </div>
    <div class="absolute-bottom q-mb-lg text-center">
      <q-btn
        push
        round
        class="btn"
        icon="add"
        size="1.7rem"
        :color="btnClass"
        @click="toggleModal"
      />
    </div>

    <AddBalanceModal />
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue";

import { storeToRefs } from "pinia";
import { useBalanceStore } from "src/stores/balance";
import { useModalStore } from "src/stores/modal";

import AddBalanceModal from "./AddBalanceModal.vue";
import ListByDate from "./ListByDate.vue";
import CategoryCard from "./CategoryCard.vue";

export default defineComponent({
  name: "AddBalance",
  components: { AddBalanceModal, ListByDate, CategoryCard },
  setup() {
    const balanceStore = useBalanceStore();
    const { currentOperationType } = storeToRefs(balanceStore);

    const modalStore = useModalStore();
    const { isAddModal, balanceModal } = storeToRefs(modalStore);

    const tab = ref("date");
    const balanceItems = ref(balanceStore.getFormatedBalanceItems);
    const categories = ref(balanceStore.getFormatedCategoriesItems);
    watch(
      () => balanceStore.balanceItems,
      () => {
        balanceItems.value = balanceStore.getFormatedBalanceItems;
        categories.value = balanceStore.getFormatedCategoriesItems;
      },
      { deep: true }
    );
    const btnClass = computed(() => {
      return currentOperationType.value === "income" ? "positive" : "indigo-9";
    });
    const toggleModal = () => {
      modalStore.toggleModal();
      modalStore.setAddModalTrue();
    };
    return {
      currentOperationType,
      categories,
      isAddModal,
      toggleModal,
      balanceItems,

      tab,
      balanceModal,

      btnClass,
    };
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
}
.template {
  min-height: 100vh;
}
.btn {
  width: fit-content;
}
</style>
