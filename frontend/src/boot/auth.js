import { boot } from "quasar/wrappers";
import { useAuthStore } from "src/stores/auth";
import { api } from "./axios";

export default boot(({ router, store }) => {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore(store);
    const isToken = authStore.getIsToken;
    if (isToken) await authStore.testIsAuth()

    const isAuthorized = authStore.getIsAuth
    if (!isAuthorized && !(to.path === "/signup")) {
      router.push({ path: "/signup" });
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    api.defaults.headers[
      "authorization"
    ] = `Bearer ${accessToken}`;
  });
});
