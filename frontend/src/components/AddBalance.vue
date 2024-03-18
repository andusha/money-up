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
        v-for="(itemsObject, date, index) in date[currentDate]"
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
        color="indigo-9"
        icon="add"
        size="1.7rem"
        @click="toggleModal"
      />
    </div>

    <AddBalanceModal :isAdd="true" />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

import { storeToRefs } from "pinia";
import { useCategoriesStore } from "src/stores/categories";

import AddBalanceModal from "./AddBalanceModal.vue";
import ListByDate from "./ListByDate.vue";
import CategoryCard from "./CategoryCard.vue";

export default defineComponent({
  name: "AddBalance",
  components: { AddBalanceModal, ListByDate, CategoryCard },
  setup() {
    const categoriesStore = useCategoriesStore();
    const tab = ref("date");

    const { isAddModal, balanceModal, currentDate } =
      storeToRefs(categoriesStore);

    const date = ref(categoriesStore.getFormatedDateItems);
    const categories = ref(categoriesStore.getFormatedCategoriesItems);
    watch(
      () => categoriesStore.date,
      () => {
        date.value = categoriesStore.getFormatedDateItems;
        categories.value = categoriesStore.getFormatedCategoriesItems;
      },
      { deep: true }
    );
    const toggleModal = () => {
      categoriesStore.toggleModal();
      categoriesStore.setAddModalTrue();
    };
    return {
      categories,
      isAddModal,
      toggleModal,
      date,
      currentDate,

      tab,
      balanceModal,
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
