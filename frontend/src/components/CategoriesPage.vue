<template>
  <div class="wrapper">
    <h4>Изменить категории</h4>
    <q-list class="q-mt-sm grid">
      <CategoriesCard
        v-for="(category, index) in categoriesItems"
        :key="index"
        :category="category"
        :position="index"
        @setCurrentTarget="setCurrentTarget"
        @toggleModal="toggleModal"
      />
      <q-btn icon="add" @click="newCategory" class="bg-accent" />
    </q-list>
    <q-dialog v-model="modal">
      <CategoriesModal
        @toggleModal="toggleModal"
        :currentTarget="currentTarget"
      />
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { storeToRefs } from "pinia";

import { useBalanceStore } from "src/stores/balance";
import CategoriesCard from "src/components/CategoriesCard.vue";
import CategoriesModal from "src/components/CategoriesModal.vue";
export default defineComponent({
  name: "CategoriesPage",
  components: { CategoriesModal, CategoriesCard },
  setup() {
    const balanceStore = useBalanceStore();
    const { categoriesItems } = storeToRefs(balanceStore);

    const modal = ref(false);
    const currentTarget = ref(null);

    const toggleModal = () => {
      modal.value = !modal.value;
    };
    return {
      categoriesItems,
      currentTarget,
      setCurrentTarget(target) {
        currentTarget.value = target;
      },
      modal,
      toggleModal,
      newCategory() {
        currentTarget.value = null;
        toggleModal();
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
.wrapper {
  max-width: $breakpoint-sm-max;
  margin-left: auto;
  margin-right: auto;
}
</style>
