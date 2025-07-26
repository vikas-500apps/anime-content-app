import { createRouter, createWebHistory } from "vue-router"
import { useContentStore } from "@/stores/content"

// Lazy load components for better performance
const LoginView = () => import("@/views/LoginView.vue")
const CardView = () => import("@/views/CardView.vue")
const DetailView = () => import("@/views/DetailView.vue")

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: "/card",
    name: "Card",
    component: CardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/detail",
    name: "Detail",
    component: DetailView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const contentStore = useContentStore()

  if (to.meta.requiresAuth && !contentStore.isAuthenticated) {
    next("/login")
  } else if (to.meta.requiresGuest && contentStore.isAuthenticated) {
    next("/card")
  } else {
    next()
  }
})

export default router
