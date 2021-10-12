<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <li class="cart__order" v-for="product in products">
        <h3>{{product.title}}</h3>
        <b>{{product.price*product.quantity|numberFormat}} ₽</b>
        <span>Артикул: {{product.id}}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p> {{support.deliveryTitle}}: <b>{{support.deliveryPrice|numberFormat}}</b> ₽</p>
      <p>Итого: <b>{{support.numberItems}}</b> {{support.howMany}} на сумму <b>{{support.orderFullPrice|numberFormat}} </b>₽</p>
    </div>

    <slot></slot>
  </div>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";

export default {
  name: "BaseOrderInfoPanel",
  props:['products','support'],
  computed:{
  },
  filters:{
    numberFormat
  }
}
</script>

<style scoped>

</style>
