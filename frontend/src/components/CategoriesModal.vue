<template>
  <q-card style="min-width: 360px" class="primary-bg">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-card-actions class="q-pb-none" align="right">
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="$emit('ToggleModal')"
        />
      </q-card-actions>
      <q-card-section class="q-pt-none">
        <q-input
          ref="categoryValidate"
          filled
          v-model="category"
          label="Название категории"
          label-color="grey-1"
          class="q-pb-none"
          :rules="[(val) => (val && val.length > 0) || 'Напишите что-нибудь']"
        />
      </q-card-section>
      <q-card-actions class="" align="between">
        <q-btn
          push
          label="Сохранить"
          type="submit"
          :class="currentTarget ? 'btn-w' : 'btn-w-full'"
        />
        <q-btn
          push
          label="Удалить"
          class="btn-w btn-color"
          v-if="currentTarget"
          @click="removeItemOnClick(currentTarget.position)"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script>
import { defineComponent, ref, watch } from "vue";
import { useQuasar } from "quasar";

import { useBalanceStore } from "src/stores/balance";

export default defineComponent({
  name: "CategoriesModal",
  emits: "toggleModal",
  props: {
    currentTarget: {
      type: [Object, null],
      required: true,
    },
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const category = props.currentTarget
      ? ref(props.currentTarget.name)
      : ref(props.currentTarget);
    const categoryValidate = ref(null);

    const balanceStore = useBalanceStore();

    watch(
      () => balanceStore.msg,
      () => {
        $q.notify({
          icon: balanceStore.msg.icon,
          color: balanceStore.msg.color,
          message: balanceStore.msg.msg,
        });
      }
    );
    return {
      category,
      categoryValidate,
      onSubmit() {
        categoryValidate.value.validate();
        if (!categoryValidate.value.hasError) {
          if (props.currentTarget) {
            balanceStore.updateCategoriesItem(props.currentTarget.position, {
              id: props.currentTarget.id,
              name: category.value,
            });
          } else balanceStore.addCategoriesItem({ name: category.value });
          emit("toggleModal");
        }
      },
      async removeItemOnClick(itemId) {
        await balanceStore.removeCategoriesItem(itemId);
        emit("toggleModal");
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.btn-w {
  width: 45%;
}
.btn-w-full {
  width: 100%;
}
.btn-color {
  background-color: $primary;
}
</style>
