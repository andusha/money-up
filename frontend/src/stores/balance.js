import { defineStore } from "pinia";
import { uid, date } from "quasar";

const url = "https://1bc906bf212c0c14.mokky.dev/item?";

export const useBalanceStore = defineStore("balance", {
  state: () => ({
    balanceItems: [],
    chartItems: {},
    categoriesItems: [
      {
        id: "1",
        name: "зарплата",
      },
      {
        id: "12",
        name: "подработка",
      },
    ],
    currentDate: "2024-03",
    currentOperationType: '',
  }),

  getters: {
    getFormatedBalanceItems() {
      let items = {};

      for (let [key, value] of Object.entries(this.balanceItems)) {
        let day = date.formatDate(value.date, "ddd, D MMMM");
        let dateId = key;
        const payload = {
          [day]: {
            [dateId]: value,
          },
        };
        if (items.hasOwnProperty(day))
          items[day][dateId] = payload[day][dateId];
        else items[day] = payload[day];
      }

      return items;
    },
    getFormatedCategoriesItems() {
      let items = {};
      for (let [key, value] of Object.entries(this.balanceItems)) {
        if (items.hasOwnProperty(value.category.name)) {
          items[value.category.name] += value.sum;
        } else items[value.category.name] = value.sum;
      }
      return items;
    },
    getFullCurrentDate() {
      return this.currentDate + "-01";
    },

    getCategoriesItems() {
      return this.categoriesItems;
    },
  },

  actions: {
    addBalanceItem(data) {
      let dateId = uid();
      data.id = dateId;
      if (data.date.includes(this.currentDate)) this.balanceItems.push(data);
    },
    removeBalanceItem(id) {
      this.balanceItems.splice(id, 1);
    },
    updateBalanceItem(id, data) {
      this.balanceItems[id] = data;
    },

    async setBalanceItems() {
      const FormatedOperationType = this.currentOperationType
        ? this.currentOperationType
        : "expense";

      const resp = await fetch(
        `${url}date=*${this.currentDate}&operation=${FormatedOperationType}`
      );
      const items = await resp.json();

      if (!resp.ok) {
        throw new Error(items.message || "Something went wrong");
      }

      this.balanceItems = items;

      this.setChartItems()
    },

    setCurrentDate(currentDate) {
      if (!currentDate) {
        const date_ = new Date();
        this.currentDate = date.formatDate(date_);
        return;
      }
      this.currentDate = currentDate;
    },
    setCurrentOperationType(route) {
      this.currentOperationType = route;
    },

    updateCategoriesItem(id, data) {
      this.categoriesItems[id] = data;
    },
    addCategoriesItem(data) {
      let categoryId = uid();
      data.id = categoryId;
      this.categoriesItems.push(data);
    },
    removeCategoriesItem(id) {
      this.categoriesItems.splice(id, 1);
    },
    async setCategoriesItems() {
      //
    },

    setChartItems() {
      let data = {
        labels: [],
        series: [],
      };

      const formatedCategories =  this.getFormatedCategoriesItems;
      console.log(this.balanceItems)
      for (const [label, series] of Object.entries(formatedCategories)) {
        data.labels.push(label);
        data.series.push(series);
      }

      this.chartItems = data
    },
  },
});
