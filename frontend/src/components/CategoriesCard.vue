<template>
  <q-item v-ripple clickable @click="setTarget">
    <q-item-section align="center" class="text-weight-bold text-h6">{{
      category.name
    }}</q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "CategoriesCard",
  emits: ["setCurrentTarget", "toggleModal"],
  props: {
    category: {
      type: Object,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    return {
      setTarget() {
        emit("setCurrentTarget", {
          ...props.category,
          position: props.position,
        });
        emit("toggleModal");
      },
    };
  },
});
</script>
