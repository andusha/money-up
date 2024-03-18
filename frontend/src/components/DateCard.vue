<template>
  <q-item clickable v-ripple dense>
    <q-item-section>{{ category }}</q-item-section>
    <q-item-section  class="items-center" text-color="primary"> {{ sum }} ₽</q-item-section>
    <div class="flex items-center q-gutter-sm">
      <q-btn @click="toggleModal" unelevated round dense text-color="primary">
        <q-icon name="chevron_right" size="2rem"
      /></q-btn>
      <q-btn
        @click="removeItemOnClick(id)"
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
import { defineComponent, ref } from "vue";
import { useCategoriesStore } from "src/stores/categories";
import { storeToRefs } from "pinia";
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
      type: String,
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
  },
  setup(props) {
    const categoriesStore = useCategoriesStore();
    const { selectedItem, isAddModal } = storeToRefs(categoriesStore);
    const removeItemOnClick = (itemId) => {
      categoriesStore.removeDate(itemId);
    };

    const toggleModal = () => {
      categoriesStore.toggleModal();
      categoriesStore.setAddModalFalse();
      categoriesStore.setSelectedItem(props);
    };
    return {
      isAddModal,
      removeItemOnClick,
      toggleModal,
    };
  },
});
</script>
