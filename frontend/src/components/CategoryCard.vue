<template>
  <q-item dense>
    <q-item-section>{{ category }}</q-item-section>
    <q-item-section side class="text-weight-bold" color="grey-1"
      >{{ sum }} ₽</q-item-section
    >
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "CategoryCard",
  props: {
    category: {
      type: String,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    console.log(...props.category)
    return {};
  },
});
</script>
