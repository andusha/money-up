<template>
  <q-dialog v-model="balanceModal" persistent>
    <q-card style="min-width: 360px" class="primary-bg">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-card-actions class="q-pb-none" align="right">
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            @click="toggleActive"
          />
        </q-card-actions>
        <q-card-section class="q-pt-none">
          <q-select
            filled
            v-model="operation"
            :options="operationOptions"
            label="Вид операции"
            class="q-pb-none"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            ref="sumValidate"
            filled
            v-model="sum"
            label="сумма"
            lazy-rules
            type="number"
            prefix="₽"
            :rules="[(val) => (val && val.length > 0) || 'Напишите что-нибудь']"
          />
        </q-card-section>

        <q-card-section class="q-pt-none q-mt-none">
          <q-select
            filled
            v-model="category"
            :options="categoryOptions"
            ref="categoryValidate"
            :rules="[(val) => (val && val.length > 0) || 'Выберите что-нибудь']"
            label="Категория"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            filled
            v-model="date_"
            mask="##.##.##"
            :rules="[
              (v) =>
                /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
                  v
                ),
            ]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date_" mask="DD.MM.YY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions class="">
          <q-btn push label="Сохранить" type="submit" class="btn-full" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { date } from "quasar";
import { storeToRefs } from "pinia";
import { useCategoriesStore } from "src/stores/categories";

export default defineComponent({
  name: "AddBalanceModal",
  setup() {
    const categoriesStore = useCategoriesStore();
    const { isAddModal, selectedItem, balanceModal } =
      storeToRefs(categoriesStore);

    const sum = ref(null);
    const sumValidate = ref(null);

    const operation = ref("Google");
    const operationOptions = [
      "Google",
      "Facebook",
      "Twitter",
      "Apple",
      "Oracle",
    ];

    const category = ref("");
    const categoryValidate = ref(null);
    const categoryOptions = ["Oracle", "jija"];

    const timeStamp = Date.now();
    const formattedString = date.formatDate(timeStamp, "DD.MM.YY");
    const date_ = ref(formattedString);

    watch(
      [() => categoriesStore.isAddModal, () => categoriesStore.selectedItem],
      () => {
        if (!categoriesStore.isAddModal) {
          date_.value = selectedItem.value.date;
          operation.value = selectedItem.value.operation;
          category.value = selectedItem.value.category;
          sum.value = selectedItem.value.sum;
        } else {
          date_.value = formattedString;
          operation.value = selectedItem.value.operation;
          category.value = null;
          sum.value = null;
        }
      }
    );
    const toggleActive = () => {
      categoriesStore.toggleModal();
    };
    return {
      balanceModal,
      toggleActive,

      operation,
      operationOptions,
      category,
      categoryValidate,
      categoryOptions,

      date_,

      sum,
      sumValidate,
      onSubmit() {
        sumValidate.value.validate();
        categoryValidate.value.validate();
        console.log(isAddModal.value);
        if (!sumValidate.value.hasError && !categoryValidate.value.hasError) {
          const dayToStamp = date.extractDate(date_.value, "DD.MM.YY");
          const item_date = date.formatDate(dayToStamp, "YYYY-MM-DD");
          if (isAddModal.value) {
            categoriesStore.addDate({
              sum: Number(sum.value),
              operation: operation.value,
              category: category.value,
              date: item_date,
            });
          } else {
            console.log(selectedItem.value);
            categoriesStore.updateDate(selectedItem.value.id, {
              sum: Number(sum.value),
              operation: operation.value,
              category: category.value,
              date: item_date,
            });
          }
          toggleActive();
          sum.value = null;
          category.value = null;
        }
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.btn-full {
  width: 100%;
  background-color: $accent;
}
</style>
