import { defineStore } from "pinia";
import { uid, date } from "quasar";
import { api } from "src/boot/axios";

export const useBalanceStore = defineStore("balance", {
  state: () => ({
    balanceItems: [],
    token: "",
    chartItems: {},
    categoriesItems: [],
    msg: null,
    currentDate: "",
    currentOperationType: "",
    balanceStats: { income: 0, expense: 0 },
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
    async addBalanceItem(data) {
      let dateId = uid();
      data.id = dateId;
      if (
        data.date.includes(this.currentDate) &&
        data.operation === this.currentOperationType
      ) {
        this.balanceItems.push(data);
      }

      const dataToServer = {
        ...data,
        category_id: data.category.id,
      };

      await api
        .post("/balance/", dataToServer)
        .then((response) => {
          if (response.status === 200) {
            console.log(response);
            console.log(response);
          } else {
            console.log(response.status);
          }
        })
        .catch((error) => {
          this.msg = {
            icon: "error",
            color: "negative",
            msg: error.response.data.detail,
          };
          console.log(error);
          throw error.response.data.detail;
        });
    },
    async removeBalanceItem(id) {
      const balanceId = this.balanceItems[id].id;
      this.balanceItems.splice(id, 1);

      await api
        .delete(`/balance/${balanceId}`)
        .then((response) => {
          if (response.status === 200) {
            console.log(response);
          } else {
            console.log(response.status);
          }
        })
        .catch((error) => {
          this.msg = {
            icon: "error",
            color: "negative",
            msg: error.response.data.detail,
          };
          console.log(error);
          throw error.response.data.detail;
        });
    },
    async updateBalanceItem(id, data) {
      const balanceId = this.balanceItems[id].id;
      this.balanceItems[id] = data;

      const dataToServer = {
        ...data,
        category_id: data.category.id,
      };
      await api
        .patch(`/balance/${balanceId}`, dataToServer)
        .then((response) => {
          if (response.status === 200) {
            console.log(response);
          } else {
            console.log(response.status);
          }
        })
        .catch((error) => {
          this.msg = {
            icon: "error",
            color: "negative",
            msg: error.response.data.detail,
          };
          throw error.response.data.detail;
        });
    },

    async setBalanceItems() {
      await api
        .get("/balance", {
          params: {
            date: this.currentDate,
            operation: this.currentOperationType,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log(response);
            this.balanceItems = response.data;
          } else {
            console.log(response.status);
          }
        })
        .catch((error) => {
          this.msg = {
            icon: "error",
            color: "negative",
            msg: error.response.data.detail,
          };
          console.log(error);
          throw error.response.data.detail;
        });
    },

    setCurrentDate(currentDate = null) {
      if (!currentDate) {
        const date_ = new Date();
        this.currentDate = date.formatDate(date_, "YYYY-MM");
        return;
      }
      this.currentDate = currentDate;
    },

    setCurrentOperationType(route) {
      this.currentOperationType = route;
    },

    async updateCategoriesItem(data) {
      const FindcategoryIndex = (category) => {
        return data.id === category.id
      };
      
      data.operation = this.currentOperationType;
      const categoryIndex = this.categoriesItems.findIndex(FindcategoryIndex)
      this.categoriesItems[categoryIndex] = data;

      console.log(this.categoriesItems, data, categoryIndex);
      await api
        .patch(`/categories/${data.id}`, data)
        .then((response) => {
          if (response.status === 200) {
            this.msg = response.data;
          } else {
            console.log(response.status);
          }
        })
        .catch((error) => {
          this.msg = {
            icon: "error",
            color: "negative",
            msg: error.response.data.detail,
          };
          console.log(error);
          throw error.response.data.detail;
        });
    },

    async addCategoriesItem(data) {
      let categoryId = uid();
      data.id = categoryId;
      data.operation = this.currentOperationType;
      this.categoriesItems.push(data);

      await api
        .post("/categories/", data)
        .then((response) => {
          if (response.status === 200) {
            this.msg = response.data;
          } else {
            console.log(response.status);
          }
        })
        .catch((error) => {
          this.msg = {
            icon: "error",
            color: "negative",
            msg: error.response.data.detail,
          };
          console.log(error);
          throw error.response.data.detail;
        });
    },

    async removeCategoriesItem(id) {
      const FindcategoryIndex = (category) => {
        return category.id === id
      };
      const categoryIndex = this.categoriesItems.findIndex(FindcategoryIndex)

      console.log(id, this.categoriesItems)
      await api
        .delete(`/categories/${id}`)
        .then((response) => {
          if (response.status === 200) {
            this.categoriesItems.splice(categoryIndex, 1);
            this.msg = response.data;
          } else {
            console.log(response.status);
          }
        })
        .catch((error) => {
          this.msg = {
            icon: "error",
            color: "negative",
            msg: error.response.data.detail,
          };
          console.log(error);
          throw error.response.data.detail;
        });
    },

    async setCategoriesItems() {
      await api
        .get("/categories/")
        .then((response) => {
          if (response.status === 200) {
            console.log(response);
            this.categoriesItems = response.data;
          } else {
            console.log(response.status);
          }
        })
        .catch((error) => {
          this.msg = {
            icon: "error",
            color: "negative",
            msg: error.response.data.detail,
          };
          console.log(error);
          throw error.response.data.detail;
        });
    },

    setChartItems() {
      let data = {
        labels: [],
        series: [],
      };

      const formatedCategories = this.getFormatedCategoriesItems;
      console.log(formatedCategories);
      for (const [label, series] of Object.entries(formatedCategories)) {
        data.labels.push(label);
        data.series.push(series);
      }

      this.chartItems = data;
    },

    async setBalanceStats() {
      await api
        .get("/balance/sort", {
          params: {
            date: this.currentDate,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.balanceStats = response.data;
          }
        })
        .catch((error) => {});
    },
    updateBalanceStats(operation, sum) {
      this.balanceStats[operation] += sum;
    },
  },
});
