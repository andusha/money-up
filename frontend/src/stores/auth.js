import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuth: false,
    accessToken: localStorage.getItem("access_token"),
    msg: null,
  }),

  getters: {
    getIsToken() {
      return this.accessToken ? true : false;
    },
    getIsAuth() {
      return this.isAuth;
    },
  },

  actions: {
    async login(email, password) {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      await api
        .post("/auth/token", formData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response);
            this.accessToken = response.data.access_token;
            localStorage.setItem("access_token", response.data.access_token);
            api.defaults.headers[
              "authorization"
            ] = `Bearer ${response.data.access_token}`;
            this.msg = {
              icon: "done",
              color: "positive",
              msg: "Вы успешно авторизовались",
            };
          } else {
            console.log(
              "Ошибка получения информации о текущем пользователе. Код состояния:",
              response.status
            );
          }
        })
        .catch((err) => {
          this.msg =
            err.response.status === 401
              ? {
                  icon: "error",
                  color: "negative",
                  msg: "Неверный логин или пароль",
                }
              : "";
          throw this.msg.msg;
        });
    },
    async signup(email, password) {
      await api
        .post("/auth/register", {
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.status === 200) {
            this.msg = {
              icon: "done",
              color: "positive",
              msg: "Вы успешно зарегистрировались",
            };
          } else {
            console.log(
              "Ошибка получения информации о текущем пользователе. Код состояния:",
              response.status
            );
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

    logout() {
      localStorage.removeItem("access_token");
      this.accessToken = null;
    },

    async testIsAuth() {
      await api
        .get("/private", {
          headers: {
            authorization: `Bearer ${this.accessToken}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.isAuth = true;
          }
        })
        .catch((error) => {
          this.isAuth = false;
        });
    },
  },
});
