<template>
  <div>
    <div class="flex items-center justify-between">
      <span>{{ date }}</span>
      <span class="text-weight-bold">{{ sum() }} ₽</span>
    </div>
    <q-list class="q-mt-sm bg-accent">
      <DateCard
        v-for="(item, key) in itemsObject"
        :key="key"
        v-bind="item"
        :position="key"
      />
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DateCard from "./DateCard.vue";
export default defineComponent({
  name: "ListByDate",
  components: { DateCard },
  props: {
    itemsObject: {
      type: Object,
    },
    date: {
      type: String,
    },
  },
  setup(props) {
    const sum = () => {
      let sum = 0;
      for (let key in props.itemsObject) {
        sum += props.itemsObject[key].sum
      }
      return sum;
    };
    return {
      sum,
    };
  },
});
</script>
