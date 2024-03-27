import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    balanceModal: false,
    isAddModal: true,
    selectedItem: null,
  }),

  getters: {},

  actions: {
    toggleModal() {
      this.balanceModal = !this.balanceModal;
    },
    setSelectedItem(item) {
      this.selectedItem = item;
    },
    setAddModalTrue() {
      this.isAddModal = true;
    },
    setAddModalFalse() {
      this.isAddModal = false;
    },
  },
});
