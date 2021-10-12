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
          <router-link :to="{name:'cart'}" class="breadcrumbs__link">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title" v-if="orderInfo">
        Заказ оформлен <span>№ {{orderInfo.id}}</span>
      </h1>
    </div>

    <section class="cart" v-if="orderInfo">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина.
            На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;
            течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{orderInfo.name}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{orderInfo.address}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{orderInfo.phone}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{orderInfo.email}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{orderInfo.paymentType}}
              </span>
            </li>
          </ul>
        </div>
        <BaseOrderInfoPanel :products="cardOrderInfo" :support="supportOrderInfo"/>
      </form>
    </section>
    <div v-else>
      <BaseBigPreloader/>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import BaseOrderInfoPanel from '@/components/BaseOrderInfoPanel.vue';
import BaseBigPreloader from '@/components/BaseBigPreloader.vue';

export default {
  name: 'OrderInfoPage',
  data() {
    return {

    };
  },
  components: {
    BaseOrderInfoPanel,
    BaseBigPreloader,
  },
  computed: {
    ...mapGetters({ orderInfo: 'orderInfo' }),
    cardOrderInfo() {
      return this.orderInfo.basket.items.map((item) => ({
        title: item.product.title,
        price: item.product.price,
        id: item.product.id,
        quantity: item.quantity,
      }));
    },
    supportOrderInfo() {
      return {
        deliveryPrice: this.orderInfo.deliveryType.price,
        numberItems: this.cartTotalsItems,
        orderFullPrice: this.orderInfo.totalPrice,
        deliveryTitle: this.orderInfo.deliveryType.title,
        howMany: this.howManyLocalItems,
      };
    },
    cartTotalsItems() {
      return this.orderInfo.basket.items
        .map((item) => item.quantity).reduce((sum, current) => sum + current, 0);
    },
    howManyLocalItems() {
      const appProductsAmount = this.cartTotalsItems;
      const last = appProductsAmount % 10;
      let output;
      // eslint-disable-next-line no-nested-ternary,no-unused-expressions
      (appProductsAmount >= 11 && appProductsAmount <= 20) ? output = 'товаров' : (last === 1) ? output = 'товар' : (last > 1 && last <= 4) ? output = 'товарa' : output = 'товаров';
      return output;
    },
  },
  created() {
    if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
      return;
    }
    this.$store.dispatch('loadOrderInfo', this.$route.params.id);
  },
};
</script>

<style scoped>
</style>
