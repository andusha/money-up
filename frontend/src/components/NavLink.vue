<template>
  <q-item
    clickableaCe
    :to="link"
    :active="isActive_"
    @click="toggleState(title)"
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
import { defineComponent, watch } from "vue";
import { useAuthStore } from "src/stores/auth";
import auth from "src/boot/auth";

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
  },

  emits: "toggleActive",
  setup(props, { emit }) {
    const authStore = useAuthStore();

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

      toggleState() {
        emit("toggleActive");
        if (props.title === "Выйти") authStore.logout();
      },
    };
  },
});
</script>
