import { defineStore } from "pinia";
import { uid, date } from "quasar";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    date: {},
    currentDate: "2024-03",
    balanceModal: false,
    isAddModal: true,
    selectedItem: null,
  }),

  getters: {
    getFormatedDateItems() {
      let items = {};

      for (let [key, value] of Object.entries(this.date)) {
        let month = value.date.slice(0, 7);
        let day = date.formatDate(value.date, "ddd, D MMMM");
        let dateId = key;
        const payload = {
          [day]: {
            [dateId]: value,
          },
        };
        if (items.hasOwnProperty(month)) {
          if (items[month].hasOwnProperty(day))
            items[month][day][dateId] = payload[day][dateId];
          else items[month][day] = payload[day];
        } else items[month] = payload;
      }

      return items;
    },
    getFormatedCategoriesItems() {
      let items = {};
      for (let [key, value] of Object.entries(this.date)) {
        if (items.hasOwnProperty(value.category)) {
          items[value.category] += value.sum;
        } else items[value.category] = value.sum;
      }
      return items;
    },
  },

  actions: {
    addDate(data) {
      let dateId = uid();
      this.date[dateId] = data;
    },
    setCurrentDate(currentDate) {
      this.currentDate = currentDate;
    },
    toggleModal() {
      this.balanceModal = !this.balanceModal;
    },
    removeDate(id) {
      delete this.date[id];
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
    updateDate(id, data) {
      this.date[id] = data;
    },
  },
});
