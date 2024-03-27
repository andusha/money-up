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
  {
    path: "/categories",
    component: () => import("layouts/CategoriesLayout.vue"),
    children: [
      {
        path: "income",
        component: () => import("pages/IncomeCategoriesPage.vue"),
      },
      {
        path: "expense",
        component: () => import("pages/ExpenseCategoriesPage.vue"),
      },
    ],
  },
  {
    path: "/signup",
    component: () => import("pages/AuthenticationPage.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
