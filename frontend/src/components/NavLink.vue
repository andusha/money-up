<template>
  <q-item
    clickableaCe
    :to="link"
    :active="isActive_"
    @click="toggleActive(title)"
    class="q-pa-sm q-pl-md"
    active-class="bg-accent primary-text"
    dark
  >
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "NavLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      default: "#",
    },

    isActive: {
      type: Object,
    },

    toggleActive: {
      type: Function,
    },
  },
  setup(props) {
    const isActive_ = props.isActive;
    watch(
      () => props.isActive,
      (first) => {
        isActive_.value = first.value;
      },
      { deep: true }
    );
    return {
      isActive_,
    };
  },
});
</script>
