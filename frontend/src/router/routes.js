const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "income", component: () => import("pages/IncomePage.vue") },
      { path: "expense", component: () => import("pages/ExpensePage.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/signup",
    component: () => import("pages/Authentication.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
