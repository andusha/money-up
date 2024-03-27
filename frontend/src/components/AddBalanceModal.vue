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
            :color="operationClass"
            :bg-color="operationClass"
            label-color="grey-1"
            class="q-pb-none"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            ref="sumValidate"
            filled
            v-model.number="sum"
            type="number"
            label="сумма"
            lazy-rules
            prefix="₽"
            :rules="[(val) => val || 'Укажите сумму']"
          />
        </q-card-section>

        <q-card-section class="q-pt-none q-mt-none">
          <q-select
            filled
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            @filter="filterFn"
            v-model="category"
            :options="categoryOptions"
            option-value="id"
            option-label="name"
            ref="categoryValidate"
            :rules="[(val) => val || 'Выберите что-нибудь']"
            label="Категория"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Ничего не найденно
                </q-item-section>
              </q-item>
            </template>
          </q-select>
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
import { computed, defineComponent, ref, watch } from "vue";
import { date } from "quasar";
import { storeToRefs } from "pinia";
import { useModalStore } from "src/stores/modal";
import { useBalanceStore } from "src/stores/balance";

export default defineComponent({
  name: "AddBalanceModal",
  setup() {
    const modalStore = useModalStore();
    const { isAddModal, selectedItem, balanceModal } = storeToRefs(modalStore);

    const balanceStore = useBalanceStore();
    const { currentOperationType } = storeToRefs(balanceStore);

    const sum = ref(null);
    const sumValidate = ref(null);

    const operation = ref(null);
    const operationOptions = [
      { value: "income", label: "Доход" },
      { value: "expense", label: "Расход" },
    ];
    const operationClass = computed(() => {
      return operation.value.value === "income" ? "green" : "primary";
    });

    const category = ref("");
    const categoryValidate = ref(null);
    const categoryOptions = ref(balanceStore.getCategoriesItems);

    const timeStamp = Date.now();
    const formattedString = date.formatDate(timeStamp, "DD.MM.YY");
    const date_ = ref(formattedString);

    watch(
      [() => modalStore.balanceModal, () => modalStore.selectedItem],
      () => {
        if (!isAddModal.value) {
          const dayToStamp = date.extractDate(
            selectedItem.value.date,
            "YYYY-MM-DD"
          );
          const item_date = date.formatDate(dayToStamp, "DD.MM.YY");
          date_.value = item_date;

          operation.value =
            selectedItem.value.operation === "income"
              ? operationOptions[0]
              : operationOptions[1];
          category.value = selectedItem.value.category;
          sum.value = selectedItem.value.sum;
        } else {
          date_.value = formattedString;
          operation.value =
            currentOperationType.value === "income"
              ? operationOptions[0]
              : operationOptions[1];
          category.value = null;
          sum.value = null;
        }
      }
    );

    const toggleActive = () => {
      modalStore.toggleModal();
    };
    return {
      balanceModal,
      toggleActive,

      operation,
      operationOptions,
      operationClass,
      category,
      categoryValidate,
      categoryOptions,
      date_,
      sum,
      sumValidate,
      onSubmit() {
        sumValidate.value.validate();
        categoryValidate.value.validate();
        if (!sumValidate.value.hasError && !categoryValidate.value.hasError) {
          const dayToStamp = date.extractDate(date_.value, "DD.MM.YY");
          const item_date = date.formatDate(dayToStamp, "YYYY-MM-DD");
          if (isAddModal.value) {
            balanceStore.addBalanceItem({
              sum: sum.value,
              operation: operation.value.value,
              category: category.value,
              date: item_date,
            });
          } else {
            balanceStore.updateBalanceItem(selectedItem.value.position, {
              id: selectedItem.value.id,
              sum: sum.value,
              operation: operation.value.value,
              category: category.value,
              date: item_date,
            });
          }
          balanceStore.setChartItems();
          toggleActive();
          sum.value = null;
          category.value = null;
        }
      },
      filterFn(val, update, abort) {
        update(() => {
          const needle = val.toLowerCase();
          categoryOptions.value = balanceStore.getCategoriesItems.filter(
            (v) => v.name.toLowerCase().indexOf(needle) > -1
          );
        });
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
.bg-income {
  background-color: $green;
  color: $green;
}
</style>
