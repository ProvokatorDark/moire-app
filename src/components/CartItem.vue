<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.productImgUrl"
           :alt="item.productTitle"
           width="120" height="120"
          >
    </div>
    <h3 class="product__title">
      {{item.productTitle}}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{backgroundColor:item.productColorCode}"></i>
                  {{item.productColorTitle}}
      </span>
    </p>
    <span class="product__code">
                Артикул: {{item.productId}}
              </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар"
              @click="updateLocalCartProductAmount(item.productQuantity-1)">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="item.productQuantity">

      <button type="button" aria-label="Добавить один товар"
              @click="updateLocalCartProductAmount(item.productQuantity+1)">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{item.productPrice|numberFormat}} ₽
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
            @click.prevent="deleteProduct(item.productBascetId)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from '../helpers/numberFormat';

export default {
  name: 'CartItem',
  props: {
    item: Object,
  },
  filters: { numberFormat },
  methods: {
    deleteProduct(id) {
      this.$store.dispatch('deleteCartProduct', id);
    },
    updateLocalCartProductAmount(value) {
      if (value >= 1) {
        this.$store.dispatch('updateCartProductAmount', { basketItemId: this.item.productBascetId, quantity: value });
      }
    },
  },
  computed: {
    amount: {
      get() {
        return this.item.productQuantity;
      },
      set(value) {
        this.$store.dispatch('updateLocalCartProductAmount', { basketItemId: this.item.productBascetId, quantity: value });
      },
    },

  },

};
</script>

<style scoped>
  .product__del{
    cursor: pointer;
  }
</style>
