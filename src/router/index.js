import { createRouter, createWebHistory } from "vue-router"
import Home from "../components/pages/Home.vue"
import MovieDetail from "../components/pages/MovieDetail.vue"
import Favorites from "../components/pages/Favorites.vue"
import Search from "../components/pages/Search.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/movie/:id",
    name: "MovieDetail",
    component: MovieDetail,
    props: true,
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: Favorites,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
