import Vue from 'vue';
import VueRouter, { RouteConfig } from "vue-router";
import ItemList from '@/components/ItemList.vue';
import ItemDetails from '@/components/ItemDetails.vue';
import Login from '@/components/Login.vue';
import AutobidConfig from '@/components/AutobidConfig.vue';
import Profile from '@/components/Profile.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: ItemList
  },
  {
    path: '/items',
    component: ItemList
  },
  {
    path: '/item-details/:id',
    component: ItemDetails
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/autobid-config/:user',
    component: AutobidConfig
  },
  {
    path: '/profile',
    component: Profile
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;


