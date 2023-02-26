import { createRouter, createWebHistory } from "vue-router"
import ViewHome from "../views/home/ViewHome.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: "/",
    name: "home",
    component: ViewHome,
  }, {
    path: "/sign-up", component: () => import("../views/user/ViewSignUp.vue"),
  }, {
    path: "/sign-in", component: () => import("../views/user/ViewSignIn.vue"),
  }, {
    path: "/trade-diary", component: () => import("../views/trade/ViewTradeDiary.vue"),
  }, {
    path: "/funding-diary", component: () => import("../views/funding/ViewFundingDiary.vue"),
  }, {
    path: "/port-life", component: () => import("../views/port/ViewPortLife.vue"),
  }, {
    path: "/about", name: "about", component: () => import("../views/home/ViewAbout.vue"),
  }, {
    path: "/:username", component: () => import("../views/trade/ViewTradeDiary.vue"),
  },
  ],
})

export default router



