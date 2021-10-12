import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from "@/pages/ProductPage";
import NotFoundPage from "@/pages/NotFoundPage";
import CardPage from "@/pages/CardPage";
import OrderPage from "@/pages/OrderPage";
import OrderInfoPage from "@/pages/OrderInfoPage";

Vue.use(VueRouter);

const routes = [
  {name: 'main', component: MainPage, path: '/'},
  {name: 'product', component: ProductPage, path: '/product/:id'},
  {name:'cart',component:CardPage, path:'/cart'},
  {name:'order',component:OrderPage, path:'/order'},
  {name:'orderInfo',component:OrderInfoPage, path:'/order/:id'},
  {name: 'notFound',component: NotFoundPage, path:'*'},
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

export default router;
