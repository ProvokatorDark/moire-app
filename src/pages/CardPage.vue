<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name:'main'}" class="breadcrumbs__link">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
         {{$store.getters.cartTotalItems}} {{howManyItemsInfo}}
        </span>
      </div>
    </div>
    <div v-if="isCartLoading">
      <BaseBigPreloader/>
    </div>
    <section v-else class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in cartProducts" :key="item.productBascetId" :item="item"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{cartTotalPrice|numberFormat}} ₽</span>
          </p>

          <router-link tag="button"
                       :to="{name:'order'}"
                       class="cart__button button button--primery"
                       type="submit">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import CartItem from '@/components/CartItem.vue';
import howManyItemsInfo from '@/helpers/howManyItemsInfo';
import numberFormat from '@/helpers/numberFormat';
import BaseBigPreloader from '@/components/BaseBigPreloader.vue';

export default {
  name: 'CardPage',
  data() {
    return {

    };
  },
  components: {
    CartItem,
    BaseBigPreloader,
  },
  computed: {
    ...mapGetters({
      cartProducts: 'cartDetailProducts',
      cartTotalPrice: 'cartTotalPrice',
    }),
    howManyItemsInfo,
    isCartLoading() {
      return this.$store.state.isCartLoading;
    },
  },
  filters: {
    numberFormat,
  },
};
</script>

<style scoped>

</style>
